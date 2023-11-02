import { AuditLogEvent, Events, WebhookClient, time } from "discord.js";
import { checkLogTypeEnabled } from "../lib/checkLogEnabled";
import embedBuilder from "../lib/embedBuilder";
import { logger } from "../lib/logger";
import config from "../config";

async function execute(event:any) {

    let data = {
        event,
        guild: event.guild,
    }

    const req = await fetch(`${config.event_api_url}/event/delete`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${config.event_api_token}`
        },
        body: JSON.stringify({
            data
        }),
    })

    if (!req.ok) {
        logger.error("Error sending event_delete event to events-api")
        return
    }

    // let settings:any = await checkLogTypeEnabled("event_delete", event.guild.id)
    // if (!settings) {
    //     return
    // }
    // settings = settings.settings

    // if (!settings.types.server) {
    //     return
    // }

    // let webhookClient:any = undefined
    // try {
    //     webhookClient = new WebhookClient({ url: settings.types.server.webhook_url });
    // } catch (error) {
    //     logger.error("Error creating event_delete webhook", error)
    // }

    // const embed = {
    //     title: "Event Deleted",
    //     description: `**Event Name:** ${event.name}`,
    //     thumbnail: `https://cdn.discordapp.com/emojis/1064442698708295690.webp`,
    //     color: "DarkButNotBlack",
    //     footer: {
    //         text: "Event ID: " + event.id + " | event_delete event",
    //     },
    //     timestamp: new Date(),
    // }

    // try {
    //     await webhookClient.send({
    //         embeds: [embedBuilder(embed as any)],
    //     })
    // } catch (error) {
    //     logger.error("Error sending event_delete webhook", error)
    // }

    // // close the webhook client
    // webhookClient.destroy()

}

const data = {
    name: Events.GuildScheduledEventDelete,
    once: false,
    execute,
}

export { 
    data,
}