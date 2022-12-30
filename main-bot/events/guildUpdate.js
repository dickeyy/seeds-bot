const { MessageEmbed, WebhookClient } = require('discord.js');
const { connectDb } = require('../utils/db.js')
const client = require('../index.js').client

const db = connectDb()

// Colors
const mainHex = '#d79a61'
const lightRedHex = '#E75151'

const coll = db.collection('logSettings')

const guildUpdateEvent = async (oldGuild, newGuild) => {

    let doc = await coll.findOne({ guildId: oldGuild.id })

    if (doc) {
        if (doc.channels.server && doc.toggles.serverEvents.guildUpdate) {

            const webhookClient = new WebhookClient({ url: doc.webhookUrls.server });

            const newName = oldGuild.name !== newGuild.name
            const newRegion = oldGuild.region !== newGuild.region
            const newAfkChannel = oldGuild.afkChannel !== newGuild.afkChannel
            const newAfkTimeout = oldGuild.afkTimeout !== newGuild.afkTimeout
            const newVerificationLevel = oldGuild.verificationLevel !== newGuild.verificationLevel
            const newExplicitContentFilter = oldGuild.explicitContentFilter !== newGuild.explicitContentFilter
            const newDefaultMessageNotifications = oldGuild.defaultMessageNotifications !== newGuild.defaultMessageNotifications
            const newSystemChannel = oldGuild.systemChannel !== newGuild.systemChannel
            const newPreferredLocale = oldGuild.preferredLocale !== newGuild.preferredLocale
            const newRulesChannel = oldGuild.rulesChannel !== newGuild.rulesChannel
            const newPublicUpdatesChannel = oldGuild.publicUpdatesChannel !== newGuild.publicUpdatesChannel
            const newMaxPresences = oldGuild.maxPresences !== newGuild.maxPresences
            const newMaxMembers = oldGuild.maxMembers !== newGuild.maxMembers
            const newVanityURLCode = oldGuild.vanityURLCode !== newGuild.vanityURLCode
            const newDescription = oldGuild.description !== newGuild.description
            const newBanner = oldGuild.banner !== newGuild.banner
            const newBannerColor = oldGuild.bannerColor !== newGuild.bannerColor
            const newIcon = oldGuild.icon !== newGuild.icon
            const newSplash = oldGuild.splash !== newGuild.splash
            const newDiscoverySplash = oldGuild.discoverySplash !== newGuild.discoverySplash
            const newOwner = oldGuild.owner !== newGuild.owner

            const embed = new MessageEmbed()
            .setTitle('Server Updated')

            .setFooter({text: "/log toggle server_events Server Update"})
            if (newName) embed.addField('Name', `**- Old Name:** ${oldGuild.name}\n**+ New Name:** ${newGuild.name}`)
            if (newRegion) embed.addField('Region', `**- Old Region:** ${oldGuild.region}\n**+ New Region:** ${newGuild.region}`)
            if (newAfkChannel) embed.addField('AFK Channel', `**- Old AFK Channel:** ${oldGuild.afkChannel}\n**+ New AFK Channel:** ${newGuild.afkChannel}`)
            if (newAfkTimeout) embed.addField('AFK Timeout', `**- Old AFK Timeout:** ${oldGuild.afkTimeout}\n**+ New AFK Timeout:** ${newGuild.afkTimeout}`)
            if (newVerificationLevel) embed.addField('Verification Level', `**- Old Verification Level:** ${oldGuild.verificationLevel}\n**+ New Verification Level:** ${newGuild.verificationLevel}`)
            if (newExplicitContentFilter) embed.addField('Explicit Content Filter', `**- Old Explicit Content Filter:** ${oldGuild.explicitContentFilter}\n**+ New Explicit Content Filter:** ${newGuild.explicitContentFilter}`)
            if (newDefaultMessageNotifications) embed.addField('Default Message Notifications', `**- Old Default Message Notifications:** ${oldGuild.defaultMessageNotifications}\n**+ New Default Message Notifications:** ${newGuild.defaultMessageNotifications}`)
            if (newSystemChannel) embed.addField('System Channel', `**- Old System Channel:** ${oldGuild.systemChannel}\n**+ New System Channel:** ${newGuild.systemChannel}`)
            if (newPreferredLocale) embed.addField('Preferred Locale', `**- Old Preferred Locale:** ${oldGuild.preferredLocale}\n**+ New Preferred Locale:** ${newGuild.preferredLocale}`)
            if (newRulesChannel) embed.addField('Rules Channel', `**- Old Rules Channel:** ${oldGuild.rulesChannel}\n**+ New Rules Channel:** ${newGuild.rulesChannel}`)
            if (newPublicUpdatesChannel) embed.addField('Public Updates Channel', `**- Old Public Updates Channel:** ${oldGuild.publicUpdatesChannel}\n**+ New Public Updates Channel:** ${newGuild.publicUpdatesChannel}`)
            if (newMaxPresences) embed.addField('Max Presences', `**- Old Max Presences:** ${oldGuild.maxPresences}\n**+ New Max Presences:** ${newGuild.maxPresences}`)
            if (newMaxMembers) embed.addField('Max Members', `**- Old Max Members:** ${oldGuild.maxMembers}\n**+ New Max Members:** ${newGuild.maxMembers}`)
            if (newVanityURLCode) embed.addField('Vanity URL Code', `**- Old Vanity URL Code:** ${oldGuild.vanityURLCode}\n**+ New Vanity URL Code:** ${newGuild.vanityURLCode}`)
            if (newDescription) embed.addField('Description', `**- Old Description:** ${oldGuild.description}\n**+ New Description:** ${newGuild.description}`)
            if (newBanner) embed.addField('Banner', `**- Old Banner:** ${oldGuild.banner}\n**+ New Banner:** ${newGuild.banner}`)
            if (newBannerColor) embed.addField('Banner Color', `**- Old Banner Color:** ${oldGuild.bannerColor}\n**+ New Banner Color:** ${newGuild.bannerColor}`)
            if (newIcon) embed.addField('Icon', `**- Old Icon:** ${oldGuild.icon}\n**+ New Icon:** ${newGuild.icon}`)
            if (newSplash) embed.addField('Splash', `**- Old Splash:** ${oldGuild.splash}\n**+ New Splash:** ${newGuild.splash}`)
            if (newDiscoverySplash) embed.addField('Discovery Splash', `**- Old Discovery Splash:** ${oldGuild.discoverySplash}\n**+ New Discovery Splash:** ${newGuild.discoverySplash}`)
            if (newOwner) embed.addField('Owner', `**- Old Owner:** ${oldGuild.owner}\n**+ New Owner:** ${newGuild.owner}`)
            embed
            .setColor(mainHex)
            .setTimestamp()

            webhookClient.send({
                avatarURL: client.user.avatarURL(),
                embeds: [embed]
            })

            webhookClient.destroy()
        }
    }

}

exports.guildUpdateEvent = guildUpdateEvent;