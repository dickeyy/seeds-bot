const { MessageEmbed, WebhookClient } = require('discord.js');
const { connectDb } = require('../utils/db.js')
const client = require('../index.js').client

const db = connectDb()

// Colors
const mainHex = '#d79a61'
const lightRedHex = '#E75151'

const coll = db.collection('logSettings')

const emojiUpdateEvent = async (oldEmoji, newEmoji) => {

    let doc = await coll.findOne({ guildId: oldEmoji.guild.id })

    let sent = false

    if (doc) {
        if (doc.channels.server && doc.toggles.serverEvents.emojiUpdate) {

            const webhookClient = new WebhookClient({ url: doc.webhookUrls.server });

            const embed = new MessageEmbed()
            .setTitle('Emoji Updated')
            .setDescription(`**- Old Name:** ${oldEmoji.name}\n**+ New Name:** ${newEmoji.name}\n\n**ID:** ${newEmoji.id}`)
            .setFooter({text: "/log toggle server_events Emoji Update"})
            .setColor('DARK_BUT_NOT_BLACK')
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

exports.emojiUpdateEvent = emojiUpdateEvent;