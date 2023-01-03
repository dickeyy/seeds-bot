const { MessageEmbed, WebhookClient } = require('discord.js');
const { connectDb } = require('../utils/db.js')
const client = require('../index.js').client

const db = connectDb()

// Colors
const mainHex = '#d79a61'

const coll = db.collection('logSettings')

const messageUpdateEvent = async (oldMessage, newMessage) => {

    let sent = false

    let doc = await coll.findOne({ guildId: oldMessage.guild.id })

    if (doc) {
        if (doc.channels.message && doc.toggles.messageEvents.messageUpdate) {

            const webhookClient = new WebhookClient({ url: doc.webhookUrls.message });

            const newContent = newMessage.content !== oldMessage.content

            const embed = new MessageEmbed()
            .setTitle(`Message Edited in #${oldMessage.channel.name}`)
            .setAuthor({ name: oldMessage.author.tag, iconURL: oldMessage.author.avatarURL() })
            .setDescription(`**- Before: **${oldMessage.content}\n**- After: **${newMessage.content}`)
            .setFooter({text: "/log toggle message_events Message Update"})
            .setColor('#4CA99D')
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

exports.messageUpdateEvent = messageUpdateEvent;