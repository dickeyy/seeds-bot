const { cmdRun } = require('../../../functions/cmdRun.js')
const { EmbedBuilder } = require('discord.js');

const mainHex = '#d79a61'

exports.purgeBotCmd = async function purgeBotCmd(user,guild,interaction,count) {

    const cmdName = 'purge-bot'

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

    const messages = await interaction.channel.messages.fetch({ limit: 100 })

    const filteredMessages1 = messages.filter(m => m.author.bot == true)
    const filteredMessages = Array.from(filteredMessages1.values()).slice(0, count)

    await interaction.channel.bulkDelete(filteredMessages)

    const embed = new EmbedBuilder()
    .setColor(mainHex)
    .setTimestamp()

    if (filteredMessages.length == 1) {
        embed.setTitle('Purge Bot Messages')
        embed.setDescription(`Purged \`${filteredMessages.length}\` message from bots in <#${interaction.channel.id}>.`)
    }
    else {
        embed.setTitle('Purge Bot')
        embed.setDescription(`Purged \`${filteredMessages.length}\` messages from bots in <#${interaction.channel.id}>.`)
    }

    interaction.reply({ embeds: [embed] })

    cmdRun(user,cmdName,guild,interaction)

}