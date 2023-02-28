// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const { MongoClient } = require('mongodb');
const { request } = require('undici');

const uri = process.env.MONGO_URI;
const mClient = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const {encrypt} = require('../../../utils/encrypt');
const {decrypt} = require('../../../utils/decrypt');
const {genSessionId} = require('../../../utils/genSessionId');

export default async function handler(req, res) {
    
    // get the session id and new nickname from the body
    const { sessionId, guildId, newNickname } = req.body;
    
    if (req.method === 'POST') {
        try {
          
            const db = mClient.db('main');

            // verify the session id
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

            if (!newNickname) {
                return res.status(401).json({
                    error: 'No new nickname provided'
                });
            }

            // get the session data from the database
            let sessionDoc = await db.collection('sessions').findOne({sessionId: sessionId});

            if (!sessionDoc) {
                return res.status(401).json({
                    error: 'Invalid session id'
                });
            }

            // make the request to discord api to change the nickname of the bot
            const { accessToken, tokenType } = sessionDoc;

            // get the userdoc
            const userDoc = await db.collection('webUsers').findOne({discordId: sessionDoc.discordId});

            if (!userDoc) {
                return res.status(401).json({
                    error: 'Cant find user'
                });
            }

            // get the encryption key from the user doc
            const { encryptKey } = userDoc;

            // decrypt the encryption key
            const decryptedKey = decrypt(encryptKey, process.env.ENCRYPT_KEY);

            // decrypt the access token
            const decryptedAccessToken = decrypt(accessToken, decryptedKey);

            // decrypt the token type
            const decryptedTokenType = decrypt(tokenType, decryptedKey);

            // use the user's access token to make the request
            
            const { statusCode, body } = await request(`https://discord.com/api/guilds/${guildId}/members/@me`, {
                method: 'PATCH',
                headers: {
                    authorization: `Bot ${process.env.BOT_TOKEN}`,
                    'content-type': 'application/json'
                },
                body: JSON.stringify({
                    nick: newNickname
                })
            });
            
            // resolve the body
            const data = await body.json();

            if (statusCode === 200) {
                res.status(200).json({
                    message: 'Nickname changed successfully',
                    data
                });
            } else {
                res.status(500).json({
                    error: 'Failed to change nickname',
                    message: data
                });
            }


        } catch (err) {
          res.status(err.statusCode || 500).json(err.message);
        }
      } else {
        res.setHeader('Allow', 'POST');
        res.status(405).end('Method Not Allowed');
    }

    mClient.close();
};
