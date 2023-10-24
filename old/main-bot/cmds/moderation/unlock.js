const { cmdRun } = require('../../functions/cmdRun.js')
const { EmbedBuilder } = require('discord.js');

const mainHex = '#d79a61'

exports.unlockCmd = async function unlockCmd(user,guild,interaction,channel) {
    const cmdName = 'unlock'

    if (!channel) {
        channel = interaction.channel
    }

    // set the channel permission for everyone to send messages to neutral
    channel.permissionOverwrites.edit(guild.roles.everyone, {
        SendMessages: null
    })

    // send a message to the channel
    const embed = new EmbedBuilder()
    .setTitle('🔓 Channel Unlocked')
    .setDescription(`Everyone can now send messages in this channel.`)
    .setColor(mainHex)
    .setTimestamp()

    const embed2 = new EmbedBuilder()
    .setTitle('Success')
    .setDescription(`<#${channel.id}> unlocked.`)
    .setColor('Green')

    channel.send({ embeds: [embed] })

    interaction.reply({
        embeds: [embed2],
        ephemeral: true
    })

    cmdRun(user,cmdName,guild,interaction)
}