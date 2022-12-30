const { MessageEmbed, WebhookClient } = require('discord.js');
const { connectDb } = require('../utils/db.js')
const client = require('../index.js').client

const db = connectDb()

// Colors
const mainHex = '#d79a61'
const lightRedHex = '#E75151'

const coll = db.collection('logSettings')

const channelPinsUpdateEvent = async (channel) => {

    let doc = await coll.findOne({ guildId: channel.guild.id })

    if (doc) {
        if (doc.channels.server && doc.toggles.serverEvents.channelPinsUpdate) {

            const webhookClient = new WebhookClient({ url: doc.webhookUrls.server });

            const embed = new MessageEmbed()
            .setTitle('Channel Pins Updated')
            .setDescription(`**Channel:** <#${channel.id}>\nFor more information check the pin`)
            .setFooter({text: "/log toggle server_events Channel Pins Update"})
            .setTimestamp()

            webhookClient.send({
                avatarURL: client.user.avatarURL(),
                embeds: [embed]
            })

            webhookClient.destroy()
        }
    }

}

exports.channelPinsUpdateEvent = channelPinsUpdateEvent;