import { AuditLogEvent, Events, Guild, WebhookClient, time } from "discord.js";
import { checkLogTypeEnabled } from "../lib/checkLogEnabled";
import embedBuilder from "../lib/embedBuilder";
import { logger } from "../lib/logger";
import DBGuild from "../interfaces/DBGuild";
import { client, db } from "../bot";
import { guilds } from "../schema/guild";

async function execute(server:Guild) {

    // form the data
    const data:DBGuild = {
        id: server.id,
        name: server.name,
        description: server.description || undefined,
        member_count: server.memberCount,
        is_premium: false,
        large: server.large,
        vanity_url: server.vanityURLCode || undefined,
        joined_at: new Date(),
        owner_id: server.ownerId,
        shard_id: server.shardId,
        banner_url: server.bannerURL() || undefined,
        icon: server.iconURL() || undefined,
        max_members: server.maximumMembers || 0,
        partnered: server.partnered,
        afk_channel_id: server.afkChannelId || undefined,
        afk_timeout: server.afkTimeout,
        mfa_level: server.mfaLevel,
        nsfw_level: server.nsfwLevel,
        preferred_locale: server.preferredLocale,
        rules_channel_id: server.rulesChannelId || undefined,
        system_channel_id: server.systemChannelId || undefined,
    }

    // save the server to the database
    try {
        await db.insert(guilds).values(data).execute();

        // log the event
        logger.info({
            message: `Joined server ${server.name} (${server.id})`,
            server: {
                member_count: server.memberCount,
            }
        });
    } catch (error) {
        logger.error({
            message: `Failed to save server ${server.name} (${server.id}) to the database`,
            error: error,
        });
    }

    let guildCountChannel:any = client.channels.cache.get('1123601662846714018')
    guildCountChannel.setName(`${client.guilds.cache.size.toLocaleString()} servers`)
 
}

const data = {
    name: Events.GuildCreate,
    once: false,
    execute,
}

export { 
    data,
}