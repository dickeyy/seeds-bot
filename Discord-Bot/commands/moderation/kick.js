const { cmdRun } = require('../../functions/cmdRun.js')
const { MessageEmbed, Permissions } = require('discord.js');

const mainHex = '#d79a61'

exports.kickCmd = function kickCmd(user,guild,interaction,kickUser, reason) {
    const cmdName = 'kick'

    if (reason == null) reason = 'None';

    if (interaction.member.permissions.has(Permissions.FLAGS.KICK_MEMBERS)) {
        if (user == kickUser) {
            const embed = new MessageEmbed()
            .setTitle('Error: You cannot kick yourself.')
            .setColor('RED')
            interaction.reply({
                embeds: [embed],
                ephemeral: true
            })
        } else {
            guild.members.kick(kickUser, {
                reason: reason
            }).catch(error => {
                if (error.code == 50013) {
                    const embed = new MessageEmbed()
                    .setTitle('Error: Permissions Error')
                    .setDescription('To fix this move Seeds to the top of the role hierarchy')
                    .setColor('RED')
                    interaction.reply({
                        embeds: [embed],
                        ephemeral: true
                    }).catch(error => { })
                } else {
                    console.log(error)
                }
            }).then(() => {
                const embed = new MessageEmbed()
                .setTitle('Kicked Member')
                .setDescription('Kicked <@' + kickUser.id + "> with reason `\`" + reason + "`\`")
                .setColor(mainHex)
    
                interaction.reply({
                    embeds: [embed]
                }).catch(error => { })

                cmdRun(user,cmdName)
            })
        }
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