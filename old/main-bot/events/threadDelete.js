const { EmbedBuilder, WebhookClient } = require('discord.js');
const { client, db } = require('../index.js')

// Colors
const mainHex = '#d79a61'

const coll = db.collection('logSettings')

const threadDeleteEvent = async (thread) => {

    let doc = await coll.findOne({ guildId: thread.guild.id })

    let sent = false

    if (doc) {
        if (doc.channels.server && doc.toggles.serverEvents.threadDelete) {

            const webhookClient = new WebhookClient({ url: doc.webhookUrls.server });

            const embed = new EmbedBuilder()
            .setTitle('Thread Deleted')
            .setThumbnail('https://cdn.discordapp.com/emojis/1064444110334861373.webp')
            .setDescription(`**Thread:** ${thread.name}\n\n**ID:** ${thread.id}`)
            .setFooter({text: "/log toggle server_events Thread Delete"})
            .setColor('#006154')
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

exports.threadDeleteEvent = threadDeleteEvent;