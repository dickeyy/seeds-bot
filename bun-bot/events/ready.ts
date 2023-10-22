import { ActivityType, Client, Events, Guild } from "discord.js";
import { logger } from "../lib/logger";
import { db } from "../bot";
import { guilds } from "../schema/guild";
import DBGuild from "../interfaces/DBGuild";

async function readyEvent(c:Client) {
    // make sure guilds and db are synced
    const clientGuilds = c.guilds.cache
    const dbGuilds = await db.select().from(guilds)

    if (clientGuilds.size > dbGuilds.length) {
        logger.info("DB is missing guilds, adding them now...")

        // see what guilds are in the client but not in the db
        const guildsToAdd:Guild[] = Array.from(clientGuilds.values()).filter((guild:Guild) => {
            return !dbGuilds.find((dbGuild:any) => dbGuild.id == guild.id)
        })

        // add the guilds to the db
        for (const guild of guildsToAdd.values()) {
            const data:DBGuild = {
                id: guild.id,
                name: guild.name,
                description: "",
                member_count: guild.memberCount,
                is_premium: false,
                large: false,
                vanity_url: "",
                joined_at: new Date(),
                owner_id: guild.ownerId,
                shard_id: guild.shardId,
                banner_url: guild.bannerURL()?.toString() || "",
                icon: guild.iconURL()?.toString() || "",
                max_members: guild.maximumMembers as number,
                partnered: guild.partnered,
                afk_channel_id: guild.afkChannelId as string,
                afk_timeout: guild.afkTimeout as number,
                mfa_level: guild.mfaLevel as number,
                nsfw_level: guild.nsfwLevel as number,
                preferred_locale: guild.preferredLocale as string,
                rules_channel_id: guild.rulesChannelId as string,
                system_channel_id: guild.systemChannelId as string,
            }
            try {
                await db.insert(guilds).values(data).execute()
                logger.info(`Added guild ${guild.id} to the db`)
            } catch (err) {
                logger.error(err)
            }
        }
    } 

    logger.info("Guilds are synced with the db")
    logger.info(`Logged in as ${c.user?.tag}`);

    c.user?.setActivity('/help | seedsbot.xyz', { type: ActivityType.Watching });

}

const data = {
    name: Events.ClientReady,
    once: true,
    execute: readyEvent,
}

export { 
    data,
}