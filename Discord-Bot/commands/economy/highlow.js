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

exports.highlowCmd = async function highlowCmd(user,guild,interaction) {
    const cmdName = 'highlow'

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

        const hint = Math.round(Math.random() * 100)
        const num = Math.round(Math.random() * 100)
        var coinsAdd = Math.round(Math.random() * 500)

        var collection = db.collection('economy')
        const doc = await collection.findOne({ userId: user.id, guildId: guild.id })
        var coins = doc.coins

        const embed = new MessageEmbed()
        .setTitle('Higher / Lower | Hint: ' + hint)
        .setDescription('A random number between 1 and 100 has been chosen. Your hint is **' + hint + '**. Chose one of the buttons below, higher if the number is higher than the hint, lower if the number is lower than the hint, or equal if the number is equal to the hint.')

        const row = new MessageActionRow()
        .addComponents(
            new MessageButton()
            .setCustomId('higher')
            .setLabel('Higher')
            .setStyle('SECONDARY'),
    
            new MessageButton()
            .setCustomId('lower')
            .setLabel('Lower')
            .setStyle('SECONDARY'),

            new MessageButton()
            .setCustomId('equal')
            .setLabel('Equal')
            .setStyle('SECONDARY'),
        )

        interaction.reply({
            embeds: [embed],
            components: [row]
        })

        client.on('interactionCreate', interaction2 => {
            if (!interaction2.isButton()) return;

            const embed2 = new MessageEmbed()

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
                        embed2.setColor('GREEN')

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
                        embed2.setColor('GREEN')

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
                        embed2.setColor('GREEN')

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
                        embed2.setColor('GREEN')

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
                        embed2.setColor('GOLD')

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
                        embed2.setColor('GOLD')

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

        cooldown.add(`${user.id}--${cmdName}`);
        setTimeout(() => {
            cooldown.delete(`${user.id}--${cmdName}`);
        }, fiveMinCooldown);

        cmdRun(user,cmdName)
    }
}