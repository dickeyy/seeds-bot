// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const { MongoClient } = require('mongodb');
const { request } = require('undici');

const uri = process.env.MONGO_URI;
const mClient = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const {encrypt} = require('../../utils/encrypt');
const {decrypt} = require('../../utils/decrypt');
const {genSessionId} = require('../../utils/genSessionId');
const {genEncryptKey} = require('../../utils/genEncryptKey');

export default async function handler(req, res) {

    // get params from request body
    const { userData, authData } = req.body;
    
    if (req.method === 'POST') {
        try {
          
          try {
			
            const db = mClient.db('main');

            // double check if the user already exists in the database
            const userDoc = await db.collection('webUsers').findOne({ discordId: userData.id });

            if (userDoc) {
                return res.status(200).json({ message: 'User already exists in the database', userDoc });
            } else {
                // first we are going to generate a new encryption key
                console.log('Generating new encryption key...');
                const encryptKey = genEncryptKey();

                // then we are going to encrypt the user's email
                console.log('Encrypting user email...');
                const encryptedEmail = encrypt(userData.email, encryptKey);

                // then we are going to encrypt the user's username
                console.log('Encrypting user username...');
                const encryptedUsername = encrypt(userData.username, encryptKey);

                // then we are going to encrypt the user's discriminator
                console.log('Encrypting user discriminator...');
                const encryptedDiscriminator = encrypt(userData.discriminator, encryptKey);

                // then we are going to encrypt the user's avatar
                console.log('Encrypting user avatar...');
                const encryptedAvatar = encrypt(userData.avatar, encryptKey);

                // then we are going to encrypt the user's locale
                console.log('Encrypting user locale...');
                const encryptedLocale = encrypt(userData.locale, encryptKey);
                
                // then we are going to encrypt the user's encryptKey
                console.log('Encrypting user encryptKey...');
                const encryptedEncryptKey = encrypt(encryptKey, process.env.ENCRYPT_KEY);

                // then we are going to generate a new session id
                console.log('Generating new session id...');
                const sessionId = genSessionId();

                // then we are going to encrypt the access token
                console.log('Encrypting access token...');
                const encryptedAccessToken = encrypt(authData.accessToken, encryptKey);

                // then we are going to encrypt the refresh token
                console.log('Encrypting refresh token...');
                const encryptedRefreshToken = encrypt(authData.refreshToken, encryptKey);

                const userInsertData = {
                    discordId: userData.id,
                    email: encryptedEmail,
                    username: encryptedUsername,
                    discriminator: encryptedDiscriminator,
                    avatar: encryptedAvatar,
                    locale: encryptedLocale,
                    encryptKey: encryptedEncryptKey,
                    sessionId: sessionId,
                    createdAt: new Date(),
                    updatedAt: new Date()
                }

                const sessionInsertData = {
                    sessionId: sessionId,
                    discordId: userData.id,
                    accessToken: encryptedAccessToken,
                    refreshToken: encryptedRefreshToken,
                    createdAt: new Date(),
                    updatedAt: new Date()
                }

                // now we are going to insert the user into the database
                console.log('Inserting user into database...');
                await db.collection('webUsers').insertOne(userInsertData);

                // now we are going to insert the session id into the database
                console.log('Inserting session id into database...');
                await db.collection('sessions').insertOne(sessionInsertData);

                // now we are going to return the user document
                return res.status(200).json({ message: 'User created successfully', userData: userInsertData, sessionData: sessionInsertData });

            }

		} catch (error) {
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
