const { cmdRun } = require('../../functions/cmdRun.js')
const { EmbedBuilder } = require('discord.js');
const { connectDb } = require('../../utils/db.js');
const { log } = require('../../functions/log.js');
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


exports.fishCmd = async function fishCmd(user,guild,interaction) {
    const cmdName = 'fish'

    if (cooldown.has(user.id + '--' + cmdName)) {
        const embed = new EmbedBuilder()

        .setTitle(cdList[Math.floor(Math.random() * cdList.length)])
        .setDescription('That command can only be run once every five minutes')
        .setColor('RED')
        interaction.reply({
            embeds: [embed],
            ephemeral: true
        })
        return
    }

    const collection = db.collection('economy')
    const doc = await collection.findOne({ userId: user.id, guildId: guild.id })

    if (doc.i_1 == null) {
        const noPoleEmbed = new EmbedBuilder()
        .setTitle('Error: You do not have a fishing pole.')
        .setDescription('Use `\`/buy 1`\` to get one')
        .setColor('Red')

        interaction.reply({
            embeds: [noPoleEmbed],
            ephemeral: true
        })
    } else { 
        if (doc.i_1.durability <= 0) {
            const embed = new EmbedBuilder()
            .setTitle('Your fishing pole is broken!')
            .setDescription('Buy a new one using `\`/buy 1`\`')
            .setColor('Red')

            await collection.updateOne({ userId: user.id, guildId: guild.id }, { $set: { i_1: null } })

            interaction.reply({
                embeds: [embed],
                ephemeral: true
            })
        } else {
            const fishList = ['f10','f10','f10','f10','f10','f10','f10','f10','f10','f10','f10','f10','f1', 'f1','f1','f1','f1','f1','f1','f1','f2', 'f2','f2','f2','f2','f2','f2','f2','Carp', 'f3','f3','f3','f3','f3','f4', 'f4','f4','f4','f5', 'f5','f5','f5','f5','f5','f6', 'f6','f6','f7', 'f7','f7','f8','f8','f8','f8','f8','f8','f8','f8','f8','f8','f8','f8','f9']
            const fishToFetch = fishList[Math.floor(Math.random() * fishList.length)]
    
            const fishDoc = await collection.findOne({ shop: true })
            const fish = fishDoc.fish[fishToFetch]
            const fishPole = doc.i_1
        
            const newBalance = doc.coins + fish.price
    
            const embed = new EmbedBuilder()
            
            if (fish.name == 'Nothing') {
                embed.setTitle('You caught nothing :(')
                embed.setDescription('You lost 10 coins')
                embed.setFooter({ text: 'Balance: ' + newBalance })
                embed.setColor("Red")
    
                await collection.updateOne({ userId: user.id, guildId: guild.id }, { $set: { coins: newBalance } })
    
                interaction.reply({
                    embeds: [embed]
                })
            } else {
                const newDurability = fishPole.durability - fish.damage || fishPole.durability
    
                embed.setTitle('You caught a ' + fish.name)
                embed.setDescription('You earned **' + fish.price + ' Coins**\n Fishing Pole Durability: ' + newDurability)
                embed.setFooter({ text: 'Balance: ' + newBalance })
                embed.setColor('Green')
    
                await collection.updateOne({ userId: user.id, guildId: guild.id }, { $set: { i_1: { name: 'Basic Pole', durability: newDurability }, coins: newBalance } })
    
                interaction.reply({
                    embeds: [embed]
                })
            }   

            cooldown.add(user.id + '--' + cmdName);
                setTimeout(() => {
                    cooldown.delete(user.id + '--' + cmdName);
                }, fiveMinCooldown);

                cmdRun(user,cmdName,guild,interaction)
            
        }
    }
}