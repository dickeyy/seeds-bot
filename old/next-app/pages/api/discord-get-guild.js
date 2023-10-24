// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const { MongoClient } = require('mongodb');
const { request } = require('undici');

const uri = process.env.MONGO_URI;
const mClient = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const {encrypt} = require('../../utils/encrypt');
const {decrypt} = require('../../utils/decrypt');
const {genSessionId} = require('../../utils/genSessionId');

export default async function handler(req, res) {
    
    // get the session id and guild id from the params
    const { sessionId, guildId } = req.query;

    console.log(sessionId, guildId);
    
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

            // get the session data from the database
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

            // verify the user has perms for the guild
            // to do this, check if the guildId is in the array of ids in the userDoc.guilds array
            const guild = userDoc.guilds.find(guild => guild === guildId);

            console.log(guild);

            if (!guild) {
                return res.status(401).json({
                    error: 'User does not have perms for this guild'
                });
            }
            
            // then get the guild data from the database
            const guildDoc = await db.collection('guilds').findOne({id: guildId});

            if (!guildDoc) {
                return res.status(401).json({
                    error: 'Cant find guild'
                });
            }

            // then return the guild data
            return res.status(200).json({
                guildData: guildDoc
            });


        } catch (err) {
          res.status(err.statusCode || 500).json(err.message);
        }
      } else {
        res.setHeader('Allow', 'GET');
        res.status(405).end('Method Not Allowed');
    }

};
