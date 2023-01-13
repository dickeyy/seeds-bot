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

            let hasContent = true
            if (message.content === '') {
                hasContent = false
            }

            let hasAttachments = false
            let attachments = ''
            if (message.attachments.size > 0) {
                message.attachments.forEach(attachment => {
                    attachments += `\n[${attachment.name}](${attachment.url})`
                })
                hasAttachments = true
            }

            const embed = new MessageEmbed()
            .setTitle(`Message Deleted in #${message.channel.name}`)
            .setAuthor({ name: message.author.tag, iconURL: message.author.avatarURL() })
            .setFooter({text: "/log toggle message_events Message Delete"})
            .setColor('#914444')
            .setTimestamp()

            if (hasContent && hasAttachments) {
                embed.setDescription(`**Content:** ${message.content}\n**Attachments:** ${attachments}\n\n**ID:** ${message.id}`)
            } else if (hasContent && !hasAttachments) {
                embed.setDescription(`**Content:** ${message.content}\n\n**ID:** ${message.id}`)
            } else if (!hasContent && hasAttachments) {
                embed.setDescription(`**Attachments:** ${attachments}\n\n**ID:** ${message.id}`)
            }

            webhookClient.send({
                avatarURL: client.user.avatarURL(),
                embeds: [embed]
            })

            webhookClient.destroy()
        }
    }

}

exports.messageDeleteEvent = messageDeleteEvent;