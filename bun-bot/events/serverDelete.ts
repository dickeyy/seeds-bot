import { Events, Guild } from "discord.js";
import { logger } from "../lib/logger";
import { client, db } from "../bot";
import { guilds } from "../schema/guild";
import { eq } from "drizzle-orm";

async function execute(server:Guild) {

    if (!server) return;
    if (!server.name) return;

    // remove the server from the database
    try {
        await db.delete(guilds).where(eq(guilds.id, server.id)).execute();

        // log the event
        logger.info({
            message: `Left server ${server.name} (${server.id})`,
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
    name: Events.GuildDelete,
    once: false,
    execute,
}

export { 
    data,
}