const { MessageEmbed, WebhookClient } = require('discord.js');
const { connectDb } = require('../utils/db.js')
const client = require('../index.js').client

const db = connectDb()

// Colors
const mainHex = '#d79a61'
const lightRedHex = '#E75151'

const coll = db.collection('logSettings')

const channelDeleteEvent = async (channel) => {

    let doc = await coll.findOne({ guildId: channel.guild.id })

    if (doc) {
        if (doc.channels.server && doc.toggles.serverEvents.channelDelete) {

            const webhookClient = new WebhookClient({ url: doc.webhookUrls.server });

            const embed = new MessageEmbed()
            .setTitle('Channel Deleted')
            .setDescription(`**Channel:** ${channel.name}\n**Type:** ${channel.type}\n**Category:** ${channel.parent ? channel.parent.name : 'None'}\n**ID:** ${channel.id}`)
            .setColor(lightRedHex)
            .setFooter({text: "/log toggle server_events Channel Delete"})
            .setTimestamp()

            webhookClient.send({
                avatarURL: client.user.avatarURL(),
                embeds: [embed]
            })

            webhookClient.destroy()
        }
    }

}

exports.channelDeleteEvent = channelDeleteEvent;