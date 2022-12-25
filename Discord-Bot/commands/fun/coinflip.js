const { cmdRun } = require('../../functions/cmdRun.js')
const { MessageEmbed } = require('discord.js');

const mainHex = '#d79a61'

exports.coinflipCmd = function coinflipCmd(user, guild, interaction) {
    const cmdName = 'coinflip'

    const choice = Math.round(Math.random())
    
    if (choice === 1) {
        const embed = new MessageEmbed()
        .setTitle('<:simp_coin:824720566241853460> Heads!')
        .setColor('GOLD')
        
        cmdRun(user, cmdName)
        
        interaction.reply({
            embeds: [embed]
        })

    } else {
        const embed = new MessageEmbed()
        .setTitle('<:fuck_coin:824720614543196220> Tails!')
        .setColor('GOLD')
        
        cmdRun(user, cmdName)

        interaction.reply({
            embeds: [embed]
        })
    }
}