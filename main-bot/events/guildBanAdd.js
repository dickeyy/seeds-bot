const { EmbedBuilder, WebhookClient, AuditLogEvent } = require('discord.js');
const { client, db } = require('../index.js')


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

            const fetchedLogs = await ban.guild.fetchAuditLogs({
                limit: 1,
                type: AuditLogEvent.MemberBanAdd,
            });

            const foundLog = fetchedLogs.entries.first();

            let banReason = 'No reason provided'
            let moderator = ''

            if (foundLog) {
                const { executor, target, reason } = foundLog;

                if (target.id === ban.user.id) {
                    moderator = executor.tag
                } 

                if (reason) {
                    banReason = reason
                }
            }

            const embed = new EmbedBuilder()
            .setTitle('Member Banned')
            .setThumbnail('https://cdn.discordapp.com/emojis/1064442673806704672.webp')
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