const { cmdRun } = require('../../functions/cmdRun.js')
const { EmbedBuilder } = require('discord.js');
const axios = require('axios');

const mainHex = '#d79a61'

exports.rcolorCmd = async function rcolorCmd(user,guild,interaction) {
    const cmdName = 'rcolor'

    const r = Math.round(Math.random() * 256)
    const g = Math.round(Math.random() * 256)
    const b = Math.round(Math.random() * 256)
    const rgb = `(${r},${g},${b})`

    const data = await axios({
        method: 'get',
        url: `https://www.thecolorapi.com/id?rgb=rgb${rgb}`,
        responseType: 'json'
    })
    const res = data['data']
    const hexClean = res['hex']['clean']
    const hex = res['hex']['value']
    const name = res['name']['value']

    const embed = new EmbedBuilder()
    .setTitle(name)
    .setURL(`https://www.color-hex.com/color/${hexClean}`)
    .setDescription(hex)
    .setImage(`https://singlecolorimage.com/get/${hexClean}/125x125`)
    .setColor(hex)

    interaction.reply({
        embeds: [embed]
    })

    cmdRun(user,cmdName,guild,interaction)
}