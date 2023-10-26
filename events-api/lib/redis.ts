import { createClient, RedisClientOptions } from "redis";
import logger from "./logger";
import config from "../config";

const redisOptions: RedisClientOptions = {
    socket: {
        host: config.redis.host,
        port: parseInt(config.redis.port as string),
    },
    password: config.redis.password,
}

const redis = createClient(redisOptions);

redis.on("error", (error) => {
    logger.error(error);
});

redis.once("ready", () => {
    logger.info("Connected to Redis.");
});

redis.connect();

// export the redis client
export { redis };
