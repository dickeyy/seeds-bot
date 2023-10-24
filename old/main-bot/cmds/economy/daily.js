const { cmdRun } = require('../../functions/cmdRun.js')
const { EmbedBuilder, time } = require('discord.js');
const { cooldownAdd, cooldownCheck, cdList, cooldownCheckTime } = require('../../functions/cooldown.js')
const { db } = require('../../index.js')

const mainHex = '#d79a61'

exports.dailyCmd = async function dailyCmd(user,guild,interaction) {
    const cmdName = 'daily'

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

        var collection = db.collection('economy')
        const doc = await collection.findOne({ userId: user.id, guildId: guild.id })

        if (doc == null) {
            const userData = {
                userId: user.id,
                guildId: guild.id,
                coins: 1000,
                fishingPole: null,
                pickaxe: null
            }
            await collection.insertOne(userData)

            const embed = new EmbedBuilder()
            .setTitle('<:fuck_coin:824720614543196220> 1000 Recived')
            .setDescription('Come back tomorrow for more!')
            .setFooter({ text: 'Balance: 1000 SC' })

            interaction.reply({
                embeds: [embed]
            }) 
        } else {
            
            var oldBal = doc.coins
            const newBal = oldBal + 500

            await collection.updateOne({ userId: user.id, guildId: guild.id }, { $set: { coins: newBal } })

            const embed = new EmbedBuilder()
            .setTitle('<:fuck_coin:824720614543196220> 500 Recived')
            .setDescription('Come back tomorrow for more!')
            .setFooter({ text: 'Balance: ' + newBal + ' SC' })

            interaction.reply({
                embeds: [embed]
            }) 
        }

        cooldownAdd(user,cmdName,guild,'oneDay')

        cmdRun(user,cmdName,guild,interaction)
    }
}