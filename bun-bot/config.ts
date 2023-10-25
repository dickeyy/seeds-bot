let token, appId;

if (process.env.ENVIORNMENT == "dev") {
    token = process.env.DEV_TOKEN;
    appId = process.env.DEV_APP_ID;
} else {
    token = process.env.TOKEN;
    appId = process.env.APP_ID;
}

const config = {
    token: token,
    appId: appId,
    mainColor: process.env.MAIN_COLOR,
    env: process.env.ENVIORNMENT,
    webhookUrl: process.env.WEBHOOK_URL,
    mongoUrl: process.env.MONGO_URI,
    
    redis: {
        url: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
        password: process.env.REDIS_PASSWORD,
    },

    database: {
        host: process.env.DATABASE_HOST,
        username: process.env.DATABASE_USERNAME,
        password: process.env.DATABASE_PASSWORD
    },
}

export default config;