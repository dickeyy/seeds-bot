const { cmdRun } = require('../../functions/cmdRun.js')
const { MessageEmbed, Permissions } = require('discord.js');
const client = require('../../index.js').client

const mainHex = '#d79a61'

exports.unbanCmd = function unbanCmd(user,guild,interaction,unbanUser) {
    const cmdName = 'unban'

    if (interaction.member.permissions.has(Permissions.FLAGS.BAN_MEMBERS)) {
        guild.members.unban(unbanUser).catch(error => {
            if (error.code == 10026) {
                const embed = new MessageEmbed()
                .setTitle('Error: That person is not banned')
                .setColor('RED')
                interaction.reply({
                    embeds: [embed],
                    ephemeral: true
                })
            } else {
                console.log(error)
            }
        }).then(() => {
            const embed = new MessageEmbed()
            .setTitle('Unbanned Member')
            .setDescription(`Unbanned <@${unbanUser}>`)
            .setColor(mainHex)
    
            interaction.reply({
                embeds: [embed]
            }).catch(error => { })
            cmdRun(user,cmdName)
        })

    } else {
        const embed = new MessageEmbed()
        .setTitle('Error: You do not have permission to do that')
        .setColor('RED')

        interaction.reply({
            embeds: [embed],
            ephemeral: true 
        })
    }
}