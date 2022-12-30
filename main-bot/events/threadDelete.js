const { MessageEmbed, WebhookClient } = require('discord.js');
const { connectDb } = require('../utils/db.js')
const client = require('../index.js').client

const db = connectDb()

// Colors
const mainHex = '#d79a61'

const coll = db.collection('logSettings')

const threadDeleteEvent = async (thread) => {

    let doc = await coll.findOne({ guildId: thread.guild.id })

    if (doc) {
        if (doc.channels.server && doc.toggles.serverEvents.threadDelete) {

            const webhookClient = new WebhookClient({ url: doc.webhookUrls.server });

            const embed = new MessageEmbed()
            .setTitle('Thread Deleted')
            .setDescription(`**Thread:** ${thread.name}\n\n**ID:** ${thread.id}`)
            .setFooter({text: "/log toggle server_events Thread Delete"})
            .setColor('#006154')
            .setTimestamp()

            webhookClient.send({
                avatarURL: client.user.avatarURL(),
                embeds: [embed]
            })

            webhookClient.destroy()
        }
    }

}

exports.threadDeleteEvent = threadDeleteEvent;