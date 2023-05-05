const { cmdRun } = require('../../../functions/cmdRun.js')
const { EmbedBuilder } = require('discord.js');

const mainHex = '#d79a61'

exports.purgeContainsCmd = async function purgeContainsCmd(user,guild,interaction,search,count) {

    const cmdName = 'purge-contains'

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
    
    const filteredMessages1 = messages.filter(m => m.content.toLowerCase().includes(search.toLowerCase()))
    const filteredMessages = Array.from(filteredMessages1.values()).slice(0, count)

    await interaction.channel.bulkDelete(filteredMessages)

    const embed = new EmbedBuilder()
    .setColor(mainHex)
    .setTimestamp()

    if (filteredMessages.length == 1) {
        embed.setTitle('Purge Contains Messages')
        embed.setDescription(`Purged \`${filteredMessages.length}\` message in <#${interaction.channel.id}>.\n\n**Search:** \`${search}\``)
    } else {
        embed.setTitle('Purge Contains Messages')
        embed.setDescription(`Purged \`${filteredMessages.length}\` messages in <#${interaction.channel.id}>.\n\n**Search:** \`${search}\``)
    }

    interaction.reply({ embeds: [embed] })

    cmdRun(user,cmdName,guild,interaction)

}