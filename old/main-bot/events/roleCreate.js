const { EmbedBuilder, WebhookClient } = require('discord.js');
const { client, db } = require('../index.js')

// Colors
const mainHex = '#d79a61'
const lightRedHex = '#E75151'

const coll = db.collection('logSettings')

const roleCreateEvent = async (role) => {

    let doc = await coll.findOne({ guildId: role.guild.id })

    let sent = false

    if (doc) {
        if (doc.channels.server && doc.toggles.serverEvents.roleCreate) {

            const webhookClient = new WebhookClient({ url: doc.webhookUrls.server });

            const embed = new EmbedBuilder()
            .setTitle('Role Created')
            .setThumbnail('https://cdn.discordapp.com/emojis/1064444103850475580.webp')
            .setDescription(`**Role:** ${role.name}\n**Position:** ${role.position}\n\n**ID:** ${role.id}`)
            .setFooter({text: "/log toggle server_events Role Create"})
            .setColor('#A3FA87')
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

exports.roleCreateEvent = roleCreateEvent;