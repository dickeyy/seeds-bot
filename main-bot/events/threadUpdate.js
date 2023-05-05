const { EmbedBuilder, WebhookClient } = require('discord.js');
const { client, db } = require('../index.js')

// Colors
const mainHex = '#d79a61'

const coll = db.collection('logSettings')

const threadUpdateEvent = async (oldThread, newThread) => {

    let doc = await coll.findOne({ guildId: oldThread.guild.id })

    let sent = false

    if (doc) {
        if (doc.channels.server && doc.toggles.serverEvents.threadUpdate) {

            const webhookClient = new WebhookClient({ url: doc.webhookUrls.server });

            const newName = oldThread.name != newThread.name
            const newAutoArchiveDuration = oldThread.autoArchiveDuration != newThread.autoArchiveDuration

            const embed = new EmbedBuilder()
            .setTitle('Thread Updated')
            .setThumbnail('https://cdn.discordapp.com/emojis/1065110917962022922.webp')
            if (newName) embed.addFields({name:'Name', value:`**Old:** ${oldThread.name}\n**New:** ${newThread.name}`})
            if (newAutoArchiveDuration) embed.addFields({name:'Auto Archive Duration', value:`**Old:** ${oldThread.autoArchiveDuration} mins\n**New:** ${newThread.autoArchiveDuration} mins`})
            .setFooter({text: "/log toggle server_events Thread Update"})
            .setColor('#4CA99D')
            .setTimestamp()

            if (embed.data.fields == undefined) return

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

exports.threadUpdateEvent = threadUpdateEvent;