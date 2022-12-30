const { MessageEmbed, WebhookClient } = require('discord.js');
const { connectDb } = require('../utils/db.js')
const client = require('../index.js').client

const db = connectDb()

// Colors
const mainHex = '#d79a61'
const lightRedHex = '#E75151'

const coll = db.collection('logSettings')

const guildScheduledEventCreateEvent = async (guildScheduledEvent) => {

    let doc = await coll.findOne({ guildId: guildScheduledEvent.guild.id })

    if (doc) {
        if (doc.channels.server && doc.toggles.serverEvents.guildScheduledEventCreate) {

            const webhookClient = new WebhookClient({ url: doc.webhookUrls.server });
            console.log(guildScheduledEvent)
            const embed = new MessageEmbed()
            .setTitle('Scheduled Event Created')
            .setFooter({text: "/log toggle server_events Server Event Create"})
            .setColor()
            .setTimestamp()

            webhookClient.send({
                avatarURL: client.user.avatarURL(),
                embeds: [embed]
            })

            webhookClient.destroy()
        }
    }

}

exports.guildScheduledEventCreateEvent = guildScheduledEventCreateEvent;