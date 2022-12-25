const { cmdRun } = require('../../functions/cmdRun.js')
const { MessageEmbed } = require('discord.js');
const { connectDb } = require('../../utils/db.js')

const db = connectDb()

const mainHex = '#d79a61'

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