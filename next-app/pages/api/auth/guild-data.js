// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const { MongoClient } = require('mongodb');

const uri = process.env.MONGO_URI;
const mClient = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const {encrypt} = require('../../../utils/encrypt');
const {decrypt} = require('../../../utils/decrypt');
const {genSessionId} = require('../../../utils/genSessionId');

export default async function handler(req, res) {
    
    // get the session id and guild id from the params
    const { sessionId, guildId } = req.query;
    
    if (req.method === 'GET') {
        try {
          
            const db = mClient.db('main');

            if (!sessionId) {
                return res.status(401).json({
                    error: 'No session ID provided'
                });
            }

            if (!guildId) {
                return res.status(401).json({
                    error: 'No guild ID provided'
                });
            }

            const userDoc = await db.collection('webUsers').findOne({jti: sessionId});

            if (!userDoc) {
                return res.status(401).json({
                    error: 'Invalid session id'
                });
            }

            // verify the user has perms for the guild
            // to do this, check if the guildId is in the array of ids in the userDoc.guilds array
            const guild = userDoc.permsGuilds.find(guild => guild.id === guildId);

            if (!guild) {
                return res.status(401).json({
                    error: 'Improper permissions'
                });
            }

            // get the guild data from the database
            const guildDoc = await db.collection('guilds').findOne({id: guildId});

            if (!guildDoc) {
                return res.status(401).json({
                    error: 'Invalid guild id'
                });
            }

            // return the guild data
            res.status(200).json({
                guild: guildDoc
            });


        } catch (err) {
          res.status(err.statusCode || 500).json(err.message);
        }
      } else {
        res.setHeader('Allow', 'GET');
        res.status(405).end('Method Not Allowed');
    }

};
