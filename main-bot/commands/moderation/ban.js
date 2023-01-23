const { cmdRun } = require('../../functions/cmdRun.js')
const { MessageEmbed, Permissions } = require('discord.js');
const { log } = require('../../functions/log.js');
const client = require('../../index.js').client

const mainHex = '#d79a61'


exports.banCmd = function banCmd(user,guild,interaction,banUser,reason) {
    const cmdName = 'ban'

    if (interaction.member.permissions.has(Permissions.FLAGS.BAN_MEMBERS)) {
        if (user == banUser) {
            const embed = new MessageEmbed()
            .setTitle('Error: You cannot ban yourself.')
            .setColor('RED')
            interaction.reply({
                embeds: [embed],
                ephemeral: true
            })
        } else {
            if (reason == null) {
                const reason = 'None'
                guild.members.ban(banUser).catch(error => {
                    if (error.code == 50013) {
                        const embed = new MessageEmbed()
                        .setTitle('Error: Permissions Error')
                        .setDescription(`Seeds is not high up enough in the role hierarchy to ban <@${banUser.id}>. To fix this, move Seeds to the top of the hierarchy`)
                        .setColor('RED')
                        interaction.reply({
                            embeds: [embed],
                            ephemeral: true
                        })
                    }
                    return
                }).then(() => {
                    const embed = new MessageEmbed()
                    .setTitle('Member Banned')
                    .setDescription(`Banned <@${banUser.id}> with reason` + " `\`" + reason + "`\`")
                    .setColor(mainHex)
                
                    interaction.reply({
                        embeds: [embed]
                    }).catch(error => { })

                    const embed2 = new MessageEmbed()
                    .setTitle(`You have been banned from ${guild.name}`)
                    .setDescription("Reason: `\`" + reason + "`\`")

                    client.users.cache.get(banUser.id).send({
                        embeds: [embed2]
                    }).catch(error => { })
                })
            } else {
                guild.members.ban(banUser, {
                    reason: reason,
                }).catch(error => {
                    if (error.code == 50013) {
                        const embed = new MessageEmbed()
                        .setTitle('Error: Permissions Error')
                        .setDescription(`Seeds is not high up enough in the role hierarchy to ban <@${banUser.id}>. To fix this, move Seeds to the top of the hierarchy`)
                        .setColor('RED')
                        interaction.reply({
                            embeds: [embed],
                            ephemeral: true
                        })
                    }
                    return
                }).then(() => {
                    const embed = new MessageEmbed()
                    .setTitle('Member Banned')
                    .setDescription(`Banned <@${banUser.id}> with reason` + " `\`" + reason + "`\`")
                    .setColor(mainHex)
                
                    interaction.reply({
                        embeds: [embed]
                    }).catch(error => { })

                    const embed2 = new MessageEmbed()
                    .setTitle(`You have been banned from ${guild.name}`)
                    .setDescription("Reason: `\`" + reason + "`\`")

                    client.users.cache.get(banUser.id).send({
                        embeds: [embed2]
                    }).catch(error => { })
                })
            }
            cmdRun(user,cmdName,guild,interaction)
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