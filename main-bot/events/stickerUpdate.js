const { MessageEmbed, WebhookClient } = require('discord.js');
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

            const embed = new MessageEmbed()
            .setTitle('Sticker Updated')
            if (newName) embed.addField('Name', `**Old:** ${oldSticker.name}\n**New:** ${newSticker.name}`)
            if (newDescription) embed.addField('Description', `**Old:** ${oldSticker.description}\n**New:** ${newSticker.description}`)
            embed
            .setFooter({text: "/log toggle server_events Sticker Update"})
            .setColor('DARK_BUT_NOT_BLACK')
            .setTimestamp()

            if (embed.fields.length === 0) return

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