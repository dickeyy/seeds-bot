const { cmdRun } = require('../../functions/cmdRun.js')
const { EmbedBuilder } = require('discord.js');
const dotenv = require('dotenv');
const axios = require('axios');
const jimp = require('jimp');
const fs = require('fs');
const { log } = require('../../functions/log.js');

dotenv.config();

const mainHex = '#d79a61'

exports.lovetestCmd = async function lovetestCmd(user,guild,interaction,member) {
    const cmdName = 'lovetest'

    const embed2 = new EmbedBuilder()
    .setTitle('Testing Love...')

    interaction.reply({
        embeds: [embed2],
    })
    const data = await axios({
        method: 'get',
        url: 'https://love-calculator.p.rapidapi.com/getPercentage',
        headers: {
            'x-rapidapi-key': process.env.RAPID_API_KEY,
            'x-rapidapi-host': 'love-calculator.p.rapidapi.com'
        },
        params: {
            fname: user.username,
            sname: member.username
        },
        responseType: 'json'
    })
    const res = data['data']
    const percentage = res['percentage']
    const result = res['result']

    const emptySpace = ':black_large_square:'
    const filledSpace = ':white_large_square:'

    // the length of the bar is 11
    const bar = filledSpace.repeat(Math.floor(percentage/10)) + emptySpace.repeat(11 - Math.floor(percentage/10))

    let loveEmoji = ''
    if (percentage >= 80) {
        loveEmoji = ':heart_eyes:'
    } else if (percentage >= 60) {
        loveEmoji = ':heart:'
    } else if (percentage >= 40) {
        loveEmoji = ':yellow_heart:'
    } else if (percentage >= 20) {
        loveEmoji = ':orange_heart:'
    } else {
        loveEmoji = ':broken_heart:'
    }

    // Create an image using jimp that combines the two profile pictures and send it as an attachment
    // the image is local to the bot so we need to use a local path
    const image = await jimp.read('./images/lovetest/lovetest-base.png')
    image.resize(292,128)

    const userAvatar = await jimp.read(user.displayAvatarURL({ extension: 'png', size: 512 }))
    const memberAvatar = await jimp.read(member.displayAvatarURL({ extension: 'png', size: 512 }))

    userAvatar.resize(128,128)
    memberAvatar.resize(128,128)

    userAvatar.circle()
    memberAvatar.circle()

    userAvatar.opacity(0.8)
    memberAvatar.opacity(0.8)

    // Add the two profile pictures to the image in the center of the image
    image.composite(userAvatar, 0, 0)
    image.composite(memberAvatar, 164, 0)

    if (percentage >= 50) {
        const heart = await jimp.read('./images/lovetest/lovetest-full.png')
        heart.resize(75,75)
        // place the heart in the center of the image
        image.composite(heart, 108, 26)
    } else {
        const brokenHeart = await jimp.read('./images/lovetest/lovetest-broken.png')
        brokenHeart.resize(75,75)
        // place the heart in the center of the image
        image.composite(brokenHeart, 108, 26)
    }

    image.write(`./images/lovetest/lovetest-${user.id}.png`)

    const embed = new EmbedBuilder()
    .setTitle(`${loveEmoji} Love Test ${loveEmoji} - ${result}`)
    .setDescription(`${bar} - ${percentage}%\n\n**${user.tag}** and **${member.tag}**`)
    .setImage(`attachment://lovetest-${user.id}.png`)
    .setColor('LuminousVividPink')

    setTimeout(() => {
        interaction.editReply({
            embeds: [embed],
            files: [{
                attachment: `./images/lovetest/lovetest-${user.id}.png`,
                name: `lovetest-${user.id}.png`
            }]
        })
    }, 500)

    // remove the image from the bot
    setTimeout(() => {
        fs.unlink(`./images/lovetest/lovetest-${user.id}.png`, (err) => {
            if (err) {
                console.error(err)
                return
            }
        })
    }, 1000)

    cmdRun(user,cmdName,guild,interaction)
}