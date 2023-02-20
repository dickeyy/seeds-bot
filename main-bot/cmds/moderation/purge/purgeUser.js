const { cmdRun } = require('../../../functions/cmdRun.js')
const { EmbedBuilder, Permissions } = require('discord.js');
const { connectDb } = require('../../../utils/db.js');
const { log } = require('../../../functions/log.js');
const client = require('../../../index.js').client

const db = connectDb()

const mainHex = '#d79a61'

exports.purgeUserCmd = async function purgeUserCmd(user,guild,interaction,purgeUser,count) {

    const cmdName = 'purge-user'

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

    const filteredMessages1 = messages.filter(m => m.author.id == purgeUser.id)
    const filteredMessages = Array.from(filteredMessages1.values()).slice(0, count)

    await interaction.channel.bulkDelete(filteredMessages)

    const embed = new EmbedBuilder()
    .setColor(mainHex)
    .setTimestamp()

    if (filteredMessages.length == 1) {
        embed.setTitle('Purge User Messages')
        embed.setDescription(`Purged \`${filteredMessages.length}\` message from <@${purgeUser.id}> in <#${interaction.channel.id}>.`)
    } else {
        embed.setTitle('Purge User Messages')
        embed.setDescription(`Purged \`${filteredMessages.length}\` messages from <@${purgeUser.id}> in <#${interaction.channel.id}>.`)
    }

    interaction.reply({ embeds: [embed] })

    cmdRun(user,cmdName,guild,interaction)

}