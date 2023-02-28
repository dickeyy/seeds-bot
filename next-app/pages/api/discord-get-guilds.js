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
    const { authData } = req.body;
    
    if (req.method === 'POST') {
        try {
          // make a post request to discord to get the access token
          try {
			
            const userResult = await request('https://discord.com/api/users/@me/guilds', {
                method: 'GET',
                headers: {
                    authorization: `${authData.tokenType} ${authData.accessToken}`,
                },
            });

            const guildData = await userResult.body.json();

            // check which guilds the bot is in
            const permsGuilds = guildData.filter(guild => guild.permissions & 0x00000020);

            // now check what guilds from permGuilds are in the database
            const db = mClient.db('main');
            const guilds = await db.collection('guilds').find({}).toArray();

            const guildsInDb = [];
            const guildsNotInDb = [];

            permsGuilds.forEach(guild => {
                const guildInDb = guilds.find(dbGuild => dbGuild.discordId === guild.id);
                if (guildInDb) {
                    guildsInDb.push(guildInDb);
                } else {
                    guildsNotInDb.push(guild);
                }
            });
            

            return res.status(200).json({
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
