const { MessageEmbed, WebhookClient } = require('discord.js');
const { connectDb } = require('../utils/db.js')
const client = require('../index.js').client

const db = connectDb()

// Colors
const mainHex = '#d79a61'

const coll = db.collection('logSettings')

const threadUpdateEvent = async (oldThread, newThread) => {

    let doc = await coll.findOne({ guildId: oldThread.guild.id })

    if (doc) {
        if (doc.channels.server && doc.toggles.serverEvents.threadUpdate) {

            const webhookClient = new WebhookClient({ url: doc.webhookUrls.server });

            const newName = oldThread.name != newThread.name
            const newAutoArchiveDuration = oldThread.autoArchiveDuration != newThread.autoArchiveDuration

            const embed = new MessageEmbed()
            .setTitle('Thread Updated')
            if (newName) embed.addField('Name', `**Old:** ${oldThread.name}\n**New:** ${newThread.name}`)
            if (newAutoArchiveDuration) embed.addField('Auto Archive Duration', `**Old:** ${oldThread.autoArchiveDuration} mins\n**New:** ${newThread.autoArchiveDuration} mins`)
            .setFooter({text: "/log toggle server_events Thread Update"})
            .setColor('#4CA99D')
            .setTimestamp()

            webhookClient.send({
                avatarURL: client.user.avatarURL(),
                embeds: [embed]
            })

            webhookClient.destroy()
        }
    }

}

exports.threadUpdateEvent = threadUpdateEvent;