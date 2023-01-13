const { connectDb } = require('../utils/db.js');
const { log } = require('../functions/log.js');
const { MessageEmbed, WebhookClient } = require('discord.js');
const client = require('../index.js').client

const db = connectDb()

// Colors
const mainHex = '#d79a61'

const coll = db.collection('logSettings')

const guildMemberRemoveEvent = async (member) => {

    const collection = db.collection('guilds');
    const guild = await collection.findOne({ _id: member.guild.id })
    const memCout = Number(guild.memberCount) - 1
    await collection.updateOne({ _id: member.guild.id }, { $set: { memberCount: memCout } })

    let doc = await coll.findOne({ guildId: member.guild.id })

    let sent = false

    if (doc) {
        if (doc.channels.member && doc.toggles.memberEvents.guildMemberRemove) {

            const webhookClient = new WebhookClient({ url: doc.webhookUrls.member });

            const roles = member.roles.cache.map(role => role.toString()).join(' ')
            // remove @everyone
            roles.replace('@everyone', '')

            let joinedAgeMessage = ''
            let joinedAge = Date.now() - member.joinedAt
            let joinedAgeYears = joinedAge / 31536000000

            // round the years
            joinedAgeYears = Math.round(joinedAgeYears)
            // remove the years from the account age
            joinedAge = joinedAge - (joinedAgeYears * 31536000000)

            // get the months
            let joinedAgeMonths = joinedAge / 2592000000
            // round the months
            joinedAgeMonths = Math.round(joinedAgeMonths)
            // remove the months from the account age
            joinedAge = joinedAge - (joinedAgeMonths * 2592000000)

            // get the days
            let joinedAgeDays = joinedAge / 86400000
            // round the days
            joinedAgeDays = Math.round(joinedAgeDays)
            // remove the days from the account age
            joinedAge = joinedAge - (joinedAgeDays * 86400000)

            // get the hours
            let joinedAgeHours = joinedAge / 3600000
            // round the hours
            joinedAgeHours = Math.round(joinedAgeHours)
            // remove the hours from the account age
            joinedAge = joinedAge - (joinedAgeHours * 3600000)

            // get the minutes
            let joinedAgeMinutes = joinedAge / 60000
            // round the minutes
            joinedAgeMinutes = Math.round(joinedAgeMinutes)
            // remove the minutes from the account age
            joinedAge = joinedAge - (joinedAgeMinutes * 60000)

            // get the seconds
            let joinedAgeSeconds = joinedAge / 1000
            // round the seconds
            joinedAgeSeconds = Math.round(joinedAgeSeconds)
            // remove the seconds from the account age
            joinedAge = joinedAge - (joinedAgeSeconds * 1000)

            joinedAgeMessage = `${joinedAgeYears} years, ${joinedAgeMonths} months, ${joinedAgeDays} days, ${joinedAgeHours} hours, ${joinedAgeMinutes} minutes, and ${joinedAgeSeconds} seconds`

            const embed = new MessageEmbed()
            .setTitle('Member Left')
            .setAuthor({ name: member.user.tag, iconURL: member.user.avatarURL() })
            .setDescription(`<@${member.user.id}> - Joined ${joinedAgeMessage} ago\n\n**ID:** ${member.user.id}`)

            .addField('Roles', roles || 'None')

            .setFooter({text: "/log toggle member_events Member Leave"})
            .setColor("BLURPLE")
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

exports.guildMemberRemoveEvent = guildMemberRemoveEvent;