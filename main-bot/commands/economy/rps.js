const { cmdRun } = require('../../functions/cmdRun.js')
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const { connectDb } = require('../../utils/db.js')
const client = require('../../index.js').client

const db = connectDb()

const mainHex = '#d79a61'

// Set up cooldown stuff
const cooldown = new Set();
const oneMinCooldown = 60000;
const twoMinCooldown = oneMinCooldown * 2;
const fiveMinCooldown = oneMinCooldown * 5; 
const tenMinCooldown = fiveMinCooldown * 2 ; 
const thirtyMinCooldown = tenMinCooldown * 3;
const oneHourCooldown = thirtyMinCooldown * 2;
const twelveHourCooldown = oneHourCooldown * 12;
const OneDayCooldown = twelveHourCooldown * 2;
const OneWeekCooldown = OneDayCooldown * 7;

const cdList = ['Chill Out', 'CHILLLLL', 'Stop.', 'Take a Breather', 'ok', 'Spamming commands is cringe', 'Slow it down', 'Wee-Woo-Wee-Woo Pull Over', 'No smile', '-_-', 'Why tho...', 'Yikes U Should Like Not', 'Slow it Cowboy', 'Take a Break Bro', 'Go Touch Some Grass']

exports.rpsCmd = async function rpsCmd(user,guild,interaction,bet,move) {
    const cmdName = 'rps'

    if (cooldown.has(user.id + '--' + cmdName)) {
        const embed = new MessageEmbed()

        .setTitle(cdList[Math.floor(Math.random() * cdList.length)])
        .setDescription('That command can only be run once every five minutes')
        .setColor('RED')
        interaction.reply({
            embeds: [embed],
            ephemeral: true
        })
    } else {
        if (bet < 10) {
            const embed = new MessageEmbed()
            .setTitle('Minimum Bet is 10 Coins')
            .setColor('RED')

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

            const embed = new MessageEmbed()
            embed.setTitle('Rock Paper Scissors')
            embed.setDescription(user.username + ' plays: ' + moveEmoji + '\nSeeds plays: ' + botMoveEmoji)

            if (doc == null) {
                const embed = new MessageEmbed()
                .setTitle('You have no coins')
                .setDescription('Run `\`/daily`\` to get some')
                .setColor('RED')

                interaction.reply({
                    embeds: [embed],
                    ephemeral: true
                })
            } else {
                if (botMove == 'rock' && move == 'scissors' || botMove == 'paper' && move == 'rock' || botMove == 'scissors' && move == 'paper') {
                    // Player wins
                    var bal = doc.coins + winAmount

                    embed.setColor('GREEN')
                    embed.addField('You Win!', 'Winnings: ' + winAmount, false)
                    embed.setFooter({ text: 'Balance: ' + bal })

                    await collection.updateOne({ userId: user.id, guildId: guild.id }, { $set: { coins: bal } })

                    interaction.reply({
                        embeds: [embed]
                    })
                } else if (botMove == 'rock' && move == 'rock' || botMove == 'paper' && move == 'paper' || botMove == 'scissors' && move == 'scissors') {
                    // Tie
                    var bal = doc.coins

                    embed.setColor('ORANGE')
                    embed.addField('Tie!', 'You didnt win or lose anything')
                    embed.setFooter({ text: 'Balance: ' + bal })

                    interaction.reply({
                        embeds: [embed]
                    })
                } else if (botMove == 'rock' && move == 'paper' || botMove == 'paper' && move == 'scissors' || botMove == 'scissors' && move == 'rock') {
                    // Bot Wins
                    var bal = doc.coins - bet

                    embed.setColor('RED')
                    embed.addField('You Lost!', 'Lossings: ' + bet, false)
                    embed.setFooter({ text: 'Balance: ' + bal })

                    await collection.updateOne({ userId: user.id, guildId: guild.id }, { $set: { coins: bal } })

                    interaction.reply({
                        embeds: [embed]
                    })
                }

                cooldown.add(user.id + '--' + cmdName);
                setTimeout(() => {
                    cooldown.delete(user.id + '--' + cmdName);
                }, oneMinCooldown);

                cmdRun(user,cmdName,guild,interaction)
            }
        }
    }
}