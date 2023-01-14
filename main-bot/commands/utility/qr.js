const { cmdRun } = require('../../functions/cmdRun.js')
const { MessageEmbed } = require('discord.js');

const mainHex = '#d79a61'

exports.qrCmd = async function qrCmd(user,guild,interaction,url) {
    const cmdName = 'qr'

    // check that the URL is a valid URL
    if (!url.match(/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/)) {
        const embed2 = new MessageEmbed()
        .setTitle('Invalid URL')
        .setDescription('Please provide a valid URL.')
        .setColor('RED')

        interaction.reply({
            embeds: [embed2],
            ephemeral: true
        })
        return
    }

    const embed = new MessageEmbed()
    .setTitle('QR Code')
    .setDescription(`[Original URL](${url})`)
    .setAuthor({name: user.tag, iconURL: user.avatarURL()})
    .setImage(`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${url}`)
    .setColor(mainHex)

    interaction.reply({
        embeds: [embed]
    })

    cmdRun(user,cmdName)
}