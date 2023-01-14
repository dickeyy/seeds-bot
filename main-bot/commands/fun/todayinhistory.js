const { cmdRun } = require('../../functions/cmdRun.js')
const { MessageEmbed } = require('discord.js');
const dotenv = require('dotenv');
const axios = require('axios');

dotenv.config();

const mainHex = '#d79a61'

exports.todayinhistoryCmd = async function todayinhistoryCmd(user,guild,interaction,member) {
    const cmdName = 'todayinhistory'

    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0');

    today = mm + '/' + dd;

    const data = await axios({
        method: 'get',
        url: `https://numbersapi.p.rapidapi.com/${today}/date`,
        headers: {
            'x-rapidapi-key': process.env.RAPID_API_KEY,
            'x-rapidapi-host': 'numbersapi.p.rapidapi.com'
        },
        params: {
            fragment: 'false',
            json: 'true'
        },
        responseType: 'json'
    })

    const res = data['data']
    const text = res['text']
    const year = res['year']
    const found = res['found']

    if (!found) {
        const embed = new MessageEmbed()
        .setTitle('Today in History')
        .setDescription('Nothing happened today!')
        .setColor(mainHex)

        interaction.reply({
            embeds: [embed],
        })
    } else {
        const embed = new MessageEmbed()
        .setTitle(`Today in History`)
        .setDescription(`In **${year}**, ${text}`)
        .setFooter({text: user.tag, iconURL: user.avatarURL()})
        .setTimestamp()
        .setColor(mainHex)

        interaction.reply({
            embeds: [embed],
        })
    }

    cmdRun(user,cmdName)
}