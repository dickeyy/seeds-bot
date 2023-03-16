const { EmbedBuilder, WebhookClient } = require('discord.js');
const { log } = require('../functions/log.js');
const { connectDb } = require('../utils/db.js')
const client = require('../index.js').client

const db = connectDb()

// Colors
const mainHex = '#d79a61'
const lightRedHex = '#E75151'

const coll = db.collection('logSettings')

const inviteDeleteEvent = async (invite) => {

    let doc = await coll.findOne({ guildId: invite.guild.id })

    let sent = false

    if (doc) {
        if (doc.channels.server && doc.toggles.serverEvents.inviteDelete) {

            const webhookClient = new WebhookClient({ url: doc.webhookUrls.server });

            const embed = new EmbedBuilder()
            .setTitle('Invite Deleted')
            .setThumbnail('https://cdn.discordapp.com/emojis/1065110916401729626.webp')
            .setDescription(`**Invite:** ${invite.code}`)
            .setFooter({text: "/log toggle server_events Invite Delete"})
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

exports.inviteDeleteEvent = inviteDeleteEvent;