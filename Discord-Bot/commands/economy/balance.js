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


exports.balanceCmd = async function balanceCmd(user,guild,interaction) {
    const cmdName = 'balance'

    var collection = db.collection('economy')
    const doc = await collection.findOne({ userId: user.id, guildId: guild.id })

    if (doc == null) {
        const embed = new MessageEmbed()    
        .setTitle('You have no SeedCoin')
        .setDescription('Run `\`/daily`\` to get some!')
        .setColor(mainHex)
        
        interaction.reply({
            embeds: [embed]
        })
    } else {
        const coins = doc.coins
        const embed = new MessageEmbed()
        .setTitle('Bank Balance')
        .setDescription('<@' + user.id + '> has **<:fuck_coin:824720614543196220> ' + coins + ' SeedCoins**')
        .setColor(mainHex)

        interaction.reply({
            embeds: [embed]
        })
    }
    cmdRun(user,cmdName)
}