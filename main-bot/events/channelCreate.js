const { MessageEmbed, WebhookClient } = require('discord.js');
const { connectDb } = require('../utils/db.js')
const client = require('../index.js').client

const db = connectDb()

// Colors
const mainHex = '#d79a61'
const lightGreenHex = '#61E85C'

const coll = db.collection('logSettings')

const channelCreateEvent = async (channel) => {

    let doc = await coll.findOne({ guildId: channel.guild.id })

    if (doc) {
        if (doc.channels.server && doc.toggles.serverEvents.channelCreate) {

            const webhookClient = new WebhookClient({ url: doc.webhookUrls.server });

            const embed = new MessageEmbed()
            .setTitle('Channel Created')
            .setDescription(`**Channel:** <#${channel.id}>\n**Type:** ${channel.type}\n**Category:** ${channel.parent ? channel.parent.name : 'None'}\n**ID:** ${channel.id}`)
            .setColor(lightGreenHex)
            .setFooter({text: "/log toggle server_events Channel Create"})
            .setTimestamp()

            webhookClient.send({
                avatarURL: client.user.avatarURL(),
                embeds: [embed]
            })

            webhookClient.destroy()
        }
    }

}

exports.channelCreateEvent = channelCreateEvent;