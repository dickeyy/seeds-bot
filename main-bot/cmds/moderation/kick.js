const { cmdRun } = require('../../functions/cmdRun.js')
const { EmbedBuilder } = require('discord.js');

const mainHex = '#d79a61'

exports.kickCmd = function kickCmd(user,guild,interaction,kickUser, reason) {
    const cmdName = 'kick'

    if (reason == null) reason = 'None';

    if (true) {
        if (user == kickUser) {
            const embed = new EmbedBuilder()
            .setTitle('Error: You cannot kick yourself.')
            .setColor('Red')
            interaction.reply({
                embeds: [embed],
                ephemeral: true
            })
        } else {
            guild.members.kick(kickUser, {
                reason: reason
            }).catch(error => {
                if (error.code == 50013) {
                    const embed = new EmbedBuilder()
                    .setTitle('Error: Permissions Error')
                    .setDescription('To fix this move Seeds to the top of the role hierarchy')
                    .setColor('Red')
                    interaction.reply({
                        embeds: [embed],
                        ephemeral: true
                    }).catch(error => { })
                } else {
                    console.log(error)
                }
            }).then(() => {
                const embed = new EmbedBuilder()
                .setTitle('Kicked Member')
                .setDescription('Kicked <@' + kickUser.id + "> with reason `\`" + reason + "`\`")
                .setColor(mainHex)
    
                interaction.reply({
                    embeds: [embed]
                }).catch(error => { })

                cmdRun(user,cmdName,guild,interaction)
            })
        }
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