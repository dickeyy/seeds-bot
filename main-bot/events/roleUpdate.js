const { MessageEmbed, WebhookClient } = require('discord.js');
const { connectDb } = require('../utils/db.js')
const client = require('../index.js').client

const db = connectDb()

// Colors
const mainHex = '#d79a61'

const coll = db.collection('logSettings')

const roleUpdateEvent = async (oldRole, newRole) => {

    let doc = await coll.findOne({ guildId: oldRole.guild.id })

    let sent = false

    if (doc) {
        if (doc.channels.server && doc.toggles.serverEvents.roleUpdate) {

            const webhookClient = new WebhookClient({ url: doc.webhookUrls.server });

            const newName = oldRole.name !== newRole.name
            const newPosition = oldRole.position !== newRole.position
            const newIcon = oldRole.icon !== newRole.icon

            const embed = new MessageEmbed()
            .setTitle('Role Updated')
            if (newName) embed.addField('Name', `**- Old Name:** ${oldRole.name}\n**+ New Name:** ${newRole.name}`)
            if (newPosition) embed.addField('Position', `**- Old Position:** ${oldRole.position}\n**+ New Position:** ${newRole.position}`)
            if (newIcon) embed.addField('Icon', `**- Old Icon:** ${oldRole.icon}\n**+ New Icon:** ${newRole.icon}`)
            embed
            .setFooter({text: "/log toggle server_events Role Update"})
            .setTimestamp()

            if (embed.fields.length === 0) return

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

exports.roleUpdateEvent = roleUpdateEvent;