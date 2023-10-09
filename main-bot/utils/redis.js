const dotenv = require('dotenv');
const { createClient } = require('redis');

dotenv.config();

console.log(process.env.REDIS_URL);

const redis = createClient({
    url: process.env.REDIS_URL
})

redis.on('error', (err) => {
    if (err) throw err;
    console.log('Redis disconnected')
    log('info', 'Redis disconnected')
    redis.connect()
})

redis.on('connect', (err) => {
    if (err) throw err;
    console.log('Redis connected')
    log('info', 'Redis connected')
})

// Export the connect function
exports.redis = redis;