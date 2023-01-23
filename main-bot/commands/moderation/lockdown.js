const { cmdRun } = require('../../functions/cmdRun.js')
const { MessageEmbed, Permissions } = require('discord.js');
const { log } = require('../../functions/log.js');
const client = require('../../index.js').client

const mainHex = '#d79a61'


exports.lockdownCmd = async function lockdownCmd(user,guild,interaction,channel) {
    const cmdName = 'lockdown'

    if (!channel) {
        channel = interaction.channel
    }

    channel.permissionOverwrites.edit(guild.roles.everyone, {
        SEND_MESSAGES: false
    })

    // send a message to the channel
    const embed = new MessageEmbed()
    .setTitle('🔒 Channel Locked')
    .setDescription(`Please wait for a staff member to unlock this channel.`)
    .setColor(mainHex)
    .setTimestamp()

    const embed2 = new MessageEmbed()
    .setTitle('Success')
    .setDescription(`<#${channel.id}> locked.`)
    .setColor('GREEN')

    channel.send({ embeds: [embed] })

    interaction.reply({
        embeds: [embed2],
        ephemeral: true
    })

    cmdRun(user,cmdName,guild,interaction)
}