const { EmbedBuilder, WebhookClient } = require('discord.js');
const { connectDb } = require('../utils/db.js')
const client = require('../index.js').client

const db = connectDb()

// Colors
const mainHex = '#d79a61'
const lightRedHex = '#E75151'

const coll = db.collection('logSettings')

const guildBanRemoveEvent = async (ban) => {

    let doc = await coll.findOne({ guildId: ban.guild.id })

    let sent = false

    if (doc) {
        if (doc.channels.server && doc.toggles.serverEvents.guildBanRemove) {

            const webhookClient = new WebhookClient({ url: doc.webhookUrls.server });

            // const auditLog = await ban.guild.fetchAuditLogs({
            //     limit: 1,
            //     type: AuditLogEvent.MemberBanAdd,
            // });

            const embed = new EmbedBuilder()
            .setTitle('Member Unbanned')
            .setThumbnail('https://cdn.discordapp.com/emojis/1064442704936828968.webp')
            .setDescription(`**Member:** ${ban.user.tag}\n\n**ID:** ${ban.user.id}`)
            .setFooter({text: "/log toggle server_events Member Unban"})
            .setColor('DarkButNotBlack')
            .setTimestamp()

            // if (auditLog) {
            //     const { executor, target } = auditLog;

            //     if (target.id === ban.user.id) {
            //         embed.addField('Unbanned By', `<@${executor.id}> (${executor.tag})`)
            //     } 
            // }

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

exports.guildBanRemoveEvent = guildBanRemoveEvent;