import { Events, WebhookClient } from "discord.js";
import { checkLogTypeEnabled } from "../lib/checkLogEnabled";
import embedBuilder from "../lib/embedBuilder";
import { logger } from "../lib/logger";
import config from "../config";

async function execute(event:any) {
    
    let data = {
        event,
        author: event.author,
        guild: event.guild,
        channel: event.channel,
        attachments: event.attachments,
    }

    const req = await fetch(`${config.event_api_url}/message/delete`, {
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
        logger.error("Error sending message_delete event to events-api")
        return
    }

    // let settings:any = await checkLogTypeEnabled("message_delete", event.guildId)
    // if (!settings) {
    //     return
    // }
    // settings = settings.settings

    // if (!settings.types.messages) {
    //     return
    // }

    // let webhookClient:any = undefined
    // try {
    //     webhookClient = new WebhookClient({ url: settings.types.messages.webhook_url });
    // } catch (error) {
    //     logger.error("Error creating message_delete webhook", error)
    // }

    // let descriptionString = `**Author:** <@${event.author.id}> (${event.author.id})\n**Channel:** <#${event.channel.id}> (${event.channel.id})\n`

    // const embed = {
    //     title: "Message Deleted in #" + event.channel.name,
    //     description: descriptionString,
    //     thumbnail: "https://cdn.discordapp.com/emojis/1064444110334861373.webp",
    //     color: "#914444",
    //     author: {
    //         name: event.author.username,
    //         iconURL: event.author.avatarURL(),
    //     },
    //     footer: {
    //         text: "Event ID: " + event.id + " | message_delete event",
    //     },
    //     timestamp: new Date(),
    // }

    // if (event.content) {
    //     embed.description += "\n**Content:** `" + event.content + "`"
    // } if (event.attachments.size > 0) {
    //     embed.description += "\n**Attachments:** " + event.attachments.map((attachment:any) => {
    //         return "[Attachment URL](" + attachment.proxyURL + ")"
    //     }).join(", ")
    // }

    // try {
    //     await webhookClient.send({
    //         embeds: [embedBuilder(embed as any)],
    //     })
    // } catch (error) {
    //     logger.error("Error sending message_delete webhook", error)
    // }

    // // close the webhook client
    // webhookClient.destroy()

}

const data = {
    name: Events.MessageDelete,
    once: false,
    execute,
}

export { 
    data,
}