const { connectDb } = require('../utils/db.js');
const { log } = require('../functions/log.js');
const { MessageEmbed, WebhookClient } = require('discord.js');
const client = require('../index.js').client

const db = connectDb()

// Colors
const mainHex = '#d79a61'

const coll = db.collection('logSettings')

const guildMemberAddEvent = async (member) => {
    const collection = db.collection('guilds');
    const guild = await collection.findOne({ _id: member.guild.id })
    const memCout = Number(guild.memberCount) + 1
    await collection.updateOne({ _id: member.guild.id }, { $set: { memberCount: memCout } })

    let doc = await coll.findOne({ guildId: member.guild.id })

    let sent = false

    if (doc) {
        if (doc.channels.member && doc.toggles.memberEvents.guildMemberAdd) {

            const webhookClient = new WebhookClient({ url: doc.webhookUrls.member });

            let accountAgeMessage = ''
            let accountAge = Date.now() - member.user.createdAt

            let accountAgeYears = accountAge / 31536000000

            // round the years
            accountAgeYears = Math.round(accountAgeYears)
            // remove the years from the account age
            accountAge = accountAge - (accountAgeYears * 31536000000)
            
            // get the months
            let accountAgeMonths = accountAge / 2592000000
            // round the months
            accountAgeMonths = Math.round(accountAgeMonths)
            // remove the months from the account age
            accountAge = accountAge - (accountAgeMonths * 2592000000)

            // get the days
            let accountAgeDays = accountAge / 86400000
            // round the days
            accountAgeDays = Math.round(accountAgeDays)
            // remove the days from the account age
            accountAge = accountAge - (accountAgeDays * 86400000)

            // get the hours
            let accountAgeHours = accountAge / 3600000
            // round the hours
            accountAgeHours = Math.round(accountAgeHours)
            // remove the hours from the account age
            accountAge = accountAge - (accountAgeHours * 3600000)

            // get the minutes
            let accountAgeMinutes = accountAge / 60000
            // round the minutes
            accountAgeMinutes = Math.round(accountAgeMinutes)
            // remove the minutes from the account age
            accountAge = accountAge - (accountAgeMinutes * 60000)

            // get the seconds
            let accountAgeSeconds = accountAge / 1000
            // round the seconds
            accountAgeSeconds = Math.round(accountAgeSeconds)

            // round the seconds
            accountAgeSeconds = Math.round(accountAgeSeconds)
            
            let ageInWords = `**${accountAgeYears}** years, **${accountAgeMonths}** months, **${accountAgeDays}** days, **${accountAgeHours}** hours, **${accountAgeMinutes}** minutes, **${accountAgeSeconds}** seconds`
        

            if (accountAge > 86400000) {
                accountAgeMessage = `🚨 **NEW ACCOUNT** created ${ageInWords} ago`
            } else {
                accountAgeMessage = `**Account Created:** ${ageInWords} ago`
            }

            const embed = new MessageEmbed()
            .setTitle('Member Joined')
            .setAuthor({ name: member.user.tag, iconURL: member.user.avatarURL() })
            .setDescription(`<@${member.user.id}> - Member #${Number(member.guild.memberCount).toLocaleString()}\n${accountAgeMessage}\n\n**ID:** ${member.user.id}`)
            .setFooter({text: "/log toggle member_events Member Join"})
            .setColor('FUCHSIA')
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

exports.guildMemberAddEvent = guildMemberAddEvent;