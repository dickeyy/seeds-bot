const { MessageEmbed, WebhookClient } = require('discord.js');
const { log } = require('../functions/log.js');
const { connectDb } = require('../utils/db.js')
const client = require('../index.js').client

const db = connectDb()

// Colors
const mainHex = '#d79a61'
const lightRedHex = '#E75151'

const coll = db.collection('logSettings')

const emojiCreateEvent = async (emoji) => {

    let doc = await coll.findOne({ guildId: emoji.guild.id })

    let sent = false

    if (doc) {
        if (doc.channels.server && doc.toggles.serverEvents.emojiCreate) {
            const webhookClient = new WebhookClient({ url: doc.webhookUrls.server });

            const embed = new MessageEmbed()
            .setTitle('Emoji Created')
            .setDescription(`**Emoji:** <:${emoji.name}:${emoji.id}> ${emoji.name}\n\n**ID:** ${emoji.id}`)
            .setFooter({text: "/log toggle server_events Emoji Create"})
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

exports.emojiCreateEvent = emojiCreateEvent;