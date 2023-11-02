import { AuditLogEvent, Events, WebhookClient, time } from "discord.js";
import { checkLogTypeEnabled } from "../lib/checkLogEnabled";
import embedBuilder from "../lib/embedBuilder";
import { logger } from "../lib/logger";
import config from "../config";

async function execute(oldChannel:any, newChannel:any) {

    let data = {
        oldChannel,
        newChannel,
        guild: oldChannel.guild,
        oldParent: oldChannel.parent,
        newParent: newChannel.parent,
    }

    const req = await fetch(`${config.event_api_url}/channel/update`, {
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
        logger.error("Error sending channel_update event to events-api")
        return
    }

    // let settings:any = await checkLogTypeEnabled("channel_update", oldChannel.guild.id)
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
    //     logger.error("Error creating channel_update webhook", error)
    // }

    // let description = "```diff\n"

    // const embed = {
    //     title: "Channel Updated",
    //     description: description,
    //     thumbnail: "https://cdn.discordapp.com/emojis/1076747494668644442.webp",
    //     color: "#FAEE87",
    //     footer: {
    //         text: "Event ID: " + oldChannel.id + " | channel_update event",
    //     },
    //     timestamp: new Date(),
    // }
    
    // if (oldChannel.name !== newChannel.name) {
    //     embed.description += `\nName Changed: \n- ${oldChannel.name}\n+ ${newChannel.name}\n`
    // } if (oldChannel.parent !== newChannel.parent) {
    //     embed.description += `\nCategory Changed: \n- ${oldChannel.parent ? oldChannel.parent.name : "None"}\n+ ${newChannel.parent ? newChannel.parent.name : "None"}\n`
    // } if (oldChannel.type !== newChannel.type) {
    //     embed.description += `\nType Changed: \n- ${oldChannel.type}\n+ ${newChannel.type}\n`
    // } if (oldChannel.topic !== newChannel.topic) {
    //     embed.description += `\nTopic Changed: \n- ${oldChannel.topic}\n+ ${newChannel.topic}\n`
    // } if (oldChannel.nsfw !== newChannel.nsfw) {
    //     embed.description += `\nNSFW Changed: \n- ${oldChannel.nsfw}\n+ ${newChannel.nsfw}\n`
    // } if (oldChannel.rateLimitPerUser !== newChannel.rateLimitPerUser) {
    //     embed.description += `\nSlowmode Changed: \n- ${oldChannel.rateLimitPerUser}\n+ ${newChannel.rateLimitPerUser}\n`
    // } if (oldChannel.bitrate !== newChannel.bitrate) {
    //     embed.description += `\nBitrate Changed: \n- ${oldChannel.bitrate}\n+ ${newChannel.bitrate}\n`
    // } if (oldChannel.userLimit !== newChannel.userLimit) {
    //     embed.description += `\nUser Limit Changed: \n- ${oldChannel.userLimit}\n+ ${newChannel.userLimit}\n`
    // }

    // embed.description += "```"

    // try {
    //     await webhookClient.send({
    //         embeds: [embedBuilder(embed as any)],
    //     })
    // } catch (error) {
    //     logger.error("Error sending channel_update webhook", error)
    // }

    // // close the webhook client
    // webhookClient.destroy()

}

const data = {
    name: Events.ChannelUpdate,
    once: false,
    execute,
}

export { 
    data,
}