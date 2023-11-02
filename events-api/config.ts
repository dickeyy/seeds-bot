const config = {
    port: process.env.PORT || 3000,
    token: process.env.TOKEN,

    database: {
        host: process.env.DATABASE_HOST,
        username: process.env.DATABASE_USERNAME,
        password: process.env.DATABASE_PASSWORD
    },

    redis: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
        password: process.env.REDIS_PASSWORD
    }
}

export default config