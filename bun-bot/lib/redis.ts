import { createClient, RedisClientOptions } from "redis";
import { logger } from "./logger";
import config from "../config";

const redisOptions: RedisClientOptions = {
    socket: {
        host: config.redisUrl,
        port: parseInt(config.redisPort as string),
    },
    password: config.redisPassword,
}

const redis = createClient(redisOptions);

redis.on("error", (error) => {
    logger.error(error);
});

redis.once("ready", () => {
    logger.info("Connected to Redis.");
});

// export the redis client
export { redis };
