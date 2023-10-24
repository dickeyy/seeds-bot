const { cmdRun } = require('../../functions/cmdRun.js')
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder,ButtonStyle, time } = require('discord.js');
const { cooldownAdd, cooldownCheck, cdList, cooldownCheckTime } = require('../../functions/cooldown.js')
const { client, db } = require('../../index.js')

const mainHex = '#d79a61'

exports.highlowCmd = async function highlowCmd(user,guild,interaction) {
    const cmdName = 'highlow'

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

        const hint = Math.round(Math.random() * 100)
        const num = Math.round(Math.random() * 100)
        var coinsAdd = Math.round(Math.random() * 500)

        var collection = db.collection('economy')
        const doc = await collection.findOne({ userId: user.id, guildId: guild.id })
        var coins = doc.coins

        const embed = new EmbedBuilder()
        .setTitle('Higher / Lower | Hint: ' + hint)
        .setDescription('A random number between 1 and 100 has been chosen. Your hint is **' + hint + '**. Chose one of the buttons below, higher if the number is higher than the hint, lower if the number is lower than the hint, or equal if the number is equal to the hint.')

        const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
            .setCustomId('higher')
            .setLabel('Higher')
            .setStyle(ButtonStyle.Secondary),
    
            new ButtonBuilder()
            .setCustomId('lower')
            .setLabel('Lower')
            .setStyle(ButtonStyle.Secondary),

            new ButtonBuilder()
            .setCustomId('equal')
            .setLabel('Equal')
            .setStyle(ButtonStyle.Primary),
        )

        interaction.reply({
            embeds: [embed],
            components: [row]
        })

        client.on('interactionCreate', interaction2 => {
            if (!interaction2.isButton()) return;

            const embed2 = new EmbedBuilder()

            if (interaction2['customId'] == 'higher') {
                if (doc == null) {
                    if (num > hint) {
                        const userData = {
                            userId: user.id,
                            guildId: guild.id,
                            coins: coinsAdd,
                            fishingPole: null,
                            pickaxe: null
                        }
                        collection.insertOne(userData).then(() => {})

                        embed2.setTitle('Congrats!')
                        embed2.setDescription('You got it right! The number was **' + num + '** \nYou recived **' + coinsAdd + '** SC')
                        embed2.setFooter({ text: 'Balance: ' + coinsAdd })
                        embed2.setColor('Green')

                        interaction.editReply({
                            embeds: [embed2],
                            components: []
                        })

                    } else {
                        embed2.setTitle('Nope!')
                        embed2.setDescription('The number was **' + num + '**')

                        interaction.editReply({
                            embeds: [embed2],
                            components: []
                        })
                    }
                } else {
                    if (num > hint) {
                        const newBal = coins + coinsAdd

                        collection.updateOne({ userId: user.id, guildId: guild.id }, { $set: { coins: newBal } }).then(() => {})    
                        embed2.setTitle('Congrats!')
                        embed2.setDescription('You got it right! The number was **' + num + '** \nYou recived **' + coinsAdd + '** SC')
                        embed2.setFooter({ text: 'Balance: ' + newBal })
                        embed2.setColor('Green')

                        interaction.editReply({
                            embeds: [embed2],
                            components: []
                        })
                    } else {
                        embed2.setTitle('Nope!')
                        embed2.setDescription('The number was **' + num + '**')

                        interaction.editReply({
                            embeds: [embed2],
                            components: []
                        })
                    }
                }
            } else if (interaction2['customId'] == 'lower') {
                if (doc == null) {
                    if (num < hint) {
                        const userData = {
                            userId: user.id,
                            guildId: guild.id,
                            coins: coinsAdd,
                            fishingPole: null,
                            pickaxe: null
                        }
                        collection.insertOne(userData).then(() => {})

                        embed2.setTitle('Congrats!')
                        embed2.setDescription('You got it right! The number was **' + num + '** \nYou recived **' + coinsAdd + '** SC')
                        embed2.setFooter({ text: 'Balance: ' + coinsAdd })
                        embed2.setColor('Green')

                        interaction.editReply({
                            embeds: [embed2],
                            components: []
                        })

                    } else {
                        embed2.setTitle('Nope!')
                        embed2.setDescription('The number was **' + num + '**')

                        interaction.editReply({
                            embeds: [embed2],
                            components: []
                        })
                    }
                } else {
                    if (num < hint) {
                        const newBal = coins + coinsAdd

                        collection.updateOne({ userId: user.id, guildId: guild.id }, { $set: { coins: newBal } }).then(() => { })

                        embed2.setTitle('Congrats!')
                        embed2.setDescription('You got it right! The number was **' + num + '** \nYou recived **' + coinsAdd + '** SC')
                        embed2.setFooter({ text: 'Balance: ' + newBal })
                        embed2.setColor('Green')

                        interaction.editReply({
                            embeds: [embed2],
                            components: []
                        })
                    } else {
                        embed2.setTitle('Nope!')
                        embed2.setDescription('The number was **' + num + '**')

                        interaction.editReply({
                            embeds: [embed2],
                            components: []
                        })
                    }
                }
            } else if (interaction2['customId'] == 'equal') {
                coinsAdd * 2

                if (doc == null) {
                    if (num == hint) {
                        const userData = {
                            userId: user.id,
                            guildId: guild.id,
                            coins: coinsAdd,
                            fishingPole: null,
                            pickaxe: null
                        }
                        collection.insertOne(userData).then(() => {})

                        embed2.setTitle('Congrats!')
                        embed2.setDescription('You got it right! The number was **' + num + '** \nYou recived **' + coinsAdd + '** SC')
                        embed2.setFooter({ text: 'Balance: ' + coinsAdd })
                        embed2.setColor('Gold')

                        interaction.editReply({
                            embeds: [embed2],
                            components: []
                        })

                    } else {
                        embed2.setTitle('Nope!')
                        embed2.setDescription('The number was **' + num + '**')

                        interaction.editReply({
                            embeds: [embed2],
                            components: []
                        })
                    }
                } else {
                    if (num == hint) {
                        const newBal = coins + coinsAdd

                        collection.updateOne({ userId: user.id, guildId: guild.id }, { $set: { coins: newBal } }).then(() => {})
    
                        embed2.setTitle('Congrats!')
                        embed2.setDescription('You got it right! The number was **' + num + '** \nYou recived **' + coinsAdd + '** SC')
                        embed2.setFooter({ text: 'Balance: ' + newBal })
                        embed2.setColor('Gold')

                        interaction.editReply({
                            embeds: [embed2],
                            components: []
                        })
                    } else {
                        embed2.setTitle('Nope!')
                        embed2.setDescription('The number was **' + num + '**')

                        interaction.editReply({
                            embeds: [embed2],
                            components: []
                        })
                    }
                }
            }
        })

        cooldownAdd(user,cmdName,guild,'twoMin')

        cmdRun(user,cmdName,guild,interaction)
    }
}