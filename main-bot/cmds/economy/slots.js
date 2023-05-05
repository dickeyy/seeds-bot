const { cmdRun } = require('../../functions/cmdRun.js')
const { EmbedBuilder } = require('discord.js');
const { db } = require('../../index.js')

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


exports.slotsCmd = async function slotsCmd(user,guild,interaction,bet) {
    const cmdName = 'slots'

    if (cooldown.has(user.id + '--' + cmdName)) {
        const embed = new EmbedBuilder()

        .setTitle(cdList[Math.floor(Math.random() * cdList.length)])
        .setDescription('That command can only be run once every one minute')
        .setColor('RED')
        interaction.reply({
            embeds: [embed],
            ephemeral: true
        })
    } else {

        if (bet < 10) {
            const embed = new EmbedBuilder()
            .setTitle('Bet must be more than 10 SC')
            .setColor('Red')
            interaction.reply({
                embeds: [embed],
                ephemeral: true
            })
        } else {
            const emojiList = ['🎉','💎','🏆','💯','💵','🔔']
            const emoji1 = emojiList[Math.floor(Math.random() * emojiList.length )]
            const emoji2 = emojiList[Math.floor(Math.random() * emojiList.length )]
            const emoji3 = emojiList[Math.floor(Math.random() * emojiList.length )]

            const win1 = bet * 1.5
            const win2 = bet * 3
    
            var collection = db.collection('economy')
            const doc = await collection.findOne({ userId: user.id, guildId: guild.id })

            const embed = new EmbedBuilder()
            embed.setTitle('Slot Machine')
            embed.setDescription('- ' + emoji1 + ' ' + emoji2 + ' ' + emoji3 + ' -')
    
            if (doc == null) {
                const embedNoCoins = new EmbedBuilder()
                embedNoCoins.setTitle('You have no SC, run /daily to get some')
                embedNoCoins.setColor('Red')

                interaction.reply({
                    embeds: [embedNoCoins],
                    ephemeral: true
                })
            } else if (doc.coins < bet) {
                const notEnoughCoins = new EmbedBuilder()
                .setTitle('You do not have that many coins')
                .setDescription('Balance: ' + doc.coins)
                .setColor('Red')

                interaction.reply({
                    embeds: [notEnoughCoins],
                    ephemeral: true
                })
            } else {
                if (emoji1 != emoji2 && emoji2 != emoji3) {
                    // Lose
                    var bal = doc.coins - bet
                    
                    embed.setColor('Red')
                    embed.setFields([
                        {
                            name: 'You Lost!',
                            value: 'Losings: ' + bet
                        }
                    ])
                    embed.setFooter({ text: 'Balance: ' + bal})

                    await collection.updateOne({ userId: user.id, guildId: guild.id }, { $set: { coins: bal } })

                    interaction.reply({
                        embeds: [embed]
                    })
                } else if (emoji1 == emoji2 && emoji2 != emoji3) {
                    // Win 1.5x emoji 1 and 2
                    var bal = doc.coins + win1

                    embed.setColor('Green')
                    embed.setFields([
                        {
                            name: 'You Won!',
                            value: 'Winnings: ' + win1
                        }
                    ])
                    embed.setFooter({ text: 'Balance: ' + bal })

                    await collection.updateOne({ userId: user.id, guildId: guild.id }, { $set: { coins: bal } })

                    interaction.reply({ 
                        embeds: [embed]
                    })
                } else if (emoji2 == emoji3 && emoji3 != emoji1) {
                    // Win 1.5x emoji 2 and 3
                    var bal = doc.coins + win1

                    embed.setColor('Green')
                    embed.setFields([
                        {
                            name: 'You Won!',
                            value: 'Winnings: ' + win1
                        }
                    ])
                    embed.setFooter({ text: 'Balance: ' + bal })

                    await collection.updateOne({ userId: user.id, guildId: guild.id }, { $set: { coins: bal } })

                    interaction.reply({
                        embeds: [embed]
                    })
                } else if (emoji1 == emoji2 && emoji2 == emoji3) {
                    // Win 3x emoji 1,2,3
                    var bal = doc.coins + win2

                    embed.setColor('Gold')
                    embed.setFields([
                        {
                            name: 'You Won!',
                            value: 'Winnings: ' + win2
                        }
                    ])
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