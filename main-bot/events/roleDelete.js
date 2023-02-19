const { EmbedBuilder, WebhookClient } = require('discord.js');
const { log } = require('../functions/log.js');
const { connectDb } = require('../utils/db.js')
const client = require('../index.js').client

const db = connectDb()

// Colors
const mainHex = '#d79a61'

const coll = db.collection('logSettings')

const roleDeleteEvent = async (role) => {

    let doc = await coll.findOne({ guildId: role.guild.id })

    let sent = false

    if (doc) {
        if (doc.channels.server && doc.toggles.serverEvents.roleDelete) {

            const webhookClient = new WebhookClient({ url: doc.webhookUrls.server });

            const embed = new EmbedBuilder()
            .setTitle('Role Deleted')
            .setThumbnail('https://cdn.discordapp.com/emojis/1064442708069990411.webp')
            .setDescription(`**Role:** ${role.name}\n\n**ID:** ${role.id}`)
            .setFooter({text: "/log toggle server_events Role Delete"})
            .setColor('#FA8A87')
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

exports.roleDeleteEvent = roleDeleteEvent;