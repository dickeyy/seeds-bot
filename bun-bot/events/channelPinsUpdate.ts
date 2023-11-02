import { AuditLogEvent, Events, WebhookClient, time } from "discord.js";
import { checkLogTypeEnabled } from "../lib/checkLogEnabled";
import embedBuilder from "../lib/embedBuilder";
import { logger } from "../lib/logger";
import config from "../config";

async function execute(channel:any) {

    let data = {
        channel,
        guild: channel.guild,
    }

    const req = await fetch(`${config.event_api_url}/channel/pins/update`, {
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
        logger.error("Error sending channel_pins_update event to events-api")
        return
    }

    // let settings:any = await checkLogTypeEnabled("channel_pins_update", channel.guild.id)
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
    //     logger.error("Error creating channel_pins_update webhook", error)
    // }

    // const embed = {
    //     title: "Channel Pins Updated",
    //     description: `**Channel:** <#${channel.id}> (${channel.id})`,
    //     footer: {
    //         text: "Event ID: " + channel.id + " | channel_pins_update event",
    //     },
    //     timestamp: new Date(),
    // }

    // try {
    //     await webhookClient.send({
    //         embeds: [embedBuilder(embed as any)],
    //     })
    // } catch (error) {
    //     logger.error("Error sending channel_pins_update webhook", error)
    // }

    // // close the webhook client
    // webhookClient.destroy()

}

const data = {
    name: Events.ChannelPinsUpdate,
    once: false,
    execute,
}

export { 
    data,
}