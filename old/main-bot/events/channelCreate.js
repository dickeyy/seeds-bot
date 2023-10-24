const { EmbedBuilder, WebhookClient } = require('discord.js');
const { client, db } = require('../index.js')

// Colors
const mainHex = '#d79a61'
const lightGreenHex = '#61E85C'

const coll = db.collection('logSettings')

const channelCreateEvent = async (channel) => {

    let doc = await coll.findOne({ guildId: channel.guild.id })

    let sent = false

    if (doc) {
        if (doc.channels.server && doc.toggles.serverEvents.channelCreate) {

            const webhookClient = new WebhookClient({ url: doc.webhookUrls.server });

            const embed = new EmbedBuilder()
            .setTitle('Channel Created')
            .setThumbnail('https://cdn.discordapp.com/emojis/1076747519951908954.webp')
            .setDescription(`**Channel:** <#${channel.id}>\n**Type:** ${channel.type}\n**Category:** ${channel.parent ? channel.parent.name : 'None'}\n**ID:** ${channel.id}`)
            .setColor(lightGreenHex)
            .setFooter({text: "/log toggle server_events Channel Create"})
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

exports.channelCreateEvent = channelCreateEvent;