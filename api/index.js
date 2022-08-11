const { request } = require('undici');
const express = require('express');
const { clientId, clientSecret, port } = require('./config.json');

async function getJSONResponse(body) {
	let fullBody = '';

	for await (const data of body) {
		fullBody += data.toString();
	}
	return JSON.parse(fullBody);
}

const app = express();

app.get('/', async ({ query }, response) => {
	const { code } = query;

	if (code) {
		try {
            console.log('1')
			const tokenResponseData = await request('https://discord.com/api/oauth2/token', {
				method: 'POST',
				body: new URLSearchParams({
                    client_id: `${clientId}`,
                    client_secret: `${clientSecret}`,
                    code,
                    grant_type: 'authorization_code',
                    redirect_uri: `http://localhost:${port}`,
                    scope: 'identify',
                }),
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
				},
			});

            console.log(tokenResponseData)

			const oauthData = await getJSONResponse(tokenResponseData.body);

			const userResult = await request('https://discord.com/api/users/@me', {
				headers: {
					authorization: `${oauthData.token_type} ${oauthData.access_token}`,
				},
			});

			console.log(await getJSONResponse(userResult.body));
		} catch (error) {
			// NOTE: An unauthorized token will not throw an error
			// tokenResponseData.statusCode will be 401
			console.error(error.message);
            console.error(error.stack)
		}
	}

	return response.sendFile('static/index.html', { root: '.' });
});

app.listen(port, () => console.log(`App listening at http://localhost:${port}`));