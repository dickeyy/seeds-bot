const { cmdRun } = require('../../functions/cmdRun.js')
const { EmbedBuilder, Permissions } = require('discord.js');
const { log } = require('../../functions/log.js');
const client = require('../../index.js').client

const mainHex = '#d79a61'


exports.unbanCmd = function unbanCmd(user,guild,interaction,unbanUser,reason) {
    const cmdName = 'unban'

    if (true) {
        if (reason == null) {
            reason = 'No reason provided'
        }

        guild.members.unban(unbanUser, reason).catch(error => {
            if (error.code == 10026) {
                const embed = new EmbedBuilder()
                .setTitle('Error: That person is not banned')
                .setColor('Red')
                interaction.reply({
                    embeds: [embed],
                    ephemeral: true
                })
            } else {
                console.log(error)
            }
        }).then(() => {
            const embed = new EmbedBuilder()
            .setTitle('Unbanned Member')
            .setDescription(`Unbanned <@${unbanUser}>\nReason: \`${reason}\``)
            .setTimestamp()
            .setColor(mainHex)
    
            interaction.reply({
                embeds: [embed]
            }).catch(error => { })
            cmdRun(user,cmdName,guild,interaction)
        })

    } else {
        const embed = new EmbedBuilder()
        .setTitle('Error: You do not have permission to do that')
        .setColor('Red')

        interaction.reply({
            embeds: [embed],
            ephemeral: true 
        })
    }
}