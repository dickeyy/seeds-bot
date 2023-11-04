import { Context } from "elysia"
import { getLogSettings } from "../lib/getLogSettings"
import sendMessage from "../lib/sendMessage"
import logger from "../lib/logger"
import { time } from "discord.js"

// get server event log settings
async function getServerEventLogSettings(logType:string, serverid:any) {

    const logSettings = await getLogSettings(logType, serverid)

    if (logSettings) {
        return logSettings
    } else {
        return false
    }

}

// server update event
async function serverUpdateEvent(context:Context) {

    const eventType = 'server_update'

    const body:any = context.body

    const event = body.data.event,
    oldServer = body.data.oldServer,
    newServer = body.data.newServer

    let settings:any = await getServerEventLogSettings(eventType, oldServer.id)
    if (!settings) {
        return
    }

    settings = settings.settings

    if (!settings.types.server) {
        return
    }

    const embed = {
        title: "Server Updated",
        description: "```diff\n",
        thumbnail: {
            url: `https://cdn.discordapp.com/emojis/1064444101870759958.webp`
        },
        color: 0xd79a61,
        footer: {
            text: "Event ID: " + oldServer.id + " | " + eventType + " event",
        },
        timestamp: new Date(),
    }

    if (oldServer.name !== newServer.name) {
        embed.description += `Name Changed\n- ${oldServer.name}\n+ ${newServer.name}\n`
    } if (oldServer.description !== newServer.description) {
        embed.description += `Description Changed\n- ${oldServer.description}\n+ ${newServer.description}\n`
    } if (oldServer.icon !== newServer.icon) {
        embed.description += `Icon Changed\n- ${oldServer.icon}\n+ ${newServer.icon}\n`
    } if (oldServer.banner !== newServer.banner) {
        embed.description += `Banner Changed\n- ${oldServer.banner}\n+ ${newServer.banner}\n`
    } if (oldServer.splash !== newServer.splash) {
        embed.description += `Splash Changed\n- ${oldServer.splash}\n+ ${newServer.splash}\n`
    } if (oldServer.afkChannelId !== newServer.afkChannelId) {
        embed.description += `AFK Channel Changed\n- ${oldServer.afkChannelId}\n+ ${newServer.afkChannelId}\n`
    } if (oldServer.afkTimeout !== newServer.afkTimeout) {
        embed.description += `AFK Timeout Changed\n- ${oldServer.afkTimeout}\n+ ${newServer.afkTimeout}\n`
    } if (oldServer.systemChannelId !== newServer.systemChannelId) {
        embed.description += `System Channel Changed\n- ${oldServer.systemChannelId}\n+ ${newServer.systemChannelId}\n`
    } if (oldServer.rulesChannelId !== newServer.rulesChannelId) {
        embed.description += `Rules Channel Changed\n- ${oldServer.rulesChannelId}\n+ ${newServer.rulesChannelId}\n`
    } if (oldServer.publicUpdatesChannelId !== newServer.publicUpdatesChannelId) {
        embed.description += `Public Updates Channel Changed\n- ${oldServer.publicUpdatesChannelId}\n+ ${newServer.publicUpdatesChannelId}\n`
    } if (oldServer.preferredLocale !== newServer.preferredLocale) {
        embed.description += `Preferred Locale Changed\n- ${oldServer.preferredLocale}\n+ ${newServer.preferredLocale}\n`
    } if (oldServer.verificationLevel !== newServer.verificationLevel) {
        embed.description += `Verification Level Changed\n- ${oldServer.verificationLevel}\n+ ${newServer.verificationLevel}\n`
    } if (oldServer.explicitContentFilter !== newServer.explicitContentFilter) {
        embed.description += `Explicit Content Filter Changed\n- ${oldServer.explicitContentFilter}\n+ ${newServer.explicitContentFilter}\n`
    } if (oldServer.mfaLevel !== newServer.mfaLevel) {
        embed.description += `MFA Level Changed\n- ${oldServer.mfaLevel}\n+ ${newServer.mfaLevel}\n`
    } if (oldServer.defaultMessageNotifications !== newServer.defaultMessageNotifications) {
        embed.description += `Default Message Notifications Changed\n- ${oldServer.defaultMessageNotifications}\n+ ${newServer.defaultMessageNotifications}\n`
    } if (oldServer.premiumTier !== newServer.premiumTier) {
        embed.description += `Premium Tier Changed\n- ${oldServer.premiumTier}\n+ ${newServer.premiumTier}\n`
    } if (oldServer.premiumSubscriptionCount !== newServer.premiumSubscriptionCount) {
        embed.description += `Premium Subscription Count Changed\n- ${oldServer.premiumSubscriptionCount}\n+ ${newServer.premiumSubscriptionCount}\n`
    } if (oldServer.vanityURLCode !== newServer.vanityURLCode) {
        embed.description += `Vanity URL Code Changed\n- ${oldServer.vanityURLCode}\n+ ${newServer.vanityURLCode}\n`
    } if (oldServer.ownerId !== newServer.ownerId) {
        embed.description += `Owner ID Changed\n- ${oldServer.ownerId}\n+ ${newServer.ownerId}\n`
    }

    embed.description += "```"

    // make sure the embed isnt over 2000 characters
    if (embed.description.length > 2000) {
        embed.description = embed.description.slice(0, 1997) + "..."
    }

    const send = await sendMessage({
        embeds: [embed],
    }, settings.types.server.webhook_url).catch((error) => {
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

// channel create event
async function channelCreateEvent(context:Context) {

    const eventType = 'channel_create'

    const body:any = context.body

    const event = body.data.event,
    channel = body.data.channel,
    guild = body.data.guild,
    parent = body.data.parent

    let settings:any = await getServerEventLogSettings(eventType, guild.id)
    if (!settings) {
        return
    }

    settings = settings.settings

    if (!settings.types.server) {
        return
    }   

    const embed = {
        title: "Channel Created",
        description: `**Channel:** <#${channel.id}> (${channel.id})\n**Type:** ${channel.type}\n**Category:** ${parent ? parent.name : "None"}`,
        thumbnail: {
            url: `https://cdn.discordapp.com/emojis/1076747519951908954.webp`
        },
        color: 0x61e85c,
        footer: {
            text: "Event ID: " + channel.id + " | " + eventType + " event",
        },
        timestamp: new Date(),
    }

    const send = await sendMessage({
        embeds: [embed],
    }, settings.types.server.webhook_url).catch((error) => {
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

// channel delete event
async function channelDeleteEvent(context:Context) {

    const eventType = 'channel_delete'

    const body:any = context.body

    const event = body.data.event,
    channel = body.data.channel,
    guild = body.data.guild,
    parent = body.data.parent

    let settings:any = await getServerEventLogSettings(eventType, guild.id)
    if (!settings) {
        return
    }

    settings = settings.settings

    if (!settings.types.server) {
        return
    }   

    const embed = {
        title: "Channel Deleted",
        description: `**Channel:** #${channel.name} (${channel.id})\n**Type:** ${channel.type}\n**Category:** ${parent ? parent.name : "None"}`,
        thumbnail: {
            url: `https://cdn.discordapp.com/emojis/1076747509529071696.webp`
        },
        color: 0xE75151,
        footer: {
            text: "Event ID: " + channel.id + " | " + eventType + " event",
        },
        timestamp: new Date(),
    }

    const send = await sendMessage({
        embeds: [embed],
    }, settings.types.server.webhook_url).catch((error) => {
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

// channel pins update event
async function channelPinsUpdateEvent(context:Context) {

    const eventType = 'channel_pins_update'

    const body:any = context.body

    const event = body.data.event,
    channel = body.data.channel,
    guild = body.data.guild

    let settings:any = await getServerEventLogSettings(eventType, guild.id)
    if (!settings) {
        return
    }

    settings = settings.settings

    if (!settings.types.server) {
        return
    }   

    const embed = {
        title: "Channel Pins Updated",
        description: `**Channel:** <#${channel.id}> (${channel.id})`,
        footer: {
            text: "Event ID: " + channel.id + " | " + eventType + " event",
        },
        timestamp: new Date(),
    }

    const send = await sendMessage({
        embeds: [embed],
    }, settings.types.server.webhook_url).catch((error) => {
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

// channel update event
async function channelUpdateEvent(context:Context) {

    const eventType = 'channel_update'

    const body:any = context.body

    const event = body.data.event,
    guild = body.data.guild,
    oldChannel = body.data.oldChannel,
    newChannel = body.data.newChannel,
    oldParent = body.data.oldParent,
    newParent = body.data.newParent

    let settings:any = await getServerEventLogSettings(eventType, guild.id)
    if (!settings) {
        return
    }

    settings = settings.settings

    if (!settings.types.server) {
        return
    }   

    let description = "```diff\n"

    const embed = {
        title: "Channel Updated",
        description: description,
        thumbnail: {
            url: 'https://cdn.discordapp.com/emojis/1076747494668644442.webp',
        },
        color: 0xFAEE87,
        footer: {
            text: "Event ID: " + newChannel.id + " | " + eventType + " event",
        },
        timestamp: new Date(),
    }

    if (oldChannel.name !== newChannel.name) {
        embed.description += `\nName Changed: \n- ${oldChannel.name}\n+ ${newChannel.name}\n`
    } if (oldParent && newParent && oldParent.id !== newParent.id) {
        embed.description += `\nCategory Changed: \n- ${oldParent ? oldParent.name : "None"}\n+ ${newParent ? newParent.name : "None"}\n`
    } if (oldChannel.type !== newChannel.type) {
        embed.description += `\nType Changed: \n- ${oldChannel.type}\n+ ${newChannel.type}\n`
    } if (oldChannel.topic !== newChannel.topic) {
        embed.description += `\nTopic Changed: \n- ${oldChannel.topic}\n+ ${newChannel.topic}\n`
    } if (oldChannel.nsfw !== newChannel.nsfw) {
        embed.description += `\nNSFW Changed: \n- ${oldChannel.nsfw}\n+ ${newChannel.nsfw}\n`
    } if (oldChannel.rateLimitPerUser !== newChannel.rateLimitPerUser) {
        embed.description += `\nSlowmode Changed: \n- ${oldChannel.rateLimitPerUser}\n+ ${newChannel.rateLimitPerUser}\n`
    } if (oldChannel.bitrate !== newChannel.bitrate) {
        embed.description += `\nBitrate Changed: \n- ${oldChannel.bitrate}\n+ ${newChannel.bitrate}\n`
    } if (oldChannel.userLimit !== newChannel.userLimit) {
        embed.description += `\nUser Limit Changed: \n- ${oldChannel.userLimit}\n+ ${newChannel.userLimit}\n`
    }

    embed.description += "```"

    if (embed.description.length > 2000) {
        embed.description = embed.description.slice(0, 1997) + "..."
    }

    if (embed.description === "```diff\n```") {
        return true
    }

    const send = await sendMessage({
        embeds: [embed],
    }, settings.types.server.webhook_url).catch((error) => {
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

// emoji create event
async function emojiCreateEvent(context:Context) {

    const eventType = 'emoji_create'

    const body:any = context.body

    const event = body.data.event,
    emoji = body.data.emoji,
    guild = body.data.guild

    let settings:any = await getServerEventLogSettings(eventType, guild.id)
    if (!settings) {
        return
    }

    settings = settings.settings

    if (!settings.types.server) {
        return
    }   

    const embed = {
        title: "Emoji Created",
        description: `**Emoji Name:** ${emoji.name}\n**Emoji ID:** ${emoji.id}\n**Animated:** ${emoji.animated}\n**Emoji URL:** [Click](${emoji.url})`,
        thumbnail: {
            url: `https://cdn.discordapp.com/emojis/${emoji.id}.webp`,
        },
        footer: {
            text: "Event ID: " + emoji.id + " | " + eventType + " event",
        },
        timestamp: new Date(),
    }

    const send = await sendMessage({
        embeds: [embed],
    }, settings.types.server.webhook_url).catch((error) => {
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

// emoji delete event
async function emojiDeleteEvent(context:Context) {

    const eventType = 'emoji_delete'

    const body:any = context.body

    const event = body.data.event,
    emoji = body.data.emoji,
    guild = body.data.guild

    let settings:any = await getServerEventLogSettings(eventType, guild.id)
    if (!settings) {
        return
    }

    settings = settings.settings

    if (!settings.types.server) {
        return
    }   

    const embed = {
        title: "Emoji Deleted",
        description: `**Emoji Name:** ${emoji.name}\n**Emoji ID:** ${emoji.id}\n**Animated:** ${emoji.animated}\n**Emoji URL:** [Click](${emoji.url})`,
        thumbnail: {
            url: `https://cdn.discordapp.com/emojis/1065110914128416818.webp`,
        },
        footer: {
            text: "Event ID: " + emoji.id + " | " + eventType + " event",
        },
        timestamp: new Date(),
    }

    const send = await sendMessage({
        embeds: [embed],
    }, settings.types.server.webhook_url).catch((error) => {
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

// emoji update event
async function emojiUpdateEvent(context:Context) {

    const eventType = 'emoji_update'

    const body:any = context.body

    const event = body.data.event,
    oldEmoji = body.data.oldEmoji,
    newEmoji = body.data.newEmoji,
    guild = body.data.guild

    let settings:any = await getServerEventLogSettings(eventType, guild.id)
    if (!settings) {
        return
    }

    settings = settings.settings

    if (!settings.types.server) {
        return
    }   

    const embed = {
        title: "Emoji Updated",
        description: "```diff\n",
        thumbnail: {
            url: `https://cdn.discordapp.com/emojis/${newEmoji.id}.webp`,
        },
        footer: {
            text: "Event ID: " + newEmoji.id + " | " + eventType + " event",
        },
        timestamp: new Date(),
    }

    if (oldEmoji.name !== newEmoji.name) {
        embed.description += `Name Changed:\n- ${oldEmoji.name}\n+ ${newEmoji.name}\n\`\`\``
    }

    const send = await sendMessage({
        embeds: [embed],
    }, settings.types.server.webhook_url).catch((error) => {
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

// event create event
async function eventCreateEvent(context:Context) {

    const eventType = 'event_create'

    const body:any = context.body

    const event = body.data.event,
    guild = body.data.guild

    let settings:any = await getServerEventLogSettings(eventType, guild.id)
    if (!settings) {
        return
    }

    settings = settings.settings

    if (!settings.types.server) {
        return
    }   

    const embed = {
        title: "Event Created",
        description: `**Event Name:** ${event.name}`,
        thumbnail: {
            url: `https://cdn.discordapp.com/emojis/1064444112981463150.webp`,
        },
        color: 0x2C2F33,
        footer: {
            text: "Event ID: " + event.id + " | " + eventType + " event",
        },
        timestamp: new Date(),
    }

    const send = await sendMessage({
        embeds: [embed],
    }, settings.types.server.webhook_url).catch((error) => {
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

// event delete event
async function eventDeleteEvent(context:Context) {

    const eventType = 'event_delete'

    const body:any = context.body

    const event = body.data.event,
    guild = body.data.guild

    let settings:any = await getServerEventLogSettings(eventType, guild.id)
    if (!settings) {
        return
    }

    settings = settings.settings

    if (!settings.types.server) {
        return
    }   

    const embed = {
        title: "Event Deleted",
        description: `**Event Name:** ${event.name}`,
        thumbnail: {
            url: `https://cdn.discordapp.com/emojis/1064442698708295690.webp`,
        },
        color: 0x2C2F33,
        footer: {
            text: "Event ID: " + event.id + " | " + eventType + " event",
        },
        timestamp: new Date(),
    }

    const send = await sendMessage({
        embeds: [embed],
    }, settings.types.server.webhook_url).catch((error) => {
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

// event update event
async function eventUpdateEvent(context:Context) {
    // later
}

// invite create event
async function inviteCreateEvent(context:Context) {

    const eventType = 'invite_create'

    const body:any = context.body

    const event = body.data.event,
    invite = body.data.invite,
    channel = body.data.channel,
    inviter = body.data.inviter,
    guild = body.data.guild

    let settings:any = await getServerEventLogSettings(eventType, guild.id)
    if (!settings) {
        return
    }

    settings = settings.settings

    if (!settings.types.server) {
        return
    }   

    const embed = {
        title: "Invite Created",
        description: `**Invite Code:** ${invite.code}\n**Invite URL:** [Click](${invite.url})\n**Invite Channel:** <#${channel.id}> (${channel.id})\n**Invite Creator:** <@${inviter.id}> (${inviter.id})`,
        thumbnail: {
            url: `https://cdn.discordapp.com/emojis/1065111574471254118.webp`,
        },
        color: 0x2C2F33,
        footer: {
            text: "Event ID: " + invite.code + " | " + eventType + " event",
        },
        timestamp: new Date(),
    }

    const send = await sendMessage({
        embeds: [embed],
    }, settings.types.server.webhook_url).catch((error) => {
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

// invite delete event
async function inviteDeleteEvent(context:Context) {

    const eventType = 'invite_delete'

    const body:any = context.body

    const event = body.data.event,
    invite = body.data.invite,
    channel = body.data.channel,
    inviter = body.data.inviter,
    guild = body.data.guild

    let settings:any = await getServerEventLogSettings(eventType, guild.id)
    if (!settings) {
        return
    }

    settings = settings.settings

    if (!settings.types.server) {
        return
    }   

    const embed = {
        title: "Invite Created",
        description: `**Invite Code:** ${invite.code}\n**Invite URL:** [Click](${invite.url})\n**Invite Channel:** <#${channel.id}> (${channel.id})\n**Invite Creator:** <@${inviter.id}> (${inviter.id})`,
        thumbnail: {
            url: `https://cdn.discordapp.com/emojis/1065110916401729626.webp`,
        },
        color: 0x2C2F33,
        footer: {
            text: "Event ID: " + invite.code + " | " + eventType + " event",
        },
        timestamp: new Date(),
    }

    const send = await sendMessage({
        embeds: [embed],
    }, settings.types.server.webhook_url).catch((error) => {
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

// role create event
async function roleCreateEvent(context:Context) {

    const eventType = 'role_create'

    const body:any = context.body

    const event = body.data.event,
    role = body.data.role,
    guild = body.data.guild

    let settings:any = await getServerEventLogSettings(eventType, guild.id)
    if (!settings) {
        return
    }

    settings = settings.settings

    if (!settings.types.server) {
        return
    }   

    const embed = {
        title: "Role Created",
        description: `**Role Name:** ${role.name}\n**Role ID:** ${role.id}\n**Role Color:** ${role.hexColor}\n**Role Position:** ${role.position}\n**Role Hoisted:** ${role.hoist}\n**Role Mentionable:** ${role.mentionable}`,
        thumbnail: {
            url: `https://cdn.discordapp.com/emojis/1064444103850475580.webp`,
        },
        color: 0xA3FA87,
        footer: {
            text: "Event ID: " + role.id + " | " + eventType + " event",
        },
        timestamp: new Date(),
    }

    const send = await sendMessage({
        embeds: [embed],
    }, settings.types.server.webhook_url).catch((error) => {
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

// role delete event
async function roleDeleteEvent(context:Context) {

    const eventType = 'role_delete'

    const body:any = context.body

    const event = body.data.event,
    role = body.data.role,
    guild = body.data.guild

    let settings:any = await getServerEventLogSettings(eventType, guild.id)
    if (!settings) {
        return
    }

    settings = settings.settings

    if (!settings.types.server) {
        return
    }   

    const embed = {
        title: "Role Deleted",
        description: `**Role Name:** ${role.name}\n**Role ID:** ${role.id}`,
        thumbnail: {
            url: `https://cdn.discordapp.com/emojis/1064442708069990411.webp`,
        },
        color: 0xFA8A87,
        footer: {
            text: "Event ID: " + role.id + " | " + eventType + " event",
        },
        timestamp: new Date(),
    }

    const send = await sendMessage({
        embeds: [embed],
    }, settings.types.server.webhook_url).catch((error) => {
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

// role update event
async function roleUpdateEvent(context:Context) {

    const eventType = 'role_update'

    const body:any = context.body

    const event = body.data.event,
    oldRole = body.data.oldRole,
    newRole = body.data.newRole,
    newPerms = body.data.newPerms,
    oldPerms = body.data.oldPerms,
    guild = body.data.guild

    let settings:any = await getServerEventLogSettings(eventType, guild.id)
    if (!settings) {
        return
    }

    settings = settings.settings

    if (!settings.types.server) {
        return
    }   

    const embed = {
        title: "Role Updated",
        description: "```diff\n",
        thumbnail: {
            url: `https://cdn.discordapp.com/emojis/1064444287774904400.webp`,
        },
        footer: {
            text: "Event ID: " + newRole.id + " | " + eventType + " event",
        },
        timestamp: new Date(),
    }

    if (oldRole.name !== newRole.name) {
        embed.description += `Name Changed\n- ${oldRole.name}\n+ ${newRole.name}\n`
    } if (oldRole.hexColor !== newRole.hexColor) {
        embed.description += `Color Changed\n- ${oldRole.hexColor}\n+ ${newRole.hexColor}\n`
    } if (oldRole.position !== newRole.position) {
        embed.description += `Position Changed\n- ${oldRole.position}\n+ ${newRole.position}\n`
    } if (oldRole.hoist !== newRole.hoist) {
        embed.description += `Hoisted Changed\n- ${oldRole.hoist}\n+ ${newRole.hoist}\n`
    } if (oldRole.mentionable !== newRole.mentionable) {
        embed.description += `Mentionable Changed\n- ${oldRole.mentionable}\n+ ${newRole.mentionable}\n`
    } if (oldPerms.bitfield !== newPerms.bitfield) {
        embed.description += `Permissions Changed\n- ${oldPerms.bitfield}\n+ ${newPerms.bitfield}\n`
    } 

    embed.description += "```"

    if (embed.description.length > 2000) {
        embed.description = embed.description.slice(0, 1997) + "..."
    }

    if (embed.description === "```diff\n```") {
        return true
    }

    const send = await sendMessage({
        embeds: [embed],
    }, settings.types.server.webhook_url).catch((error) => {
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

// sticker create event
async function stickerCreateEvent(context:Context) {

    // TODO

}

// sticker delete event
async function stickerDeleteEvent(context:Context) {

    // TODO

}

// sticker update event
async function stickerUpdateEvent(context:Context) {
    
    // TODO

}

// thread create event
async function threadCreateEvent(context:Context) {

    // TODO

}

// thread delete event
async function threadDeleteEvent(context:Context) {

    // TODO

}

// thread update event
async function threadUpdateEvent(context:Context) {

    // TODO

}

// export the events
export {
    serverUpdateEvent,
    channelCreateEvent,
    channelDeleteEvent,
    channelPinsUpdateEvent,
    channelUpdateEvent,
    emojiCreateEvent,
    emojiDeleteEvent,
    emojiUpdateEvent,
    eventCreateEvent,
    eventDeleteEvent,
    eventUpdateEvent,
    inviteCreateEvent,
    inviteDeleteEvent,
    roleCreateEvent,
    roleDeleteEvent,
    roleUpdateEvent,
    stickerCreateEvent,
    stickerDeleteEvent,
    stickerUpdateEvent,
    threadCreateEvent,
    threadDeleteEvent,
    threadUpdateEvent
}