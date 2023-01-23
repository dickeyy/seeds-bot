const { cmdRun } = require('../../functions/cmdRun.js')
const { MessageEmbed, Permissions } = require('discord.js');
const { log } = require('../../functions/log.js');
const client = require('../../index.js').client

const mainHex = '#d79a61'


exports.unlockCmd = async function unlockCmd(user,guild,interaction,channel) {
    const cmdName = 'unlock'

    if (!channel) {
        channel = interaction.channel
    }

    // set the channel permission for everyone to send messages to neutral
    channel.permissionOverwrites.edit(guild.roles.everyone, {
        SEND_MESSAGES: null
    })

    // send a message to the channel
    const embed = new MessageEmbed()
    .setTitle('🔓 Channel Unlocked')
    .setDescription(`Everyone can now send messages in this channel.`)
    .setColor(mainHex)
    .setTimestamp()

    const embed2 = new MessageEmbed()
    .setTitle('Success')
    .setDescription(`<#${channel.id}> unlocked.`)
    .setColor('GREEN')

    channel.send({ embeds: [embed] })

    interaction.reply({
        embeds: [embed2],
        ephemeral: true
    })

    cmdRun(user,cmdName,guild,interaction)
}