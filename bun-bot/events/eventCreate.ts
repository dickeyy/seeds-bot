import { AuditLogEvent, Events, WebhookClient, time } from "discord.js";
import { checkLogTypeEnabled } from "../lib/checkLogEnabled";
import embedBuilder from "../lib/embedBuilder";
import { logger } from "../lib/logger";

async function execute(event:any) {

    let settings:any = await checkLogTypeEnabled("event_create", event.guild.id)
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
        logger.error("Error creating event_create webhook", error)
    }

    const embed = {
        title: "Event Created",
        description: `**Event Name:** ${event.name}`,
        thumbnail: `https://cdn.discordapp.com/emojis/1064444112981463150.webp`,
        color: "DarkButNotBlack",
        footer: {
            text: "Event ID: " + event.id + " | event_create event",
        },
        timestamp: new Date(),
    }

    try {
        await webhookClient.send({
            embeds: [embedBuilder(embed as any)],
        })
    } catch (error) {
        logger.error("Error sending event_create webhook", error)
    }

    // close the webhook client
    webhookClient.destroy()

}

const data = {
    name: Events.GuildScheduledEventCreate,
    once: false,
    execute,
}

export { 
    data,
}