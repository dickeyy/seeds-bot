const { cmdRun } = require('../../functions/cmdRun.js')
const { EmbedBuilder, PermissionsBitField } = require('discord.js');
const { log } = require('../../functions/log.js');
const client = require('../../index.js').client

const mainHex = '#d79a61'


exports.lockdownCmd = async function lockdownCmd(user,guild,interaction,channel) {
    const cmdName = 'lockdown'

    if (!channel) {
        channel = interaction.channel
    }

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

    cmdRun(user,cmdName,guild,interaction)
}