const { MessageEmbed, WebhookClient } = require('discord.js');
const { connectDb } = require('../utils/db.js')
const client = require('../index.js').client

const db = connectDb()

// Colors
const mainHex = '#d79a61'

const coll = db.collection('logSettings')

const messageUpdateEvent = async (oldMessage, newMessage) => {

    console.log('dick')

    let doc = await coll.findOne({ guildId: oldMessage.guild.id })

    if (doc) {
        if (doc.channels.message && doc.toggles.messageEvents.messageUpdate) {

            const webhookClient = new WebhookClient({ url: doc.webhookUrls.message });

            const newContent = newMessage.content !== oldMessage.content

            const embed = new MessageEmbed()
            .setTitle('Message Edited')
            .setAuthor({ name: message.author.tag, iconURL: message.author.avatarURL() })
            if (newContent) embed.setDescription(`**Channel:** <#${message.channel.id}>\n\n**- Old Message:** ${oldMessage.content}\n**+ New Message:** ${newMessage.content}\n**Context:** [Jump](${message.url})\n\n**ID:** ${message.id}`)
            .setFooter({text: "/log toggle message_events Message Update"})
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

exports.messageUpdateEvent = messageUpdateEvent;