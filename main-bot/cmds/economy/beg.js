const { cmdRun } = require('../../functions/cmdRun.js')
const { EmbedBuilder, time } = require('discord.js');
const { db } = require('../../index.js')
const { cooldownAdd, cooldownCheck, cdList, cooldownCheckTime } = require('../../functions/cooldown.js')

const mainHex = '#d79a61'

exports.begCmd = async function begCmd(user,guild,interaction) {
    const cmdName = 'beg'

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
    
            const embed = new EmbedBuilder()
            .setTitle('Ugh.. I guess')
            .setDescription("Here's **<:fuck_coin:824720614543196220>" + coinsAdd + "**\n\nYour new balance is **<:fuck_coin:824720614543196220>" + coinsAdd + "**")
            
            interaction.reply({
                embeds: [embed]
            })
        } else {
            const oldBal = doc.coins
            const newBal = oldBal + coinsAdd
    
            await collection.updateOne({ userId: user.id, guildId: guild.id }, { $set: { coins: newBal }})
    
            const embed = new EmbedBuilder()
            .setTitle('Ugh.. I guess')
            .setDescription("Here's **<:fuck_coin:824720614543196220>" + coinsAdd + "**\n\nYour new balance is **<:fuck_coin:824720614543196220>" + newBal + "**")
    
            interaction.reply({
                embeds: [embed]
            })
        }
    
        // now, set cooldown
        cooldownAdd(user,cmdName,guild,'oneMin')
    }
    cmdRun(user,cmdName,guild,interaction)
}