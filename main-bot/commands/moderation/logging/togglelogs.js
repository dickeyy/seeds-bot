const { cmdRun } = require('../../../functions/cmdRun.js')
const { MessageEmbed } = require('discord.js');
const { connectDb } = require('../../../utils/db.js')
const client = require('../../../index.js').client

const db = connectDb()

const mainHex = '#d79a61'

exports.toggleLogsCmd = async function toggleLogsCmd(user,guild,interaction,serverEvents,memberEvents,messageEvents) {
    const cmdName = 'togglelogs'

    if (serverEvents == null && memberEvents == null && messageEvents == null) {
        const embed = new MessageEmbed()
        .setTitle('Error')
        .setDescription('Please specify at least one event type to toggle.')
        .setColor('RED')
        
        interaction.reply({
            embeds: [embed],
            ephemeral: true
        })
        return
    }

    const coll = db.collection('logSettings')

    const logSettings = await coll.findOne({ guildId: guild.id })

    if (!logSettings) {
        const embed = new MessageEmbed()
        .setTitle('Error')
        .setDescription('No log channels have been set up. Please set up log channels before using this command.')
        .setColor('RED')

        interaction.reply({
            embeds: [embed],
            ephemeral: true
        })
        return
    }

    if (logSettings.channels.server == undefined && serverEvents != null) {
        const embed = new MessageEmbed()
        .setTitle('Error')
        .setDescription('No server event log channel has been set up. Please set up a server event log channel before using this command.')
        .setColor('RED')

        interaction.reply({
            embeds: [embed],
            ephemeral: true
        })
        return
    }

    if (logSettings.channels.member == undefined && memberEvents != null) {
        const embed = new MessageEmbed()
        .setTitle('Error')
        .setDescription('No member event log channel has been set up. Please set up a member event log channel before using this command.')
        .setColor('RED')

        interaction.reply({
            embeds: [embed],
            ephemeral: true
        })
        return
    }

    if (logSettings.channels.message == undefined && messageEvents != null) {
        const embed = new MessageEmbed()
        .setTitle('Error')
        .setDescription('No message event log channel has been set up. Please set up a message event log channel before using this command.')
        .setColor('RED')

        interaction.reply({
            embeds: [embed],
            ephemeral: true
        })
        return
    }

    await coll.updateOne({
        guildId: guild.id
    }, {
        $set: {
            toggles: {
                ...logSettings.toggles,
                serverEvents: {
                    ...logSettings.toggles.serverEvents,
                    [serverEvents]: !logSettings.toggles.serverEvents[serverEvents]
                },
                memberEvents: {
                    ...logSettings.toggles.memberEvents,
                    [memberEvents]: !logSettings.toggles.memberEvents[memberEvents]
                },
                messageEvents: {
                    ...logSettings.toggles.messageEvents,
                    [messageEvents]: !logSettings.toggles.messageEvents[messageEvents]
                }
            }
        }
    })

    const embed = new MessageEmbed()
    .setTitle(`Success`)
    .setDescription(`Toggled ${serverEvents || memberEvents || messageEvents} event logging`)
    .setColor(mainHex)

    interaction.reply({
        embeds: [embed]
    })

    cmdRun(user,guild,cmdName,guild,interaction)

}