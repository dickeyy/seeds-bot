const { cmdRun } = require('../../functions/cmdRun.js')
const { EmbedBuilder, MessageActionRow, MessageButton } = require('discord.js');
const { db } = require('../../index.js')

const mainHex = '#d79a61'

exports.buyCmd = async function buyCmd(user,guild,interaction,shopId) {
    const cmdName = 'buy'

    var collection = db.collection('economy')
    const shopData = await collection.findOne({ shop: true })
    const doc = await collection.findOne({ userId: user.id, guildId: guild.id })
    const itemData = shopData.items['i_' + shopId]

    if (doc == null) {
        const embed = new EmbedBuilder()
        .setTitle('You have no coins')
        .setDescription('Run `\`/daily`\` to get some')
        .setColor('Red')

        interaction.reply({
            embeds: [embed],
            ephemeral: true
        })
    }

    if (doc.coins < itemData.price) {
        const embed = new EmbedBuilder()
        .setTitle('You do not have enough coins to buy that')
        .setDescription('Balance: ' + doc.coins)
        .setColor('Red')

        interaction.reply({ 
            emebds: [embed],
            ephemeral: true
        })
    } else {
        if (doc['i_' + shopId] != null && !itemData.stackable || doc['i_' + shopId] != undefined && !itemData.stackable ) {
            const embed2 = new EmbedBuilder()
            .setTitle('That item is not stackable, you already own one')
            .setColor('Red')

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

            const embed3 = new EmbedBuilder()
            .setTitle('Purchased ' + itemData.name + ' Successfully')
            .setDescription('Balance: ' + bal)
            .setColor('Green')

            interaction.reply({
                embeds: [embed3]
            })
        }
        cmdRun(user,cmdName,guild,interaction)
    }

}