import { Context } from "elysia"
import { getLogSettings } from "../lib/getLogSettings"
import logger from "../lib/logger"
import sendMessage from "../lib/sendMessage"

// get message event log settings
async function getMessageEventLogSettings(logType:string, serverid:any) {

    const logSettings = await getLogSettings(logType, serverid)

    if (logSettings) {
        return logSettings
    } else {
        return false
    }

}

// message delete event
async function messageDeleteEvent(context:Context) {

    const eventType = 'message_delete'

    const body:any = context.body

    const message = body.data.event,
    author = body.data.author,
    channel = body.data.channel,
    attachments = body.data.attachments,
    guild = body.data.guild

    let settings:any = await getMessageEventLogSettings(eventType, guild.id)
    if (!settings) {
        return
    }
    
    settings = settings.settings

    if (!settings.types.messages) {
        return
    }

    let descString = `**Author:** <@${author.id}> (${author.id})\n**Channel:** <#${channel.id}> (${channel.id})\n`

    const embed = {
        title: "Message Deleted in #" + channel.name,
        description: descString,
        thumbnail: {
            url: "https://cdn.discordapp.com/emojis/1064444110334861373.webp",
        },
        color: 0x914444,
        author: {
            name: author.username,
            icon_url: author.avatarURL,
        },
        footer: {
            text: "Event ID: " + message.id + " | " + eventType + " event",
        },
        timestamp: new Date(),
    }

    if (message.content) {
        embed.description += "\n**Content:** `" + message.content + "`"
    } if (attachments.length > 0) {
        embed.description += "\n**Attachments:** " + attachments.map((attachment:any) => {
            return "[Attachment URL](" + attachment.proxyURL + ")"
        }).join(", ")
    }

    const send = await sendMessage({
        embeds: [embed],
    }, settings.types.messages.webhook_url).catch((error) => {
        logger.error("Error sending " + eventType + " webhook", error)
        context.set.status = 500
        return { error: "Error sending " + eventType + " webhook" }
    })
    
    if (!send) {
        context.set.status = 500
        return { error: "Error sending " + eventType + " webhook" }
    }

    return true

}

// message update event
async function messageUpdateEvent(context:Context) {

    const eventType = 'message_update'

    const body:any = context.body

    const oldMessage = body.data.oldMessage,
    newMessage = body.data.newMessage,
    author = body.data.author,
    channel = body.data.channel

    let settings:any = await getMessageEventLogSettings(eventType, oldMessage.guildId)
    if (!settings) {
        return
    }
    
    settings = settings.settings

    if (!settings.types.messages) {
        return
    }

    let descString = `**Author:** <@${author.id}> (${author.id})\n**Channel:** <#${channel.id}> (${channel.id})\n\n\`\`\`diff\n`

    const embed = {
        title: "Message Edited in #" + channel.name,
        description: descString,
        thumbnail: {
            url: "https://cdn.discordapp.com/emojis/1065110917962022922.webp",
        },
        color: 0x4CA99D,
        author: {
            name: author.username,
            icon_url: author.avatarURL,
        },
        footer: {
            text: "Event ID: " + oldMessage.id + " | " + eventType + " event",
        },
        timestamp: new Date(),
    }

    if (oldMessage.content !== newMessage.content) {
        embed.description += `Content:\n- ${oldMessage.content}\n+ ${newMessage.content}\n`
    } if (oldMessage.attachments.size > 0) {
        embed.description += "\n**Attachments:** " + oldMessage.attachments.map((attachment:any) => {
            return "[Attachment URL](" + attachment.proxyURL + ")"
        }).join(", ")
    } 

    embed.description += "```"

    const send = await sendMessage({
        embeds: [embed],
    }, settings.types.messages.webhook_url).catch((error) => {
        logger.error("Error sending " + eventType + " webhook", error)
        context.set.status = 500
        return { error: "Error sending " + eventType + " webhook" }
    })
    
    if (!send) {
        context.set.status = 500
        return { error: "Error sending " + eventType + " webhook" }
    }

    return true

}

// message bulk delete event
async function messageBulkDeleteEvent(context:Context) {

    const eventType = 'message_bulk_delete'

    const body:any = context.body

    const messages = body.data.messages,
    authors = messages.map((message:any) => { return message.authorId }),
    contents = messages.map((message:any) => { return message.content }),
    channel = body.data.channel,
    guild = body.data.guild

    let settings:any = await getMessageEventLogSettings(eventType, guild.id)
    if (!settings) {
        return
    }
    
    settings = settings.settings

    if (!settings.types.messages) {
        return
    } 

    let descString = ""

    const embed = {
        title: messages.length + " Message Purged in #" + channel.name,
        description: descString,
        thumbnail: {
            url: "https://cdn.discordapp.com/emojis/1064444110334861373.webp",
        },
        color: 0x373f69,
        footer: {
            text: "Event ID: " + messages.id + " | " + eventType + " event",
        },
        timestamp: new Date(),
    }

    if (contents.length > 0) {
        embed.description += "\n**Contents:** `" + contents.join("`, `") + "`"
    } if (authors.length > 0) {
        embed.description += "\n**Authors:** <@" + authors.join(">, <@") + ">"
    }

    // make sure the description is not longer than 2000 characters
    if (embed.description.length > 2000) {
        // take of any overflow
        embed.description = embed.description.slice(0, 2000)
        // add a note to the end of the description
        embed.description += "\n\n**Note:** The description was too long and was cut off."
    }

    const send = await sendMessage({
        embeds: [embed],
    }, settings.types.messages.webhook_url).catch((error) => {
        logger.error("Error sending " + eventType + " webhook", error)
        context.set.status = 500
        return { error: "Error sending " + eventType + " webhook" }
    })

    if (!send) {
        context.set.status = 500
        return { error: "Error sending " + eventType + " webhook" }
    }

    return true

}

// export the events
export {
    messageDeleteEvent,
    messageUpdateEvent,
    messageBulkDeleteEvent
}