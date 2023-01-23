const { cmdRun } = require('../../functions/cmdRun.js')
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
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


exports.buyCmd = async function buyCmd(user,guild,interaction,shopId) {
    const cmdName = 'buy'

    var collection = db.collection('economy')
    const shopData = await collection.findOne({ shop: true })
    const doc = await collection.findOne({ userId: user.id, guildId: guild.id })
    const itemData = shopData.items['i_' + shopId]

    if (doc == null) {
        const embed = new MessageEmbed()
        .setTitle('You have no coins')
        .setDescription('Run `\`/daily`\` to get some')
        .setColor('RED')

        interaction.reply({
            embeds: [embed],
            ephemeral: true
        })
    }

    if (doc.coins < itemData.price) {
        const embed = new MessageEmbed()
        .setTitle('You do not have enough coins to buy that')
        .setDescription('Balance: ' + doc.coins)
        .setColor('RED')

        interaction.reply({ 
            emebds: [embed],
            ephemeral: true
        })
    } else {
        if (doc['i_' + shopId] != null && !itemData.stackable || doc['i_' + shopId] != undefined && !itemData.stackable ) {
            const embed2 = new MessageEmbed()
            .setTitle('That item is not stackable, you already own one')
            .setColor('RED')

            interaction.reply({ 
                embeds: [embed2],
                ephemeral: true
            })
        } else {
            const userUpdateItemData = {
                durability: itemData.durability,
                name: itemData.name
            }
            const bal = doc.coins - itemData.price

            await collection.updateOne({ userId: user.id, guildId: guild.id }, { $set: { ['i_' + shopId]: userUpdateItemData, coins: bal } })

            const embed3 = new MessageEmbed()
            .setTitle('Purchased ' + itemData.name + ' Successfully')
            .setDescription('Balance: ' + bal)
            .setColor('GREEN')

            interaction.reply({
                embeds: [embed3]
            })
        }
        cmdRun(user,cmdName,guild,interaction)
    }

}