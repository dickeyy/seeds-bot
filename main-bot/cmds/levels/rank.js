const { cmdRun } = require('../../functions/cmdRun.js')
const { EmbedBuilder } = require('discord.js');
const { db, client, redis } = require('../../index.js')
const jimp = require('jimp')
const fs = require('fs')
const { createCanvas, loadImage } = require('canvas');

const mainHex = '#d79a61'

exports.rankCmd = async function rankCmd(user,guild,interaction,rankUser) {
    const cmdName = 'rank'

    // get data
    let doc = await redis.hGet('guildXpData', guild.id)
    doc = JSON.parse(doc)

    // check if xp is setup / enabled
    if (!doc) {
        const embed = new EmbedBuilder()
        .setTitle('Error')
        .setDescription('Levels are not enabled in this server.')
        .setColor('Red')

        return interaction.reply({ embeds: [embed], ephemeral: true })
    }

    if (!doc.settings.enabled) {
        const embed = new EmbedBuilder()
        .setTitle('Error')
        .setDescription('Levels are not enabled in this server.')
        .setColor('Red')

        return interaction.reply({ embeds: [embed], ephemeral: true })
    }

    // server is setup so now we can get the user data
    // check if rankUser is defined if not then set it to the interaction user
    if (!rankUser) rankUser = user

    // prevent the intereaction from timing out
    const loadingEmbed = new EmbedBuilder()
    .setTitle('Loading...')

    interaction.reply({ embeds: [loadingEmbed] })

    // check if user is in db
    if (!doc.users[rankUser.id]) {
        // user is not in db
        const embed = new EmbedBuilder()
        .setTitle('Error')
        .setDescription('This user has no xp')
        .setColor(mainHex)

        return interaction.editReply({ embeds: [embed] })
    }

    // user is in db
    const dbUser = doc.users[rankUser.id]
    const settings = doc.settings

    // // start building the rank card
    // const rankCard = new jimp(800, 300, settings.rankCardSettings.backgroundColor)

    // // add the user avatar
    // const avatar = await jimp.read(rankUser.displayAvatarURL({ extension: 'png', size: 512 }))

    // avatar.circle()
    // avatar.resize(200, 200)

    // rankCard.composite(avatar, 50, 50)

    // // add the username
    // const fontLarge = await jimp.loadFont(jimp.FONT_SANS_64_WHITE)
    // const fontMed = await jimp.loadFont(jimp.FONT_SANS_32_WHITE)
    // const fontSmall = await jimp.loadFont(jimp.FONT_SANS_16_WHITE)

    // rankCard.print(fontLarge, 300, 50, rankUser.username)

    // // add the rank
    // rankCard.print(fontMed, 300, 120, `Level ${dbUser.level}`)
    // rankCard.print(fontMed, 300, 160, `XP: ${String(dbUser.xp).toLocaleString()} / ${String(settings.curve[dbUser.level + 1]).toLocaleString()}`)
    // rankCard.print(fontMed, 300, 200, `Rank: ${await getRank(rankUser, doc)}`)

    // // send the rank card
    // rankCard.write(`./images/rank/rank-${rankUser.id}.png`)

    const canvas = createCanvas(800, 300);
    const ctx = canvas.getContext('2d');

    // Draw the background color
    ctx.fillStyle = settings.rankCardSettings.backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw the user's avatar
    const avatar = await loadImage(rankUser.displayAvatarURL({ extension: 'png' }));
    const avatarSize = 200;
    // put the avatar center vertically and on the left side
    const avatarX = 30;
    const avatarY = (canvas.height / 2) - (avatarSize / 2);
    ctx.drawImage(avatar, avatarX, avatarY, avatarSize, avatarSize);

    // Draw the user's username
    const username = rankUser.username;
    const usernameFontSize = 36;
    const usernameX = avatarX + avatarSize + 80;
    const usernameY = (canvas.height / 2) - (usernameFontSize / 2) - 25 ;
    ctx.font = `bold ${usernameFontSize}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(username, usernameX, usernameY);

    // Draw the user's tag right next to their username
    const tag = `#${rankUser.discriminator}`;
    const tagFontSize = 24;
    const tagX = usernameX + (ctx.measureText(username).width / 2) + 10;
    const tagY = usernameY - 5;
    ctx.font = `${tagFontSize}px sans-serif`;
    ctx.textAlign = 'left';
    // make it slightly darker
    ctx.fillStyle = '#7a7a7a';
    ctx.fillText(tag, tagX, tagY);

    // make a progress bar with rounded corners
    const progressX = usernameX - 55;
    const progressY = usernameY + 25;
    const progressWidth = 450;
    const progressHeight = 40;
    const progressRadius = 10;
    const progressFill = settings.rankCardSettings.backgroundColor;
    const progressStroke = settings.rankCardSettings.accentColor;
    const progressStrokeWidth =2;
    const progressEndX = progressX + progressWidth;
    const progressEndY = progressY + progressHeight;
    const progressValue = (dbUser.xp - settings.curve[dbUser.level]);
    const progressMax = (settings.curve[dbUser.level + 1] - settings.curve[dbUser.level]);
    const progressPercent = progressValue / progressMax;
    const progressCurrentWidth = progressWidth * progressPercent;
    const progressCurrentX = progressX + progressCurrentWidth;
    const progressCurrentRadius = progressRadius - progressStrokeWidth;
    const progressCurrentEndX = progressCurrentX + progressCurrentRadius;
    const progressCurrentEndY = progressEndY - progressCurrentRadius - progressStrokeWidth + 8;

    // draw the progress bar
    ctx.beginPath();
    ctx.moveTo(progressX + progressRadius, progressY);
    ctx.lineTo(progressEndX - progressRadius, progressY);
    ctx.quadraticCurveTo(progressEndX, progressY, progressEndX, progressY + progressRadius);
    ctx.lineTo(progressEndX, progressEndY - progressRadius);

    // draw the rounded end
    ctx.quadraticCurveTo(progressEndX, progressEndY, progressEndX - progressRadius, progressEndY);
    ctx.lineTo(progressX + progressRadius, progressEndY);

    // draw the other rounded end
    ctx.quadraticCurveTo(progressX, progressEndY, progressX, progressEndY - progressRadius);
    ctx.lineTo(progressX, progressY + progressRadius);

    // draw the other end
    ctx.quadraticCurveTo(progressX, progressY, progressX + progressRadius, progressY);
    ctx.closePath();

    // fill the progress bar
    ctx.fillStyle = progressFill;
    ctx.fill();

    // draw the progress bar stroke
    ctx.lineWidth = progressStrokeWidth;
    ctx.strokeStyle = progressStroke;
    ctx.stroke();

    // draw the progress bar current value
    ctx.beginPath();
    ctx.moveTo(progressX + progressCurrentRadius, progressY);
    ctx.lineTo(progressCurrentX - progressCurrentRadius, progressY);
    ctx.quadraticCurveTo(progressCurrentX, progressY, progressCurrentX, progressY + progressCurrentRadius);
    ctx.lineTo(progressCurrentX, progressCurrentEndY - progressCurrentRadius);

    // draw the rounded end
    ctx.quadraticCurveTo(progressCurrentX, progressCurrentEndY, progressCurrentX - progressCurrentRadius, progressCurrentEndY);
    ctx.lineTo(progressX + progressCurrentRadius, progressCurrentEndY);

    // draw the other rounded end
    ctx.quadraticCurveTo(progressX, progressCurrentEndY, progressX, progressCurrentEndY - progressCurrentRadius);
    ctx.lineTo(progressX, progressY + progressCurrentRadius);

    // draw the other end
    ctx.quadraticCurveTo(progressX, progressY, progressX + progressCurrentRadius, progressY);
    ctx.closePath();

    // fill the progress bar current value
    ctx.fillStyle = progressStroke;
    ctx.fill();

    // draw the progress bar current value stroke
    ctx.lineWidth = progressStrokeWidth;
    ctx.strokeStyle = progressStroke;
    ctx.stroke();

    // draw the progress bar text
    const progressText = `${String(progressValue).toLocaleString()} / ${String(progressMax).toLocaleString()} XP`;
    const progressTextFontSize = 24;
    const progressTextX = progressX + (progressWidth / 2);
    const progressTextY = progressY + (progressHeight / 2) + (progressTextFontSize / 2) - 3;
    ctx.font = `medium ${progressTextFontSize}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(progressText, progressTextX, progressTextY);

    // draw the level text under the progress bar and to the left
    const levelText = `Lvl. ${dbUser.level}`;
    const levelTextFontSize = 24;
    const levelTextX = progressX - 2;
    const levelTextY = progressY + progressHeight + 45;
    // bold the level text
    ctx.font = `bold ${levelTextFontSize}px sans-serif`;
    ctx.textAlign = 'left';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(levelText, levelTextX, levelTextY);

    // put the rank text to the right of the level text
    const rankText = `Rank: ${await getRank(rankUser, doc)}`;
    const rankTextFontSize = 24;
    const rankTextX = levelTextX + ctx.measureText(levelText).width + 20;
    const rankTextY = levelTextY;
    ctx.font = `bold ${rankTextFontSize}px sans-serif`;
    ctx.textAlign = 'left';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(rankText, rankTextX, rankTextY);



    // Save the image to disk
    const stream = canvas.createPNGStream();
    const writeStream = fs.createWriteStream(`./images/rank/rank-${user.id}.jpg`);
    stream.pipe(writeStream);
    writeStream.on('finish', () => {
        console.log('Rank card saved');
    });
    

    setTimeout(() => {
        interaction.editReply({
            embeds: [],
            files: [{
                attachment: `./images/rank/rank-${user.id}.jpg`,
                name: `rank-${user.id}.jpg`
            }]
        })
    }, 1000)


    cmdRun(user,cmdName,guild,interaction)
}

async function getRank(user, doc) {
    // get the user data
    const dbUser = doc.users[user.id]

    // get the leaderboard
    const leaderboard = await getLeaderboard(doc)

    // get the rank
    const rank = leaderboard.findIndex(u => u.id === user.id) + 1

    return rank
}

async function getLeaderboard(doc) {
    // get the users
    const users = doc.users

    // get the leaderboard
    const leaderboard = Object.keys(users).map(id => {
        return {
            id,
            xp: users[id].xp
        }
    })

    // sort the leaderboard
    leaderboard.sort((a, b) => b.xp - a.xp)

    return leaderboard
}