import { Events, Guild } from "discord.js";
import { logger } from "../lib/logger";
import { db } from "../bot";
import { guilds } from "../schema/guild";
import { eq } from "drizzle-orm";

async function execute(server:Guild) {

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
 
}

const data = {
    name: Events.GuildDelete,
    once: false,
    execute,
}

export { 
    data,
}