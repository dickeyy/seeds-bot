import { AuditLogEvent, Events, WebhookClient, time } from "discord.js";
import { checkLogTypeEnabled } from "../lib/checkLogEnabled";
import embedBuilder from "../lib/embedBuilder";
import { logger } from "../lib/logger";

async function execute(role:any) {

    let settings:any = await checkLogTypeEnabled("role_create", role.guild.id)
    if (!settings) {
        return
    }
    settings = settings.settings

    if (!settings.types.server) {
        return
    }

    let webhookClient:any = undefined
    try {
        webhookClient = new WebhookClient({ url: settings.types.server.webhook_url });
    } catch (error) {
        logger.error("Error creating role_create webhook", error)
    }

    const embed = {
        title: "Role Created",
        description: `**Role Name:** ${role.name}\n**Role ID:** ${role.id}\n**Role Color:** ${role.hexColor}\n**Role Position:** ${role.position}\n**Role Hoisted:** ${role.hoist}\n**Role Mentionable:** ${role.mentionable}`,
        thumbnail: `https://cdn.discordapp.com/emojis/1064444103850475580.webp`,
        color: "#A3FA87",
        footer: {
            text: "Event ID: " + role.id + " | role_create event",
        },
        timestamp: new Date(),
    }

    try {
        await webhookClient.send({
            embeds: [embedBuilder(embed as any)],
        })
    } catch (error) {
        logger.error("Error sending role_create webhook", error)
    }

    // close the webhook client
    webhookClient.destroy()

}

const data = {
    name: Events.GuildRoleCreate,
    once: false,
    execute,
}

export { 
    data,
}