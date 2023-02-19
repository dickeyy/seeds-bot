const { EmbedBuilder, WebhookClient } = require('discord.js');
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

            const embed = new EmbedBuilder()
            .setTitle('Emoji Updated')
            .setThumbnail('https://cdn.discordapp.com/emojis/1064443275311849513.webp')
            .setDescription(`**- Old Name:** ${oldEmoji.name}\n**+ New Name:** ${newEmoji.name}\n\n**ID:** ${newEmoji.id}`)
            .setFooter({text: "/log toggle server_events Emoji Update"})
            .setColor('DarkButNotBlack')
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