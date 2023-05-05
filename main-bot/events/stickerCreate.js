const { EmbedBuilder, WebhookClient } = require('discord.js');
const { client, db } = require('../index.js')

// Colors
const mainHex = '#d79a61'

const coll = db.collection('logSettings')

const stickerCreateEvent = async (sticker) => {

    let doc = await coll.findOne({ guildId: sticker.guild.id })

    let sent = false

    if (doc) {
        if (doc.channels.server && doc.toggles.serverEvents.stickerCreate) {

            const webhookClient = new WebhookClient({ url: doc.webhookUrls.server });

            const embed = new EmbedBuilder()
            .setTitle('Sticker Created')
            .setThumbnail('https://cdn.discordapp.com/emojis/1064444286583717958.webp')
            .setDescription(`**Sticker Name:** ${sticker.name}\n**Description:** ${sticker.description}\n\n**ID:** ${sticker.id}`)
            .setFooter({text: "/log toggle server_events Sticker Create"})
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

exports.stickerCreateEvent = stickerCreateEvent;