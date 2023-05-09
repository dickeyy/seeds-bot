const { cmdRun } = require('../../functions/cmdRun.js')
const { EmbedBuilder } = require('discord.js');
const { db } = require('../../index.js')

const mainHex = '#d79a61'

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
    embed.setColor(mainHex)

    interaction.reply({
        embeds: [embed]
    })
    
    cmdRun(user,cmdName,guild,interaction)
}