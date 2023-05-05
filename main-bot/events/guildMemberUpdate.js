const { EmbedBuilder, WebhookClient } = require('discord.js');
const { client, db } = require('../index.js')

// Colors
const mainHex = '#d79a61'

const coll = db.collection('logSettings')

const guildMemberUpdateEvent = async (oldMember, newMember) => {

    let doc = await coll.findOne({ guildId: oldMember.guild.id })

    let sent = false

    if (doc) {
        if (doc.channels.member && doc.toggles.memberEvents.guildMemberUpdate) {

            const webhookClient = new WebhookClient({ url: doc.webhookUrls.member });

            const newNickname = newMember.nickname !== oldMember.nickname
            const newRoles = newMember.roles.cache.size !== oldMember.roles.cache.size
            const newAvatar = newMember.user.avatar !== oldMember.user.avatar

            const oldRolesList = oldMember.roles.cache.map(role => role.toString()).join(' ')
            const newRolesList = newMember.roles.cache.map(role => role.toString()).join(', ')
            // remove @everyone from roles


            const embed = new EmbedBuilder()
            .setTitle('Member Updated')
            .setThumbnail('https://cdn.discordapp.com/emojis/1064444245588578385.webp')
            .setAuthor({ name: newMember.user.tag, iconURL: newMember.user.avatarURL() })
            .setFooter({text: "/log toggle server_events Member Update"})
            .setColor('#4CA99D')
            .setTimestamp()

            if (newNickname) embed.addFields({name:'Nickname', value:`**Old:** ${oldMember.nickname}\n**New:** ${newMember.nickname}`})
            if (newRoles) embed.addFields({name:'Roles', value:`**Old:** ${oldRolesList}\n**New:** ${newRolesList}`})
            if (newAvatar) embed.addFields({name:'Avatar', value:`**Old:** ${oldMember.user.avatar}\n**New:** ${newMember.user.avatar}`})

            if (!newNickname && !newRoles && !newAvatar) return

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

exports.guildMemberUpdateEvent = guildMemberUpdateEvent;