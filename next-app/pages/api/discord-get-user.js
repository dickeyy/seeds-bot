// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const { MongoClient } = require('mongodb');
const { request } = require('undici');

const uri = process.env.MONGO_URI;
const mClient = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const {encrypt} = require('../../utils/encrypt');
const {decrypt} = require('../../utils/decrypt');
const {genSessionId} = require('../../utils/genSessionId');

export default async function handler(req, res) {
    
    // get params from request body
    const { sessionId } = req.body;
    
    if (req.method === 'POST') {
        try {
          // make a post request to discord to get the access token
          try {

            // first get the session data from the database
            const db = mClient.db('main');

            const sessionDoc = await db.collection('sessions').findOne({sessionId: sessionId});

            if (!sessionDoc) {
                return res.status(401).json({
                    error: 'Invalid session id'
                });
            }

            // then get the user    
            const userDoc = await db.collection('webUsers').findOne({discordId: sessionDoc.discordId});
            
            if (!userDoc) {
                return res.status(401).json({
                    error: 'Cant find user'
                });
            }

            // then decrypt the encrypt password
            const decryptedPassword = decrypt(userDoc.encryptKey, process.env.ENCRYPT_KEY);

            // then get the access token
            const accessToken = decrypt(sessionDoc.accessToken, decryptedPassword);
			
            const guildRes = await request('https://discord.com/api/users/@me/guilds', {
                method: 'GET',
                headers: {
                    authorization: `Bearer ${accessToken}`,
                },
            });

            const guildData = await guildRes.body.json();

            if (!guildData) {
                return res.status(500).json({
                    error: 'Error getting guilds'
                });
            }

            
            // get the guilds from the database
            const dbGuilds = await db.collection('guilds').find({}).toArray();

            // the guild that has the bot will be in the dbGuilds array
            const guildsInDb = [];
            const guildsNotInDb = [];

            // apply a filter to the guildData array
            const permsGuilds = guildData.filter(guild => guild.permissions & 0x00000020);

            // now check what guilds from permGuilds are in the database
            permsGuilds.forEach(guild => {
                const check = dbGuilds.find(dbGuild => dbGuild.id === guild.id);

                if (check) {
                    guildsInDb.push({
                        name: check.name,
                        icon: check.icon,
                        id: check.id
                    });
                } else {
                    guildsNotInDb.push({
                        name: guild.name,
                        icon: guild.icon,
                        id: guild.id
                    });
                }
            });

            return res.status(200).json({
                userData: {
                    email: decrypt(userDoc.email, decryptedPassword),
                    username: decrypt(userDoc.username, decryptedPassword),
                    discriminator: decrypt(userDoc.discriminator, decryptedPassword),
                    avatar: decrypt(userDoc.avatar, decryptedPassword),
                    locale: decrypt(userDoc.locale, decryptedPassword),
                    discordId: userDoc.discordId
                },
                guildsInDb: guildsInDb,
                guildsNotInDb: guildsNotInDb
            });

		} catch (error) {
			// NOTE: An unauthorized token will not throw an error
			// tokenResponseData.statusCode will be 401
			console.error(error);
		}

        } catch (err) {
          res.status(err.statusCode || 500).json(err.message);
        }
      } else {
        res.setHeader('Allow', 'POST');
        res.status(405).end('Method Not Allowed');
    }
};
