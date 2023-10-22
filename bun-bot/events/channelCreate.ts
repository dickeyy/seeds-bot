import { AuditLogEvent, Events, WebhookClient, time } from "discord.js";
import { checkLogTypeEnabled } from "../lib/checkLogEnabled";
import embedBuilder from "../lib/embedBuilder";
import { logger } from "../lib/logger";

async function execute(channel:any) {

    let settings:any = await checkLogTypeEnabled("channel_create", channel.guild.id)
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
        logger.error("Error creating channel_create webhook", error)
    }

    const embed = {
        title: "Channel Created",
        description: `**Channel:** <#${channel.id}> (${channel.id})\n**Type:** ${channel.type}\n**Category:** ${channel.parent ? channel.parent.name : "None"}`,
        thumbnail: "https://cdn.discordapp.com/emojis/1076747519951908954.webp",
        color: "#61E85C",
        footer: {
            text: "Event ID: " + channel.id + " | channel_create event",
        },
        timestamp: new Date(),
    }

    try {
        await webhookClient.send({
            embeds: [embedBuilder(embed as any)],
        })
    } catch (error) {
        logger.error("Error sending channel_create webhook", error)
    }

    // close the webhook client
    webhookClient.destroy()

}

const data = {
    name: Events.ChannelCreate,
    once: false,
    execute,
}

export { 
    data,
}