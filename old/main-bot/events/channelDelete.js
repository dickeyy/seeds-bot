const { EmbedBuilder, WebhookClient } = require('discord.js');
const { client, db } = require('../index.js')


// Colors
const mainHex = '#d79a61'
const lightRedHex = '#E75151'

const coll = db.collection('logSettings')

const channelDeleteEvent = async (channel) => {

    let doc = await coll.findOne({ guildId: channel.guild.id })

    let sent = false

    if (doc) {
        if (doc.channels.server && doc.toggles.serverEvents.channelDelete) {

            const webhookClient = new WebhookClient({ url: doc.webhookUrls.server });

            const embed = new EmbedBuilder()
            .setTitle('Channel Deleted')
            .setThumbnail('https://cdn.discordapp.com/emojis/1076747509529071696.webp')
            .setDescription(`**Channel:** ${channel.name}\n**Type:** ${channel.type}\n**Category:** ${channel.parent ? channel.parent.name : 'None'}\n**ID:** ${channel.id}`)
            .setColor(lightRedHex)
            .setFooter({text: "/log toggle server_events Channel Delete"})
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

exports.channelDeleteEvent = channelDeleteEvent;