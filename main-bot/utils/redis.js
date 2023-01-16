const dotenv = require('dotenv');
const { createClient } = require('redis');

dotenv.config();

// Connect to redis function
const connectRedis = () => {
    try {
        const redisClient = createClient({
            socket: {
                host: process.env.REDIS_HOST,
            },
            password: process.env.REDIS_PASSWORD,
        })
        
        // Redis client error handler
        redisClient.on('error', (err) => {
            console.log('Redis client error: ' + err);
        });

        redisClient.connect();

        redisClient.on('connect', () => {
            console.log('Redis client connected');
        });

        return redisClient;
    } catch (err) {
        console.log(err.stack);
    }
};

// Export the connect function
exports.connectRedis = connectRedis;