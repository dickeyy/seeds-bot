const { EmbedBuilder, WebhookClient } = require('discord.js');
const { client, db } = require('../index.js')

// Colors
const mainHex = '#d79a61'

const coll = db.collection('logSettings')

const threadCreateEvent = async (thread) => {

    let doc = await coll.findOne({ guildId: thread.guild.id })

    let sent = false

    if (doc) {
        if (doc.channels.server && doc.toggles.serverEvents.threadCreate) {

            const webhookClient = new WebhookClient({ url: doc.webhookUrls.server });

            const embed = new EmbedBuilder()
            .setTitle('Thread Created')
            .setThumbnail('https://cdn.discordapp.com/emojis/1065110721752477768.webp')
            .setDescription(`**Thread:** <#${thread.id}>\n\n**ID:** ${thread.id}`)
            .setFooter({text: "/log toggle server_events Thread Create"})
            .setColor('#00BBA1')
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

exports.threadCreateEvent = threadCreateEvent;