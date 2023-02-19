const { cmdRun } = require('../../functions/cmdRun.js')
const { EmbedBuilder, Permissions } = require('discord.js');
const { connectDb } = require('../../utils/db.js');
const { log } = require('../../functions/log.js');
const client = require('../../index.js').client

const db = connectDb()

const mainHex = '#d79a61'


exports.purgeCmd = async function purgeCmd(user,guild,interaction,count) {
    const cmdName = 'purge'

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
    .setTitle(`Purged ${count} messages`)
    .setColor(mainHex)

    interaction.reply({ embeds: [embed] })

    cmdRun(user, cmdName,guild,interaction)

}