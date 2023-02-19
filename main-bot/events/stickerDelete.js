const { EmbedBuilder, WebhookClient } = require('discord.js');
const { log } = require('../functions/log.js');
const { connectDb } = require('../utils/db.js')
const client = require('../index.js').client

const db = connectDb()

// Colors
const mainHex = '#d79a61'

const coll = db.collection('logSettings')

const stickerDeleteEvent = async (sticker) => {

    let doc = await coll.findOne({ guildId: sticker.guild.id })

    let sent = false

    if (doc) {
        if (doc.channels.server && doc.toggles.serverEvents.stickerDelete) {

            const webhookClient = new WebhookClient({ url: doc.webhookUrls.server });

            const embed = new EmbedBuilder()
            .setTitle('Sticker Deleted')
            .setThumbnail('https://cdn.discordapp.com/emojis/1064444214819164191.webp')
            .setDescription(`**Sticker Name:** ${sticker.name}\n**Description:** ${sticker.description}\n\n**ID:** ${sticker.id}`)
            .setFooter({text: "/log toggle server_events Sticker Delete"})
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

exports.stickerDeleteEvent = stickerDeleteEvent;