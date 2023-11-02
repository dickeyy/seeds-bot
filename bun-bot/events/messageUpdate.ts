import { Events, WebhookClient } from "discord.js";
import { checkLogTypeEnabled } from "../lib/checkLogEnabled";
import embedBuilder from "../lib/embedBuilder";
import { logger } from "../lib/logger";
import config from "../config";

async function execute(oldMessage:any, newMessage:any) {

    if (oldMessage.author.bot) {
        return
    }

    let data = {
        oldMessage,
        newMessage,
        author: oldMessage.author,
        channel: oldMessage.channel,
    }

    const req = await fetch(`${config.event_api_url}/message/update`, {
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
        logger.error("Error sending message_update event to events-api")
        return
    }

    // let settings:any = await checkLogTypeEnabled("message_update", oldMessage.guildId)
    // if (!settings) {
    //     return
    // }
    // settings = settings.settings

    // if (!settings.types.messages) {
    //     return
    // }

    // if (oldMessage.author.bot) {
    //     return
    // }
    
    // let webhookClient:any = undefined
    // try {
    //     webhookClient = new WebhookClient({ url: settings.types.messages.webhook_url });
    // } catch (error) {
    //     logger.error("Error creating message_update webhook", error)
    // }

    // let descriptionString = `**Author:** <@${oldMessage.author.id}> (${oldMessage.author.id})\n**Channel:** <#${oldMessage.channel.id}> (${oldMessage.channel.id})\n\`\`\`diff\n`

    // const embed = {
    //     title: "Message Edited in #" + oldMessage.channel.name,
    //     description: descriptionString,
    //     thumbnail: "https://cdn.discordapp.com/emojis/1065110917962022922.webp",
    //     color: "#4CA99D",
    //     author: {
    //         name: oldMessage.author.username,
    //         iconURL: oldMessage.author.avatarURL(),
    //     },
    //     footer: {
    //         text: "Event ID: " + oldMessage.id + " | message_update event",
    //     },
    //     timestamp: new Date(),
    // }

    // if (oldMessage.content) {
    //     embed.description += `Content:\n- ${oldMessage.content}\n+ ${newMessage.content}\n\`\`\``
    // } if (oldMessage.attachments.size > 0) {
    //     embed.description += "\n**Attachments:** " + oldMessage.attachments.map((attachment:any) => {
    //         return "[Attachment URL](" + attachment.proxyURL + ")"
    //     }).join(", ")
    // }

    // try {
    //     await webhookClient.send({
    //         embeds: [embedBuilder(embed as any)],
    //     })
    // } catch (error) {
    //     logger.error("Error sending message_update webhook", error)
    // }

    // // close the webhook client
    // webhookClient.destroy()

}

const data = {
    name: Events.MessageUpdate,
    once: false,
    execute,
}

export { 
    data,
}