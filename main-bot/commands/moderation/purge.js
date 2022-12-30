const { cmdRun } = require('../../functions/cmdRun.js')
const { MessageEmbed, Permissions } = require('discord.js');
const { connectDb } = require('../../utils/db.js')
const client = require('../../index.js').client

const db = connectDb()

const mainHex = '#d79a61'

exports.purgeCmd = async function purgeCmd(user,guild,interaction,count) {
    const cmdName = 'purge'

    if (count > 100) {
        const embed = new MessageEmbed()
        .setTitle('Error')
        .setDescription('You can only purge up to 100 messages at a time.')
        .setColor('RED')

        return interaction.reply({ 
            embeds: [embed] ,
            ephemeral: true
        })
    }

    if (count < 1) {
        const embed = new MessageEmbed()
        .setTitle('Error')
        .setDescription('You must purge at least 1 message.')
        .setColor('RED')

        return interaction.reply({ 
            embeds: [embed] ,
            ephemeral: true
        })
    }

    await interaction.channel.bulkDelete(count + 1)

    const embed = new MessageEmbed()
    .setTitle(`Purged ${count} messages`)
    .setColor(mainHex)

    interaction.reply({ embeds: [embed] })

    cmdRun(user, cmdName)

}