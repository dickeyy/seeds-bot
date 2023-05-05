const { EmbedBuilder, WebhookClient } = require('discord.js');
const { client, db } = require('../index.js')

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

            const embed = new EmbedBuilder()
            .setTitle('Role Updated')
            .setThumbnail('https://cdn.discordapp.com/emojis/1064444287774904400.webp')
            if (newName) embed.addFields({name:'Name', value:`**- Old Name:** ${oldRole.name}\n**+ New Name:** ${newRole.name}`})
            if (newPosition) embed.addFields({name:'Position', value:`**- Old Position:** ${oldRole.position}\n**+ New Position:** ${newRole.position}`})
            if (newIcon) embed.addFields({name:'Icon', value:`**- Old Icon:** ${oldRole.icon}\n**+ New Icon:** ${newRole.icon}`})
            embed
            .setFooter({text: "/log toggle server_events Role Update"})
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

exports.roleUpdateEvent = roleUpdateEvent;