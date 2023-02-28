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
    const { authData, userData } = req.body;

    console.log('authData: ', authData);
    console.log('userData: ', userData);
    
    if (req.method === 'POST') {
        try {
          // make a post request to discord to get the access token
          try {

            
            // connect to the database
            const db = mClient.db('main');

            // double check if the user already exists in the database
            const userDoc = await db.collection('webUsers').findOne({ discordId: userData.id });

            if (userDoc) {

                // we are going to get the user's encryptKey
                console.log('Decrypting user encryptKey...');
                console.log('userDoc.encryptKey: ', userDoc);
                const encryptKey = decrypt(userDoc.encryptKey, process.env.ENCRYPT_KEY);

                // then we are going to get the users session id
                console.log('Decrypting user session id...');

                const sessionId = userDoc.sessionId;

                // then we are going to encrypt the user's auth data
                console.log('Encrypting user auth data...');
                const encryptedAccessToken = encrypt(authData.accessToken, encryptKey);
                const encryptedRefreshToken = encrypt(authData.refreshToken, encryptKey);
                const encryptedTokenType = encrypt(authData.tokenType, encryptKey);

                // now update the user's session doc data
                console.log('Updating user session doc data...');
                await db.collection('sessions').updateOne({
                    sessionId: sessionId
                }, {
                    $set: {
                        accessToken: encryptedAccessToken,
                        refreshToken: encryptedRefreshToken,
                        tokenType: encryptedTokenType,
                        updatedAt: new Date()
                    }
                })

                return res.status(200).json({ message: 'User session data updated successfully', sessionId: userDoc.sessionId });

            } else {
                return res.status(404).json({ message: 'User does not exist in the database' });
            }

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
