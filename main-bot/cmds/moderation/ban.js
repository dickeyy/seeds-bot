const { cmdRun } = require('../../functions/cmdRun.js')
const { EmbedBuilder } = require('discord.js');
const { client, db } = require('../../index.js')

const mainHex = '#d79a61'

exports.banCmd = function banCmd(user,guild,interaction,banUser,reason,deleteHours) {
    const cmdName = 'ban'

    // make sure the user isnt banning themselves
    if (banUser.id == user.id) {
        let errorEmbed1 = new EmbedBuilder()
        .setTitle('Error: You cannot ban yourself.')
        .setColor('Red')

        return interaction.reply({
            embeds: [errorEmbed1],
            ephemeral: true
        })
    }

    // check if there is a reason, if not set a default one
    if (reason == null) {
        reason = 'No reason provided'
    }

    // ban the user
    guild.members.ban(banUser, {
        reason: reason,

        // deleteHours is in hours, so we need to convert it to seconds
        deleteMessageSeconds: deleteHours * 3600 || 60*60

    }).catch(error => {
        // if the bot doesnt have permissions to ban the user
        if (error.code == 50013) {
            let errorEmbed2 = new EmbedBuilder()
            .setTitle('Error: Permissions Error')
            .setDescription(`Seeds is not high up enough in the role hierarchy to ban <@${banUser.id}>. To fix this, move Seeds to the top of the hierarchy`)
            .setColor('Red')

            return interaction.reply({
                embeds: [errorEmbed2],
                ephemeral: true
            })
        }
    }).then(() => {

        // create a case for the user so mods can check it easily
        const caseId = Math.round(Math.random() * 100000)

        const warnData = {
            user: banUser.id,
            moderator: user.id,
            guildId: guild.id,
            reason: `Banned with reason: ${reason}`,
            caseId: caseId,
        }
    
        var collection = db.collection('warns')
        collection.insertOne(warnData).then(() => {

            let banEmbed = new EmbedBuilder()
            .setTitle('Member Banned')
            .setDescription(`Banned <@${banUser.id}> with reason` + " `\`" + reason + "`\`\n" + `Deleted messages from the past \`${deleteHours || 1}\` hours`)
            .setAuthor({ name: banUser.tag, iconURL: banUser.displayAvatarURL() })
            .setTimestamp()
            .setColor(mainHex)

            interaction.reply({
                embeds: [banEmbed]
            }).catch(error => { })

            let banDMEmbed = new EmbedBuilder()
            .setTitle(`You have been banned from ${guild.name}`)
            .setDescription("Reason: `\`" + reason + "`\`")
            .setTimestamp()
            .setColor('Red')

            client.users.cache.get(banUser.id).send({
                embeds: [banDMEmbed]
            }).catch(error => { 
                if (error.code == 50007) {
                    banEmbed.setDescription(`Banned <@${banUser.id}> with reason` + " `\`" + reason + "`\`\n" + `Deleted messages from the past \`${deleteHours || 1}\` hours` + "\n\n" + `*Could not DM user.*`)
                    interaction.editReply({
                        embeds: [banEmbed]
                    })
                }
            })
            
        })

    })

    cmdRun(user, cmdName,guild,interaction)

}