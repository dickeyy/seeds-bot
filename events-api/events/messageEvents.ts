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
async function messageDeleteEvent(event:any) {
    
    let settings:any = await getMessageEventLogSettings("message_delete", event.data.event.guildId)
    if (!settings) {
        return
    }
    
    settings = settings.settings

    if (!settings.types.messages) {
        return
    }

    let descString = `**Author:** <@${event.data.author.id}> (${event.data.author.id})\n**Channel:** <#${event.data.channel.id}> (${event.data.channel.id})\n`

    const embed = {
        title: "Message Deleted in #" + event.data.channel.name,
        description: descString,
        thumbnail: {
            url: "https://cdn.discordapp.com/emojis/1064444110334861373.webp",
        },
        color: "#914444",
        author: {
            name: event.data.author.username,
            icon_url: event.data.author.avatarURL,
        },
        footer: {
            text: "Event ID: " + event.data.event.id + " | message_delete event",
        },
        timestamp: new Date(),
    }

    if (event.data.event.content) {
        embed.description += "\n**Content:** `" + event.data.event.content + "`"
    } if (event.data.event.attachments.size > 0) {
        embed.description += "\n**Attachments:** " + event.data.event.attachments.map((attachment:any) => {
            return "[Attachment URL](" + attachment.proxyURL + ")"
        }).join(", ")
    }

    try {
        await sendMessage({
            embeds: [embed],
        }, settings.types.messages.webhook_url)
        return true
    } catch (error) {
        logger.error("Error sending message_delete webhook", error)
        return false
    }

}

// message update event
async function messageUpdateEvent(event:any) {

    const oldMessage = event.data.oldMessage
    const newMessage = event.data.newMessage
    const author = event.data.author
    const channel = event.data.channel

    let settings:any = await getMessageEventLogSettings("message_update", oldMessage.guildId)
    if (!settings) {
        return
    }
    
    settings = settings.settings

    if (!settings.types.messages) {
        return
    }

    let descString = `**Author:** <@${author.id}> (${author.id})\n**Channel:** <#${channel.id}> (${channel.id})\n`

    const embed = {
        title: "Message Edited in #" + channel.name,
        description: descString,
        thumbnail: {
            url: "https://cdn.discordapp.com/emojis/1065110917962022922.webp",
        },
        color: "#4CA99D",
        author: {
            name: author.username,
            icon_url: author.avatarURL,
        },
        footer: {
            text: "Event ID: " + oldMessage.id + " | message_update event",
        },
        timestamp: new Date(),
    }

    try {
        await sendMessage({
            embeds: [embed],
        }, settings.types.messages.webhook_url)
        return true
    } catch (error) {
        logger.error("Error sending message_update webhook", error)
        return false
    }

}

// message bulk delete event
async function messageBulkDeleteEvent(event:any) {

}

// export the events
export {
    messageDeleteEvent,
    messageUpdateEvent,
    messageBulkDeleteEvent
}