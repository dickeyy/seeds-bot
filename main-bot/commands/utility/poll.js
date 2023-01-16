const { cmdRun } = require('../../functions/cmdRun.js')
const { MessageEmbed } = require('discord.js');

const mainHex = '#d79a61'

exports.pollCmd = async function pollCmd(user,guild,interaction,option1,option2) {
    const cmdName = 'poll'

    const embed = new MessageEmbed()
        .setTitle(`Poll:`)
        .setDescription(`1️⃣: ${option1}\n\n2️⃣: ${option2}`)


    const message = await interaction.reply({
        embeds: [embed],
        fetchReply: true
    })

    message.react('1️⃣')
    message.react('2️⃣')

    cmdRun(user,cmdName,guild,interaction)
}