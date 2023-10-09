const dotenv = require('dotenv');
const { createClient } = require('redis');

dotenv.config();

const redis = createClient({
    url: process.env.REDIS_URL
})

// Export the connect function
exports.redis = redis;