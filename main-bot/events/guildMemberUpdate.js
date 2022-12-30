const { MessageEmbed, WebhookClient } = require('discord.js');
const { connectDb } = require('../utils/db.js')
const client = require('../index.js').client

const db = connectDb()

// Colors
const mainHex = '#d79a61'

const coll = db.collection('logSettings')

const guildMemberUpdateEvent = async (oldMember, newMember) => {

    let doc = await coll.findOne({ guildId: oldMember.guild.id })

    if (doc) {
        if (doc.channels.member && doc.toggles.memberEvents.guildMemberUpdate) {

            const webhookClient = new WebhookClient({ url: doc.webhookUrls.member });

            const newNickname = newMember.nickname !== oldMember.nickname
            const newRoles = newMember.roles.cache.size !== oldMember.roles.cache.size
            const newBoost = newMember.premiumSince !== oldMember.premiumSince
            const newDisplayName = newMember.displayName !== oldMember.displayName
            const newAvatar = newMember.user.avatar !== oldMember.user.avatar

            const oldRolesList = oldMember.roles.cache.map(role => role.toString()).join(' ')
            const newRolesList = newMember.roles.cache.map(role => role.toString()).join(', ')

            const embed = new MessageEmbed()
            .setTitle('Member Updated')
            if (newNickname) embed.addField('Nickname', `**Old:** ${oldMember.nickname}\n**New:** ${newMember.nickname}`)
            if (newRoles) embed.addField('Roles', `**Old:** ${oldRolesList}\n**New:** ${newRolesList}`)
            if (newBoost) embed.addField('Boost', `**Old:** ${oldMember.premiumSince}\n**New:** ${newMember.premiumSince}`)
            if (newDisplayName) embed.addField('Display Name', `**Old:** ${oldMember.displayName}\n**New:** ${newMember.displayName}`)
            if (newAvatar) embed.addField('Avatar', `**Old:** ${oldMember.user.avatar}\n**New:** ${newMember.user.avatar}`)
            .setFooter({text: "/log toggle server_events Member Update"})
            .setColor('#4CA99D')
            .setTimestamp()

            webhookClient.send({
                avatarURL: client.user.avatarURL(),
                embeds: [embed]
            })

            webhookClient.destroy()
        }
    }

}

exports.guildMemberUpdateEvent = guildMemberUpdateEvent;