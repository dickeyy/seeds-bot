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


exports.shopCmd = async function shopCmd(user,guild,interaction) {
    const cmdName = 'shop'

    var collection = db.collection('economy')
    const shopData = await collection.findOne({ shop: true })
    const doc = await collection.findOne({ userId: user.id, guildId: guild.id })

    const embed = new EmbedBuilder()

    if (doc == null) {
        embed.setTitle('Seed Shop | Balance: 0')
    } else {
        embed.setTitle('Seed Shop | Balance: ' + doc.coins)
    }

    embed.setDescription('Buy any items with `\`/buy [item id]`\`')
    embed.setFields([
        { name: 'Fishing Poles', value: '> `\`' + shopData.items.i_1.id + '`\` - ' + shopData.items.i_1.name + ': ' + shopData.items.i_1.description + ' Price: **' + shopData.items.i_1.price + '**', inline: false },
        { name: 'Pickaxes', value: '> `\`' + shopData.items.i_2.id + '`\` - ' + shopData.items.i_2.name + ': ' + shopData.items.i_2.description + ' Price: **' + shopData.items.i_2.price + '**\n' + '> `\`' + shopData.items.i_3.id + '`\` - ' + shopData.items.i_3.name + ': ' + shopData.items.i_3.description + ' Price: **' + shopData.items.i_3.price + '**\n' + '> `\`' + shopData.items.i_4.id + '`\` - ' + shopData.items.i_4.name + ': ' + shopData.items.i_4.description + ' Price: **' + shopData.items.i_4.price + '**\n' + '> `\`' + shopData.items.i_5.id + '`\` - ' + shopData.items.i_5.name + ': ' + shopData.items.i_5.description + ' Price: **' + shopData.items.i_5.price + '**\n' + '> `\`' + shopData.items.i_6.id + '`\` - ' + shopData.items.i_6.name + ': ' + shopData.items.i_6.description + ' Price: **' + shopData.items.i_6.price + '**\n', inline: false }
    ])

    interaction.reply({
        embeds: [embed]
    })
    
    cmdRun(user,cmdName,guild,interaction)
}