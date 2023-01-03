const { MessageEmbed, WebhookClient } = require('discord.js');
const { connectDb } = require('../utils/db.js')
const client = require('../index.js').client

const db = connectDb()

// Colors
const mainHex = '#d79a61'
const lightRedHex = '#E75151'

const coll = db.collection('logSettings')

const guildBanAddEvent = async (ban) => {

    let doc = await coll.findOne({ guildId: ban.guild.id })

    if (doc) {
        if (doc.channels.server && doc.toggles.serverEvents.guildBanAdd) {

            const webhookClient = new WebhookClient({ url: doc.webhookUrls.server });

            // const auditLog = await ban.guild.fetchAuditLogs({
            //     limit: 1,
            //     type: AuditLogEvent.MemberBanAdd,
            // });

            const embed = new MessageEmbed()
            .setTitle('Member Banned')
            .setDescription(`**Member:** ${ban.user.tag}\n**Reason:** ${ban.reason}\n\n**ID:** ${ban.user.id}`)
            .setFooter({text: "/log toggle server_events Member Ban"})
            .setColor(lightRedHex)
            .setTimestamp()

            // if (auditLog) {
            //     const { executor, target } = auditLog;

            //     if (target.id === ban.user.id) {
            //         embed.addField('Banned By', `<@${executor.id}> (${executor.tag})`)
            //     } 
            // }

            webhookClient.send({
                avatarURL: client.user.avatarURL(),
                embeds: [embed]
            })

            webhookClient.destroy()
        }
    }

}

exports.guildBanAddEvent = guildBanAddEvent;