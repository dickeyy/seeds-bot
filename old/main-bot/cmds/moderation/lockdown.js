const { cmdRun } = require('../../functions/cmdRun.js')
const { EmbedBuilder } = require('discord.js');

const mainHex = '#d79a61'

exports.lockdownCmd = async function lockdownCmd(user,guild,interaction,channel,server) {
    const cmdName = 'lockdown'

    // if no channel is provided and server is false, set the channel to the interaction channel
    if (!channel && server == false) {
        channel = interaction.channel
    }

    if (server == false) {
        channel.permissionOverwrites.edit(guild.roles.everyone, {
            SendMessages: false
        })

        // send a message to the channel
        const embed = new EmbedBuilder()
        .setTitle('🔒 Channel Locked')
        .setDescription(`Please wait for a staff member to unlock this channel.`)
        .setColor(mainHex)
        .setTimestamp()

        const embed2 = new EmbedBuilder()
        .setTitle('Success')
        .setDescription(`<#${channel.id}> locked.`)
        .setColor('Green')

        channel.send({ embeds: [embed] })

        interaction.reply({
            embeds: [embed2],
            ephemeral: true
        })
    } else {
        // loop through all channels in the server
        guild.channels.cache.forEach(channel => {

            channel.permissionOverwrites.edit(guild.roles.everyone, {
                SendMessages: false
            })

            // send a message to the channel
            const embed = new EmbedBuilder()
            .setTitle('🔒 Server Locked')
            .setDescription(`Please wait for a staff member to unlock the server.`)
            .setColor(mainHex)
            .setTimestamp()

            // check if the channel is a text channel
            if (channel.type == 11 || channel.type == 0) {
                channel.send({ embeds: [embed] })
            }
            
        })
        

        const embed2 = new EmbedBuilder()
        .setTitle('Success')
        .setDescription(`Server locked.`)
        .setColor('Green')

        interaction.reply({
            embeds: [embed2],
            ephemeral: true
        })
    }

    cmdRun(user,cmdName,guild,interaction)
}