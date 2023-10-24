const { cmdRun } = require('../../functions/cmdRun.js')
const { EmbedBuilder, time } = require('discord.js');
const { db } = require('../../index.js')
const { cooldownAdd, cooldownCheck, cdList, cooldownCheckTime } = require('../../functions/cooldown.js')

const mainHex = '#d79a61'

exports.rpsCmd = async function rpsCmd(user,guild,interaction,bet,move) {
    const cmdName = 'rps'

    if (await cooldownCheck(user, cmdName, guild)) {
        await cooldownCheckTime(user, cmdName, guild).then((res) => {
            let dt = new Date();
            dt.setSeconds(dt.getSeconds() + res);

            const embed = new EmbedBuilder()
            .setTitle(cdList[Math.floor(Math.random() * cdList.length)])
            .setDescription('You can use this command again ' + time(dt, 'R'))
            .setColor('Red')
            interaction.reply({
                embeds: [embed],
                ephemeral: true
            })
        })
    } else {
        if (bet < 10) {
            const embed = new EmbedBuilder()
            .setTitle('Minimum Bet is 10 Coins')
            .setColor('Red')

            interaction.reply({
                embeds: [embed],
                ephemeral: true
            })
        } else {
            const botMoveList = ['rock', 'paper', 'scissors']
            const botMove = botMoveList[Math.floor(Math.random() * botMoveList.length)]

            if (botMove == 'rock') var botMoveEmoji = '🪨'
            else if (botMove == 'paper') var botMoveEmoji = '📄'
            else if (botMove == 'scissors') var botMoveEmoji = '✂️'

            if (move == 'rock') var moveEmoji = '🪨'
            else if (move == 'paper') var moveEmoji = '📄'
            else if (move == 'scissors') var moveEmoji = '✂️'

            const winAmount = bet * 1.25

            var collection = db.collection('economy')
            const doc = await collection.findOne({ userId: user.id, guildId: guild.id })

            const embed = new EmbedBuilder()
            embed.setTitle('Rock Paper Scissors')
            embed.setDescription(user.username + ' plays: ' + moveEmoji + '\nSeeds plays: ' + botMoveEmoji)

            if (doc == null) {
                const embed = new EmbedBuilder()
                .setTitle('You have no coins')
                .setDescription('Run `\`/daily`\` to get some')
                .setColor('Red')

                interaction.reply({
                    embeds: [embed],
                    ephemeral: true
                })
            } else {
                if (botMove == 'rock' && move == 'scissors' || botMove == 'paper' && move == 'rock' || botMove == 'scissors' && move == 'paper') {
                    // Player wins
                    var bal = doc.coins + winAmount

                    embed.setColor('Green')
                    embed.setFields([
                        {
                            name: 'You Win!', value: 'Winnings: ' + winAmount, inline: false
                        }
                    ])
                    embed.setFooter({ text: 'Balance: ' + bal })

                    await collection.updateOne({ userId: user.id, guildId: guild.id }, { $set: { coins: bal } })

                    interaction.reply({
                        embeds: [embed]
                    })
                } else if (botMove == 'rock' && move == 'rock' || botMove == 'paper' && move == 'paper' || botMove == 'scissors' && move == 'scissors') {
                    // Tie
                    var bal = doc.coins

                    embed.setColor('Orange')
                    embed.setFields([
                        {
                            name: 'Tie!', value: 'You didnt win or lose anything', inline: false
                        }
                    ])
                    embed.setFooter({ text: 'Balance: ' + bal })

                    interaction.reply({
                        embeds: [embed]
                    })
                } else if (botMove == 'rock' && move == 'paper' || botMove == 'paper' && move == 'scissors' || botMove == 'scissors' && move == 'rock') {
                    // Bot Wins
                    var bal = doc.coins - bet

                    embed.setColor('Red')
                    embed.setFields([
                        {
                            name: 'You Lost!', value: 'Lossings: ' + bet, inline: false
                        }
                    ])
                    embed.setFooter({ text: 'Balance: ' + bal })

                    await collection.updateOne({ userId: user.id, guildId: guild.id }, { $set: { coins: bal } })

                    interaction.reply({
                        embeds: [embed]
                    })
                }

                cooldownAdd(user,cmdName,guild,'oneMin')

                cmdRun(user,cmdName,guild,interaction)
            }
        }
    }
}