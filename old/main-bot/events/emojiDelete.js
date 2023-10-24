const { EmbedBuilder, WebhookClient } = require('discord.js');
const { client, db } = require('../index.js')


// Colors
const mainHex = '#d79a61'
const lightRedHex = '#E75151'

const coll = db.collection('logSettings')

const emojiDeleteEvent = async (emoji) => {

    let doc = await coll.findOne({ guildId: emoji.guild.id })

    let sent = false

    if (doc) {
        if (doc.channels.server && doc.toggles.serverEvents.emojiDelete) {

            const webhookClient = new WebhookClient({ url: doc.webhookUrls.server });

            const embed = new EmbedBuilder()
            .setTitle('Emoji Deleted')
            .setThumbnail('https://cdn.discordapp.com/emojis/1065110914128416818.webp')
            .setDescription(`**Emoji:** ${emoji.name}\n\n**ID:** ${emoji.id}`)
            .setFooter({text: "/log toggle server_events Emoji Delete"})
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

exports.emojiDeleteEvent = emojiDeleteEvent;