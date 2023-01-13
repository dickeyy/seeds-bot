const { MessageEmbed, WebhookClient, GuildAuditLogs } = require('discord.js');
const { connectDb } = require('../utils/db.js')
const client = require('../index.js').client

const db = connectDb()

// Colors
const mainHex = '#d79a61'
const lightRedHex = '#E75151'

const coll = db.collection('logSettings')

const guildBanAddEvent = async (ban) => {

    let doc = await coll.findOne({ guildId: ban.guild.id })

    let sent = false

    if (doc) {
        if (doc.channels.server && doc.toggles.serverEvents.guildBanAdd) {

            const webhookClient = new WebhookClient({ url: doc.webhookUrls.server });

            const auditLog = await ban.guild.fetchAuditLogs({ 
                type: GuildAuditLogs.Actions.MEMBER_BAN_ADD 
            }).then(audit => audit.entries.first())

            let banReason = 'No reason provided'
            let moderator = ''

            if (auditLog) {
                const { executor, target, reason } = auditLog;

                if (target.id === ban.user.id) {
                    moderator = executor.tag
                } 

                if (reason) {
                    banReason = reason
                }
            }

            const embed = new MessageEmbed()
            .setTitle('Member Banned')
            .setDescription(`**Member:** ${ban.user.tag}\n**Reason:** ${banReason}\n**Moderator:** ${moderator}\n\n**ID:** ${ban.user.id}`)
            .setFooter({text: "/log toggle server_events Member Ban"})
            .setColor(lightRedHex)
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

exports.guildBanAddEvent = guildBanAddEvent;