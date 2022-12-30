const { MessageEmbed, WebhookClient } = require('discord.js');
const { connectDb } = require('../utils/db.js')
const client = require('../index.js').client

const db = connectDb()

// Colors
const mainHex = '#d79a61'

const coll = db.collection('logSettings')

const messageDeleteEvent = async (message) => {

    let doc = await coll.findOne({ guildId: message.guild.id })

    if (doc) {
        if (doc.channels.message && doc.toggles.messageEvents.messageDelete) {

            const webhookClient = new WebhookClient({ url: doc.webhookUrls.message });

            const embed = new MessageEmbed()
            .setTitle('Message Deleted')
            .setAuthor({ name: message.author.tag, iconURL: message.author.avatarURL() })
            .setDescription(`**Channel:** <#${message.channel.id}>\n\n**Message:** ${message.content}\n**Context:** [Jump](${message.url})\n\n**ID:** ${message.id}`)
            .setFooter({text: "/log toggle message_events Message Delete"})
            .setColor('#4CA99D')
            .setTimestamp()

            webhookClient.send({
                avatarURL: client.user.avatarURL(),
                embeds: [embed]
            })

            webhookClient.destroy()
        }
    }

}

exports.messageDeleteEvent = messageDeleteEvent;