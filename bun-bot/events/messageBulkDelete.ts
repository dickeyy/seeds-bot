import { Events, WebhookClient } from "discord.js";
import { checkLogTypeEnabled } from "../lib/checkLogEnabled";
import embedBuilder from "../lib/embedBuilder";
import { logger } from "../lib/logger";
import config from "../config";

async function execute(messages:any) {

    let data = {
        messages,
        channel: messages.first().channel,
        guild: messages.first().guild,
    }

    const req = await fetch(`${config.event_api_url}/message/bulk/delete`, {
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
        logger.error("Error sending message_bulk_delete event to events-api")
        return
    }

    // let settings:any = await checkLogTypeEnabled("message_bulk_delete", messages.first().guildId)
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
    //     logger.error("Error creating message_bulk_delete webhook", error)
    // }

    // // make an array of all the message authors ids
    // const authorIds = messages.map((message:any) => {
    //     return message.author.id
    // })
    // const contents = messages.map((message:any) => {
    //     return message.content
    // })

    // let descriptionString = ``

    // const embed = {
    //     title: messages.size + " Message Purged in #" + messages.first().channel.name,
    //     description: descriptionString,
    //     thumbnail: "https://cdn.discordapp.com/emojis/1064444110334861373.webp",
    //     color: "#373f69",
    //     footer: {
    //         text: "Event ID: " + messages.id + " | message_bulk_delete event",
    //     },
    //     timestamp: new Date(),
    // }
    
    // if (contents.length > 0) {
    //     embed.description += "\n**Contents:** `" + contents.join("`, `") + "`"
    // } if (authorIds.length > 0) {
    //     embed.description += "\n**Authors:** <@" + authorIds.join(">, <@") + ">"
    // }

    // // make sure the description is not longer than 4096 characters
    // if (embed.description.length > 4096) {
    //     // take of any overflow
    //     embed.description = embed.description.slice(0, 4096)
    //     // add a note to the end of the description
    //     embed.description += "\n\n**Note:** The description was too long and was cut off."
    // }

    // try {
    //     await webhookClient.send({
    //         embeds: [embedBuilder(embed as any)],
    //     })
    // } catch (error) {
    //     logger.error("Error sending message_delete webhook", error)
    // }

}

const data = {
    name: Events.MessageBulkDelete,
    once: false,
    execute,
}

export { 
    data,
}