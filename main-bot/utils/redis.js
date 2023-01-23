const dotenv = require('dotenv');
const { createClient } = require('redis');
const { log } = require('../functions/log');

dotenv.config();

// Process errors
process.on('uncaughtException', async function (error) {
    console.log('error', error.stack)

    log('error', error.stack)
});

const redis = createClient({
    socket: {
        host: process.env.REDIS_HOST,
    },
    password: process.env.REDIS_PASSWORD,
    port: 6379,
})

// Export the connect function
exports.redis = redis;