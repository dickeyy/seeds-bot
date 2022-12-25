const { cmdRun } = require('../../functions/cmdRun.js')
const { MessageEmbed } = require('discord.js');
const { connectDb } = require('../../utils/db.js')
const client = require('../../index.js').client

const db = connectDb()

const mainHex = '#d79a61'

exports.reportCmd = async function reportCmd(user, guild, interaction, member, reason) {
    const cmdName = 'report'

    // Verify that the guild has setup a report channel
    const coll = db.collection('reportChannels')
    const reportChannelDoc = await coll.findOne({
        guildId: guild.id
    })

    if (!reportChannelDoc) {
        const embed = new MessageEmbed()
        .setTitle('Report Channel Not Set')
        .setDescription('The report channel has not been set. Please contact an administrator.')
        .setColor('RED')

        interaction.reply({
            embeds: [embed],
            ephemeral: true
        })
        return
    }

    // See if the user included a member
    if (member) {
            
            // Verify that the member is in the guild
            if (!guild.members.cache.has(member.id)) {
                const embed = new MessageEmbed()
                .setTitle('Invalid Member')
                .setDescription('That member is not in this guild.')
                .setColor('RED')
    
                interaction.reply({
                    embeds: [embed],
                    ephemeral: true
                })
                return
            }
    
            // Verify that the member is not the user
            if (member.id === user.id) {
                const embed = new MessageEmbed()
                .setTitle('Invalid Member')
                .setDescription('You cannot report yourself.')
                .setColor('RED')
    
                interaction.reply({
                    embeds: [embed],
                    ephemeral: true
                })
                return
            }

            // Send a report embed to the report channel
            // generate a random 5 digit number for the report id
            const reportId = Math.floor(10000 + Math.random() * 90000)

            // get the message link for the report
            const messageLink = `https://discord.com/channels/${guild.id}/${interaction.channel.id}/${interaction.id}`

            const embed = new MessageEmbed()
            .setTitle('Report - ID: ' + reportId)
            .setDescription(`**Reported User:** ${member}\n**Reported By:** ${user}\n**Reason:** ${reason}\n\n**Context:** [Click Here](${messageLink})`)
            .setColor(mainHex)

            const reportChannel = await client.channels.fetch(reportChannelDoc.channelId)
            const reportMsg = await reportChannel.send({ embeds: [embed] })

            // Add the report id to the db
            const coll = db.collection('reports')
            await coll.insertOne({
                guildId: guild.id,
                reportId: reportId,
                reportedId: member.id,
                reportedBy: user.id,
                reason: reason,
                messageId: reportMsg.id
            })

            const embed2 = new MessageEmbed()
            .setTitle('Report Sent')
            .setDescription(`Your report has been sent to the moderators. The report ID is ${reportId}.`)
            .setColor('GREEN')

            interaction.reply({
                embeds: [embed2],
                ephemeral: true
            })
    } else {

        // Send a report embed to the report channel
        // generate a random 5 digit number for the report id
        const reportId = Math.floor(10000 + Math.random() * 90000)

        // get the message link for the report
        const messageLink = `https://discord.com/channels/${guild.id}/${interaction.channel.id}/${interaction.id}`

        const embed = new MessageEmbed()
        .setTitle('Report - ID: ' + reportId)
        .setDescription(`**Report By:** ${user}\n**Reason:** ${reason}\n\n**Context:** [Click Here](${messageLink})`)
        .setColor(mainHex)

        const reportChannel = await client.channels.fetch(reportChannelDoc.channelId)
        const reportMsg = await reportChannel.send({ embeds: [embed] })

        // Add the report id to the db
        const coll = db.collection('reports')
        await coll.insertOne({
            guildId: guild.id,
            reportId: reportId,
            reportBy: user.id,
            reason: reason,
            messageId: reportMsg.id
        })

        const embed2 = new MessageEmbed()
        .setTitle('Report Sent')
        .setDescription(`Your report has been sent to the moderators. The report ID is ${reportId}.`)
        .setColor('GREEN')

        interaction.reply({
            embeds: [embed2],
            ephemeral: true
        })

    }

    cmdRun(user, cmdName)

}