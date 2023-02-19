const { EmbedBuilder, WebhookClient } = require('discord.js');
const { log } = require('../functions/log.js');
const { connectDb } = require('../utils/db.js')
const client = require('../index.js').client

const db = connectDb()
// Colors
const mainHex = '#d79a61'

const coll = db.collection('logSettings')

const stickerUpdateEvent = async (oldSticker, newSticker) => {

    let doc = await coll.findOne({ guildId: oldSticker.guild.id })

    let sent = false

    if (doc) {
        if (doc.channels.server && doc.toggles.serverEvents.stickerUpdate) {

            const webhookClient = new WebhookClient({ url: doc.webhookUrls.server });

            const newName = oldSticker.name !== newSticker.name
            const newDescription = oldSticker.description !== newSticker.description

            const embed = new EmbedBuilder()
            .setTitle('Sticker Updated')
            .setThumbnail('https://cdn.discordapp.com/emojis/1064444283790307349.webp')
            if (newName) embed.addFields({name:'Name', value:`**Old:** ${oldSticker.name}\n**New:** ${newSticker.name}`})
            if (newDescription) embed.addFields({name:'Description', value:`**Old:** ${oldSticker.description}\n**New:** ${newSticker.description}`})
            embed
            .setFooter({text: "/log toggle server_events Sticker Update"})
            .setColor('DARK_BUT_NOT_BLACK')
            .setTimestamp()

            if (embed.data.fields.length === 0) return

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

exports.stickerUpdateEvent = stickerUpdateEvent;