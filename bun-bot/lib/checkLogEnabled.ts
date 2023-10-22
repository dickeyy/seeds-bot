import { eq } from "drizzle-orm";
import { guilds } from "../schema/guild";
import { db } from "./db";
import { redis } from "./redis";
import { logsettings } from "../schema/logsettings";
import { logger } from "./logger";

async function checkLogTypeEnabled(logType:string, guildId:string) {

    let guildSettings = null

    // get the guild from redis
    const redisData = await redis.hGet("seeds:logsettings", guildId)

    if (!redisData) {
        // check db
        try {
            const dbData = await db.select().from(logsettings).where(eq(logsettings.guild_id, guildId)).execute()

            if (dbData.length < 1) {
                // guild doesnt have logs enabled
                return false
            } else {
                logger.info("Had to get log settings from db for guild " + guildId)
                // guild has logs enabled
                guildSettings = JSON.stringify(dbData[0])

                // set the redis key
                await redis.hSet("seeds:logsettings", guildId, guildSettings)
            }
        } catch (err) {
            logger.error(err)
            return false
        }
    } else {
        // guild has logs enabled
        guildSettings = redisData
    }

    // now check if the logType is in the enabled_types array
    const guildSettingsJson = JSON.parse(guildSettings)
    const enabledTypes = guildSettingsJson.enabled_types

    if (enabledTypes.includes(logType)) {
        return {
            enabled: true,
            settings: guildSettingsJson,
        }
    } else {
        return false
    }

}

export {
    checkLogTypeEnabled,
}