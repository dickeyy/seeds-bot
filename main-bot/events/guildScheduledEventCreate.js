const { EmbedBuilder, WebhookClient } = require('discord.js');
const { log } = require('../functions/log.js');
const { connectDb } = require('../utils/db.js')
const client = require('../index.js').client

const db = connectDb()

// Colors
const mainHex = '#d79a61'
const lightRedHex = '#E75151'

const coll = db.collection('logSettings')

const guildScheduledEventCreateEvent = async (guildScheduledEvent) => {

    let doc = await coll.findOne({ guildId: guildScheduledEvent.guild.id })

    let sent = false

    if (doc) {
        if (doc.channels.server && doc.toggles.serverEvents.guildScheduledEventCreate) {

            const webhookClient = new WebhookClient({ url: doc.webhookUrls.server });
            console.log(guildScheduledEvent)
            const embed = new EmbedBuilder()
            .setTitle('Scheduled Event Created')
            .setThumbnail('https://cdn.discordapp.com/emojis/1064444112981463150.webp')
            .setFooter({text: "/log toggle server_events Server Event Create"})
            .setColor()
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

exports.guildScheduledEventCreateEvent = guildScheduledEventCreateEvent;