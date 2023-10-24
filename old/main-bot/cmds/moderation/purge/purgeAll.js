const { cmdRun } = require('../../../functions/cmdRun.js')
const { EmbedBuilder } = require('discord.js');

const mainHex = '#d79a61'

exports.purgeAllCmd = async function purgeAllCmd(user,guild,interaction,count) {
    const cmdName = 'purge-all'

    if (count > 100) {
        const embed = new EmbedBuilder()
        .setTitle('Error')
        .setDescription('You can only purge up to 100 messages at a time.')
        .setColor('Red')

        return interaction.reply({ 
            embeds: [embed] ,
            ephemeral: true
        })
    }

    if (count < 1) {
        const embed = new EmbedBuilder()
        .setTitle('Error')
        .setDescription('You must purge at least 1 message.')
        .setColor('Red')

        return interaction.reply({ 
            embeds: [embed] ,
            ephemeral: true
        })
    }

    await interaction.channel.bulkDelete(count)

    const embed = new EmbedBuilder()
    .setColor(mainHex)
    .setTimestamp()

    if (count == 1) {
        embed.setTitle('Purge All Messages')
        embed.setDescription(`Purged \`${count}\` message in <#${interaction.channel.id}>.`)
    } else {
        embed.setTitle('Purge All')
        embed.setDescription(`Purged \`${count}\` messages in <#${interaction.channel.id}>.`)
    }

    interaction.reply({ embeds: [embed] })

    cmdRun(user, cmdName,guild,interaction)

}