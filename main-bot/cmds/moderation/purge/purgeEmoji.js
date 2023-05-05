const { cmdRun } = require('../../../functions/cmdRun.js')
const { EmbedBuilder } = require('discord.js');

const mainHex = '#d79a61'

exports.purgeEmojiCmd = async function purgeEmojiCmd(user,guild,interaction,emoji,count) {

    const cmdName = 'purge-emoji'

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
    
    const filteredMessages1 = messages.filter(m => m.content.includes(emoji))
    const filteredMessages = Array.from(filteredMessages1.values()).slice(0, count)

    await interaction.channel.bulkDelete(filteredMessages)

    const embed = new EmbedBuilder()
    .setColor(mainHex)
    .setTimestamp()

    if (filteredMessages.length == 1) {
        embed.setTitle('Purge Emoji Messages')
        embed.setDescription(`Purged \`${filteredMessages.length}\` message in <#${interaction.channel.id}>.\n\n**Emoji:** ${emoji}`)
    } else {
        embed.setTitle('Purge Emoji Messages')
        embed.setDescription(`Purged \`${filteredMessages.length}\` messages in <#${interaction.channel.id}>.\n\n**Emoji:** ${emoji}`)
    }

    interaction.reply({ embeds: [embed] })

    cmdRun(user,cmdName,guild,interaction)

}