const { cmdRun } = require('../../functions/cmdRun.js')
const { EmbedBuilder } = require('discord.js');

const mainHex = '#d79a61'

exports.coinflipCmd = function coinflipCmd(user, guild, interaction) {
    const cmdName = 'coinflip'

    const choice = Math.round(Math.random())
    
    if (choice === 1) {
        const embed = new EmbedBuilder()
        .setTitle('<:simp_coin:824720566241853460> Heads!')
        .setColor('Gold')
        
        cmdRun(user, cmdName,guild,interaction)
        
        interaction.reply({
            embeds: [embed]
        })

    } else {
        const embed = new EmbedBuilder()
        .setTitle('<:fuck_coin:824720614543196220> Tails!')
        .setColor('Gold')
        
        cmdRun(user, cmdName,guild,interaction)

        interaction.reply({
            embeds: [embed]
        })
    }
}