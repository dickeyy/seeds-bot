const { EmbedBuilder, WebhookClient } = require('discord.js');
const { log } = require('../functions/log.js');
const { connectDb } = require('../utils/db.js')
const client = require('../index.js').client

const db = connectDb()
// Colors
const mainHex = '#d79a61'
const lightRedHex = '#E75151'

const coll = db.collection('logSettings')

const guildUpdateEvent = async (oldGuild, newGuild) => {

    let doc = await coll.findOne({ guildId: oldGuild.id })

    let sent = false

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

            const embed = new EmbedBuilder()
            .setTitle('Server Updated')

            .setFooter({text: "/log toggle server_events Server Update"})
            .setThumbnail('https://cdn.discordapp.com/emojis/1064444101870759958.webp')
            if (newName) embed.addFields({name:'Name', value:`**- Old Name:** ${oldGuild.name}\n**+ New Name:** ${newGuild.name}`})
            if (newRegion) embed.addFields({name:'Region', value:`**- Old Region:** ${oldGuild.region}\n**+ New Region:** ${newGuild.region}`})
            if (newAfkChannel) embed.addFields({name:'AFK Channel', value:`**- Old AFK Channel:** ${oldGuild.afkChannel}\n**+ New AFK Channel:** ${newGuild.afkChannel}`})
            if (newAfkTimeout) embed.addFields({name:'AFK Timeout', value:`**- Old AFK Timeout:** ${oldGuild.afkTimeout}\n**+ New AFK Timeout:** ${newGuild.afkTimeout}`})
            if (newVerificationLevel) embed.addFields({name:'Verification Level', value:`**- Old Verification Level:** ${oldGuild.verificationLevel}\n**+ New Verification Level:** ${newGuild.verificationLevel}`})
            if (newExplicitContentFilter) embed.addFields({name:'Explicit Content Filter', value:`**- Old Explicit Content Filter:** ${oldGuild.explicitContentFilter}\n**+ New Explicit Content Filter:** ${newGuild.explicitContentFilter}`})
            if (newDefaultMessageNotifications) embed.addFields({name:'Default Message Notifications', value:`**- Old Default Message Notifications:** ${oldGuild.defaultMessageNotifications}\n**+ New Default Message Notifications:** ${newGuild.defaultMessageNotifications}`})
            if (newSystemChannel) embed.addFields({name:'System Channel', value:`**- Old System Channel:** ${oldGuild.systemChannel}\n**+ New System Channel:** ${newGuild.systemChannel}`})
            if (newPreferredLocale) embed.addFields({name:'Preferred Locale', value:`**- Old Preferred Locale:** ${oldGuild.preferredLocale}\n**+ New Preferred Locale:** ${newGuild.preferredLocale}`})
            if (newRulesChannel) embed.addFields({name:'Rules Channel', value:`**- Old Rules Channel:** ${oldGuild.rulesChannel}\n**+ New Rules Channel:** ${newGuild.rulesChannel}`})
            if (newPublicUpdatesChannel) embed.addFields({name:'Public Updates Channel', value:`**- Old Public Updates Channel:** ${oldGuild.publicUpdatesChannel}\n**+ New Public Updates Channel:** ${newGuild.publicUpdatesChannel}`})
            if (newMaxPresences) embed.addFields({name:'Max Presences', value:`**- Old Max Presences:** ${oldGuild.maxPresences}\n**+ New Max Presences:** ${newGuild.maxPresences}`})
            if (newMaxMembers) embed.addFields({name:'Max Members', value:`**- Old Max Members:** ${oldGuild.maxMembers}\n**+ New Max Members:** ${newGuild.maxMembers}`})
            if (newVanityURLCode) embed.addFields({name:'Vanity URL Code', value:`**- Old Vanity URL Code:** ${oldGuild.vanityURLCode}\n**+ New Vanity URL Code:** ${newGuild.vanityURLCode}`})
            if (newDescription) embed.addFields({name:'Description', value:`**- Old Description:** ${oldGuild.description}\n**+ New Description:** ${newGuild.description}`})
            if (newBanner) embed.addFields({name:'Banner', value:`**- Old Banner:** ${oldGuild.banner}\n**+ New Banner:** ${newGuild.banner}`})
            if (newBannerColor) embed.addFields({name:'Banner Color', value:`**- Old Banner Color:** ${oldGuild.bannerColor}\n**+ New Banner Color:** ${newGuild.bannerColor}`})
            if (newIcon) embed.addFields({name:'Icon', value:`**- Old Icon:** ${oldGuild.icon}\n**+ New Icon:** ${newGuild.icon}`})
            if (newSplash) embed.addFields({name:'Splash', value:`**- Old Splash:** ${oldGuild.splash}\n**+ New Splash:** ${newGuild.splash}`})
            if (newDiscoverySplash) embed.addFields({name:'Discovery Splash', value:`**- Old Discovery Splash:** ${oldGuild.discoverySplash}\n**+ New Discovery Splash:** ${newGuild.discoverySplash}`})
            if (newOwner) embed.addFields({name:'Owner', value:`**- Old Owner:** ${oldGuild.owner}\n**+ New Owner:** ${newGuild.owner}`})
            embed
            .setColor(mainHex)
            .setTimestamp()

            if (embed.data.fields == undefined) return

            if (!sent) {
                webhookClient.send({
                    avatarURL: client.user.avatarURL(),
                    embeds: [embed]
                })
                sent = true
            }

            webhookClient.destroy()
        }
    }

}

exports.guildUpdateEvent = guildUpdateEvent;