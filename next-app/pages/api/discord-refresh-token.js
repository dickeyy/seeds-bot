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
    const { code } = req.body;
    
    if (req.method === 'POST') {
        try {
          // make a post request to discord to get the access token
          try {
			const tokenResponseData = await request('https://discord.com/api/oauth2/token', {
				method: 'POST',
				body: new URLSearchParams({
					client_id: process.env.DISCORD_CLIENT_ID,
					client_secret: process.env.DISCORD_CLIENT_SECRET,
					code,
					grant_type: 'authorization_code',
					redirect_uri: `${process.env.REDIRECT}/dashboard/select-server`,
					scope: 'identify guilds email guilds.members.read',
				}).toString(),
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
				},
			});

			const oauthData = await tokenResponseData.body.json();

            console.log(oauthData);

            const userResult = await request('https://discord.com/api/users/@me', {
                headers: {
                    authorization: `${oauthData.token_type} ${oauthData.access_token}`,
                },
            });

            const userData = await userResult.body.json();

            // first we want to check if the user already exists in the database
            const db = mClient.db('main');
            const userDoc = await db.collection('webUsers').findOne({ discordId: userData.id });

            if (userDoc) {
                // the user already exists in the database
                // we want to request the api endpoint to update the session
                const updateSessionRequest = await request(`${process.env.REDIRECT}/api/update-session`, {
                    method: 'POST',
                    body: JSON.stringify({
                        userData,
                        authData: {
                            accessToken: oauthData.access_token,
                            refreshToken: oauthData.refresh_token,
                            tokenType: oauthData.token_type,
                        },
                    }),
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                const updateSessionResponse = await updateSessionRequest.body.json();

                return res.status(200).json({ message: 'User session updated', user: userData, session: updateSessionResponse.sessionId, authData: {
                    accessToken: oauthData.access_token,
                    refreshToken: oauthData.refresh_token,
                    tokenType: oauthData.token_type,
                } });
            } else {
                // the user does not exist in the database
                // we want to request the api endpoint to create a new user
                const createUserRequest = await request('https://seedsbot.xyz/api/create-user', {
                    method: 'POST',
                    body: JSON.stringify({
                        userData,
                        authData: {
                            accessToken: oauthData.access_token,
                            refreshToken: oauthData.refresh_token,
                        },
                    }),
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                const createUserResponse = await createUserRequest.body.json();
                
                return res.status(200).json({ message: 'User successfully created', user: userData, session: createUserResponse.sessionData });
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
