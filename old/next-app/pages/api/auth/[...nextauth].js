import NextAuth from "next-auth"
const { MongoClient } = require('mongodb');
import DiscordProvider from "next-auth/providers/discord"

const uri = process.env.MONGO_URI;
const mClient = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const {encrypt} = require('../../../utils/encrypt');
const {decrypt} = require('../../../utils/decrypt');
const {genEncryptKey} = require('../../../utils/genEncryptKey');

export const authOptions = {
  // Configure one or more authentication providers
  	providers: [
		DiscordProvider({
			clientId: process.env.DISCORD_CLIENT_ID,
			clientSecret: process.env.DISCORD_CLIENT_SECRET,
			authorization: { params: { scope: 'identify guilds email guilds.members.read' } },
			profile: (profile) => {
			return {
				id: profile.id,
				name: profile.username,
				image: `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.png`,
				email: profile.email,
				guilds: profile.guilds,
			}
			}
		})
  	],

  // when the user is signed in we want to edit the signin callback to do some logic
  callbacks: {

	async jwt({ token, account }) {
		// Persist the OAuth access_token to the token right after signin
		if (account) {
			console.log(token.jit)
			console.log(account.jit)
			console.log(token.jti)
			console.log(account.jti)
			// get the users guilds
			const guildReq = await fetch('https://discord.com/api/users/@me/guilds', {
				method: 'GET',
				headers: {
					authorization: `${account.token_type} ${account.access_token}`,
				},
			}).then(res => res.json());

			// check which guilds the bot is in
			const permsGuilds = guildReq.filter(guild => guild.permissions & 0x00000020);

			// now check what guilds from permGuilds are in the database
			const db = mClient.db('main');
			const guilds = await db.collection('guilds').find({}).toArray();

			const guildsInDb = [];
			const guildsNotInDb = [];

			permsGuilds.forEach(guild => {
				const guildInDb = guilds.find(dbGuild => dbGuild.id === guild.id);
				if (guildInDb) {
					guildsInDb.push(guildInDb);
				} else {
					guildsNotInDb.push(guild);
				}
			});

			// then see if the user is in the database
			const user = await db.collection('webUsers').findOne({ discordId: account.providerAccountId });
			if (!user) {
				// the user is not in the db, so we need to add them
				const encryptKey = genEncryptKey();
				const userData = {
					discordId: account.providerAccountId,
					encryptKey: encrypt(encryptKey, process.env.ENCRYPT_KEY),
					email: encrypt(account.email, encryptKey),
					username: encrypt(account.name, encryptKey),
					discriminator: encrypt(account.discriminator, encryptKey),
					avatar: encrypt(account.avatar, encryptKey),
					locale: encrypt(account.locale, encryptKey),
					tokenType: encrypt(account.token_type, encryptKey),
					accessToken: encrypt(account.access_token, encryptKey),
					refreshToken: encrypt(account.refresh_token, encryptKey),
					jti: token.jti,
					permsGuilds: guildsInDb,
					createdAt: new Date(),
					updatedAt: new Date(),
				}
				// insert an expiry document for the user
				await db.collection('webUsers').insertOne(userData);

			} else {

				// find the user in the db and update their data
				const encryptKey = decrypt(user.encryptKey, process.env.ENCRYPT_KEY);
				const userData = {
					discordId: account.providerAccountId,
					encryptKey: encrypt(encryptKey, process.env.ENCRYPT_KEY),
					email: encrypt(account.email, encryptKey),
					username: encrypt(account.name, encryptKey),
					discriminator: encrypt(account.discriminator, encryptKey),
					avatar: encrypt(account.avatar, encryptKey),
					locale: encrypt(account.locale, encryptKey),
					tokenType: encrypt(account.token_type, encryptKey),
					accessToken: encrypt(account.access_token, encryptKey),
					refreshToken: encrypt(account.refresh_token, encryptKey),
					permsGuilds: guildsInDb,
					jti: token.jti,
					updatedAt: new Date(),
				}

				await db.collection('webUsers').updateOne({ discordId: account.providerAccountId }, { $set: userData });

			}
			token.guilds = guildsInDb;
			token.userId = account.providerAccountId;
		}
		
		return token
	},
	async session({ session, token, user }) {
		session.guilds = token.guilds
		session.user.id = token.userId
		session.jti = token.jti
		
		if (token.jti) {
			const userDoc = await mClient.db('main').collection('webUsers').findOne({ discordId: token.userId });
			if (userDoc) {
				if (userDoc.jti !== token.jti) {
					await mClient.db('main').collection('webUsers').updateOne({ discordId: token.userId }, { $set: { jti: token.jti } });
				}
			} 
		}

		return session
	}
  },
}
export default NextAuth(authOptions)	