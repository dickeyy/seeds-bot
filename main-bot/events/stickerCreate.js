const { MessageEmbed, WebhookClient } = require('discord.js');
const { connectDb } = require('../utils/db.js')
const client = require('../index.js').client

const db = connectDb()

// Colors
const mainHex = '#d79a61'

const coll = db.collection('logSettings')

const stickerCreateEvent = async (sticker) => {

    let doc = await coll.findOne({ guildId: sticker.guild.id })

    if (doc) {
        if (doc.channels.server && doc.toggles.serverEvents.stickerCreate) {

            const webhookClient = new WebhookClient({ url: doc.webhookUrls.server });

            const embed = new MessageEmbed()
            .setTitle('Sticker Created')
            .setDescription(`**Sticker Name:** ${sticker.name}\n**Description:** ${sticker.description}\n\n**ID:** ${sticker.id}`)
            .setFooter({text: "/log toggle server_events Sticker Create"})
            .setColor('DARK_BUT_NOT_BLACK')
            .setTimestamp()

            webhookClient.send({
                avatarURL: client.user.avatarURL(),
                embeds: [embed]
            })

            webhookClient.destroy()
        }
    }

}

exports.stickerCreateEvent = stickerCreateEvent;