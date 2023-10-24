const { EmbedBuilder, WebhookClient } = require('discord.js');
const { client, db } = require('../index.js')

// Colors
const mainHex = '#d79a61'
const lightRedHex = '#E75151'

const coll = db.collection('logSettings')

const channelPinsUpdateEvent = async (channel) => {

    let doc = await coll.findOne({ guildId: channel.guild.id })

    let sent = false

    if (doc) {
        if (doc.channels.server && doc.toggles.serverEvents.channelPinsUpdate) {

            const webhookClient = new WebhookClient({ url: doc.webhookUrls.server });

            const embed = new EmbedBuilder()
            .setTitle('Channel Pins Updated')
            .setDescription(`**Channel:** <#${channel.id}>\nFor more information check the pin`)
            .setFooter({text: "/log toggle server_events Channel Pins Update"})
            .setTimestamp()

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

exports.channelPinsUpdateEvent = channelPinsUpdateEvent;