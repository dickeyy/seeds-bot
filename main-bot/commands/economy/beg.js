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

exports.begCmd = async function begCmd(user,guild,interaction) {
    const cmdName = 'beg'

    if (cooldown.has(`${user.id}--${cmdName}`)) {
        const embed = new MessageEmbed()
        .setTitle(cdList[Math.floor(Math.random() * cdList.length)])
        .setDescription('That command can only be run once every 10 minutes')
        .setColor('RED')
        interaction.reply({
            embeds: [embed],
            ephemeral: true
        })
        
    } else {

        const coinsAdd = Math.floor(Math.random() * 100)

        var collection = db.collection('economy')
        const doc = await collection.findOne({ userId: user.id, guildId: guild.id })
    
        if (doc == null) {
            const userData = {
                userId: user.id,
                guildId: guild.id,
                coins: coinsAdd,
                fishingPole: null,
                pickaxe: null
            }
    
            await collection.insertOne(userData)
    
            const embed = new MessageEmbed()
            .setTitle('Ugh.. I guess')
            .setDescription("Here's **<:fuck_coin:824720614543196220>" + coinsAdd + "**\n\nYour new balance is **<:fuck_coin:824720614543196220>" + coinsAdd + "**")
            
            interaction.reply({
                embeds: [embed]
            })
        } else {
            const oldBal = doc.coins
            const newBal = oldBal + coinsAdd
    
            await collection.updateOne({ userId: user.id, guildId: guild.id }, { $set: { coins: newBal }})
    
            const embed = new MessageEmbed()
            .setTitle('Ugh.. I guess')
            .setDescription("Here's **<:fuck_coin:824720614543196220>" + coinsAdd + "**\n\nYour new balance is **<:fuck_coin:824720614543196220>" + newBal + "**")
    
            interaction.reply({
                embeds: [embed]
            })
        }
    
        //now, set cooldown
       cooldown.add(`${user.id}--${cmdName}`);
        setTimeout(() => {
            cooldown.delete(`${user.id}--${cmdName}`);
        }, tenMinCooldown);
    }
    cmdRun(user,cmdName)
}