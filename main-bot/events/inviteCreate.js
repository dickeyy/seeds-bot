const { MessageEmbed, WebhookClient } = require('discord.js');
const { connectDb } = require('../utils/db.js')
const client = require('../index.js').client

const db = connectDb()

// Colors
const mainHex = '#d79a61'
const lightRedHex = '#E75151'

const coll = db.collection('logSettings')

const inviteCreateEvent = async (invite) => {

    let doc = await coll.findOne({ guildId: invite.guild.id })

    if (doc) {
        if (doc.channels.server && doc.toggles.serverEvents.inviteCreate) {

            const webhookClient = new WebhookClient({ url: doc.webhookUrls.server });

            const embed = new MessageEmbed()
            .setTitle('Invite Created')
            .setDescription(`**Created By:** ${invite.inviter}\n\n**Invite Code:** ${invite.code}\n\n**Channel:** ${invite.channel}\n\n**Temporary:** ${invite.temporary}\n\n**Max Uses:** ${invite.maxUses}\n\n**Max Age:** ${invite.maxAge} seconds`) 
            .setFooter({text: "/log toggle server_events Invite Create"})
            .setColor()
            .setTimestamp()

            webhookClient.send({
                avatarURL: client.user.avatarURL(),
                embeds: [embed]
            })

            webhookClient.destroy()
        }
    }

}

exports.inviteCreateEvent = inviteCreateEvent;