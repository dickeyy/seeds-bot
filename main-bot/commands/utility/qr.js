const { cmdRun } = require('../../functions/cmdRun.js')
const { MessageEmbed } = require('discord.js');

const mainHex = '#d79a61'

exports.qrCmd = async function qrCmd(user,guild,interaction,url) {
    const cmdName = 'qr'

    // check if url starts with https:// or http://
    if (!url.startsWith('https://') && !url.startsWith('http://')) {
        url = 'https://' + url
    }

    const embed = new MessageEmbed()
    .setTitle('QR Code')
    .setDescription(`[Original URL](${url})`)
    .setAuthor({name: user.tag, iconURL: user.avatarURL()})
    .setImage(`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${url}`)
    .setColor(mainHex)
    .setTimestamp()

    interaction.reply({
        embeds: [embed]
    })

    cmdRun(user,cmdName)
}