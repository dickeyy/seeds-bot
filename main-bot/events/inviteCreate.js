const { EmbedBuilder, WebhookClient } = require('discord.js');
const { log } = require('../functions/log.js');
const { connectDb } = require('../utils/db.js')
const client = require('../index.js').client

const db = connectDb()


// Colors
const mainHex = '#d79a61'
const lightRedHex = '#E75151'

const coll = db.collection('logSettings')

const inviteCreateEvent = async (invite) => {

    let doc = await coll.findOne({ guildId: invite.guild.id })

    let sent = false

    if (doc) {
        if (doc.channels.server && doc.toggles.serverEvents.inviteCreate) {

            const webhookClient = new WebhookClient({ url: doc.webhookUrls.server });

            const embed = new EmbedBuilder()
            .setTitle('Invite Created')
            .setThumbnail('https://cdn.discordapp.com/emojis/1065111574471254118.webp')
            .setDescription(`**Created By:** ${invite.inviter}\n**Invite Code:** ${invite.code}\n**Channel:** ${invite.channel}\n**Temporary:** ${invite.temporary}\n**Max Uses:** ${invite.maxUses}\n**Max Age:** ${invite.maxAge} seconds`) 
            .setFooter({text: "/log toggle server_events Invite Create"})
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

exports.inviteCreateEvent = inviteCreateEvent;