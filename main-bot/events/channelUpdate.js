const { EmbedBuilder, WebhookClient } = require('discord.js');
const { client, db } = require('../index.js')


// Colors
const mainHex = '#d79a61'
const lightYellowHex = '#FAEE87'

const coll = db.collection('logSettings')

const channelUpdateEvent = async (oldChannel, newChannel) => {

    let doc = await coll.findOne({ guildId: oldChannel.guild.id })

    let sent = false

    if (doc) {
        if (doc.channels.server && doc.toggles.serverEvents.channelUpdate) {

            const webhookClient = new WebhookClient({ url: doc.webhookUrls.server });

            const newName = oldChannel.name !== newChannel.name
            const newType = oldChannel.type !== newChannel.type
            const newCategory = oldChannel.parent !== newChannel.parent
            const newTopic = oldChannel.topic !== newChannel.topic
            const newNSFW = oldChannel.nsfw !== newChannel.nsfw
            const newSlowmode = oldChannel.rateLimitPerUser !== newChannel.rateLimitPerUser
            const newBitrate = oldChannel.bitrate !== newChannel.bitrate
            const newUserLimit = oldChannel.userLimit !== newChannel.userLimit

            const embed = new EmbedBuilder()
            .setTitle('Channel Updated')
            .setThumbnail('https://cdn.discordapp.com/emojis/1076747494668644442.webp')
            if (newName) embed.addFields({name:'Name', value:`**Old:** ${oldChannel.name}\n**New:** ${newChannel.name}`})
            if (newType) embed.addFields({name:'Type', value:`**Old:** ${oldChannel.type}\n**New:** ${newChannel.type}`})
            if (newCategory) embed.addFields({name:'Category', value:`**Old:** ${oldChannel.parent ? oldChannel.parent.name : 'None'}\n**New:** ${newChannel.parent ? newChannel.parent.name : 'None'}`})
            if (newTopic) embed.addFields({name:'Topic', value:`**Old:** ${oldChannel.topic ? oldChannel.topic : 'None'}\n**New:** ${newChannel.topic ? newChannel.topic : 'None'}`})
            if (newNSFW) embed.addFields({name:'NSFW', value:`**Old:** ${oldChannel.nsfw ? 'Yes' : 'No'}\n**New:** ${newChannel.nsfw ? 'Yes' : 'No'}`})
            if (newSlowmode) embed.addFields({name:'Slowmode', value:`**Old:** ${oldChannel.rateLimitPerUser ? oldChannel.rateLimitPerUser : 'None'}\n**New:** ${newChannel.rateLimitPerUser ? newChannel.rateLimitPerUser : 'None'}`})
            if (newBitrate) embed.addFields({name:'Bitrate', value:`**Old:** ${oldChannel.bitrate ? oldChannel.bitrate : 'None'}\n**New:** ${newChannel.bitrate ? newChannel.bitrate : 'None'}`})
            if (newUserLimit) embed.addFields({name:'User Limit', value:`**Old:** ${oldChannel.userLimit ? oldChannel.userLimit : 'None'}\n**New:** ${newChannel.userLimit ? newChannel.userLimit : 'None'}`})
            embed
            .setColor(lightYellowHex)
            .setFooter({text: "/log toggle server_events Channel Update"})
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

exports.channelUpdateEvent = channelUpdateEvent;