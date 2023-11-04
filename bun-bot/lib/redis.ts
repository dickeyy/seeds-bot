import { createClient, RedisClientOptions } from "redis";
import { logger } from "./logger";
import config from "../config";

const redisOptions: RedisClientOptions = {
    socket: {
        host: config.redis.url,
        port: parseInt(config.redis.port as string),
    },
    password: config.redis.password,
    pingInterval: 1000 * 60 * 5,
}

const redis = createClient(redisOptions);

redis.on("error", (error) => {
    logger.error('Redis error: ' + error);
});

redis.once("ready", () => {
    logger.info("Connected to Redis.");
});

// export the redis client
export { redis };
