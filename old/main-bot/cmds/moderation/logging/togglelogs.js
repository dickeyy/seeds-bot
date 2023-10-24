const { cmdRun } = require('../../../functions/cmdRun.js')
const { EmbedBuilder } = require('discord.js');
const { db } = require('../../../index.js')

const mainHex = '#d79a61'

exports.toggleLogsCmd = async function toggleLogsCmd(user,guild,interaction,serverEvents,memberEvents,messageEvents) {
    const cmdName = 'togglelogs'

    if (serverEvents == null && memberEvents == null && messageEvents == null) {
        const embed = new EmbedBuilder()
        .setTitle('Error')
        .setDescription('Please specify at least one event type to toggle.')
        .setColor('Red')
        
        interaction.reply({
            embeds: [embed],
            ephemeral: true
        })
        return
    }

    const coll = db.collection('logSettings')

    const logSettings = await coll.findOne({ guildId: guild.id })

    if (!logSettings) {
        const embed = new EmbedBuilder()
        .setTitle('Error')
        .setDescription('No log channels have been set up. Please set up log channels before using this command.')
        .setColor('Red')

        interaction.reply({
            embeds: [embed],
            ephemeral: true
        })
        return
    }

    if (logSettings.channels.server == undefined && serverEvents != null) {
        const embed = new EmbedBuilder()
        .setTitle('Error')
        .setDescription('No server event log channel has been set up. Please set up a server event log channel before using this command.')
        .setColor('Red')

        interaction.reply({
            embeds: [embed],
            ephemeral: true
        })
        return
    }

    if (logSettings.channels.member == undefined && memberEvents != null) {
        const embed = new EmbedBuilder()
        .setTitle('Error')
        .setDescription('No member event log channel has been set up. Please set up a member event log channel before using this command.')
        .setColor('Red')

        interaction.reply({
            embeds: [embed],
            ephemeral: true
        })
        return
    }

    if (logSettings.channels.message == undefined && messageEvents != null) {
        const embed = new EmbedBuilder()
        .setTitle('Error')
        .setDescription('No message event log channel has been set up. Please set up a message event log channel before using this command.')
        .setColor('Red')

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

    const embed = new EmbedBuilder()
    .setTitle(`Success`)
    .setDescription(`Toggled ${serverEvents || memberEvents || messageEvents} event logging`)
    .setColor(mainHex)

    interaction.reply({
        embeds: [embed]
    })

    cmdRun(user,guild,cmdName,guild,interaction)

}