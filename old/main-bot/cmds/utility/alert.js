const { cmdRun } = require('../../functions/cmdRun.js')
const { EmbedBuilder } = require('discord.js');
const { db } = require('../../index.js')

const mainHex = '#d79a61'

exports.alertCmd = async function alertCmd(user,guild,interaction) {
    const cmdName = 'alert'

    const coll = db.collection('alerts')

    const doc = await coll.find({ active: true }).toArray()

    if (doc.length == 0) {
        const embed = new EmbedBuilder()
        .setTitle('You Have No Unread Alerts!')
        .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL() })
        .setColor('NotQuiteBlack')

        interaction.reply({
            embeds: [embed],
            ephemeral: true
        })

        cmdRun(user,cmdName,guild,interaction)
        return
    }

    const embed = new EmbedBuilder()
    .setTitle('Message(s) From the Developers')
    .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL() })
    .setColor('NotQuiteBlack')

    let message = ''

    for (var i = 0; i < doc.length; i++) {
        var alert = doc[i]

        if (alert.viewedBy.includes(user.id)) {
            continue
        } else {
            let views = (alert.viewedBy.length + 1).toLocaleString()
            message = message + `\n\n**\`-->\` ${alert.alertTitle}**\n${alert.alertMessage}\n\nViews: ${views}`
        
            var viewedBy = alert.viewedBy
            viewedBy.push(user.id)

            await coll.updateOne({ alertId: alert.alertId }, { $set: { viewedBy: viewedBy } })
        }
    }

    if (message == '') {
        embed.setTitle('You Have No Unread Alerts!')
    }

    embed.setDescription(message)

    interaction.reply({
        embeds: [embed],
        ephemeral: true
    })

    cmdRun(user,cmdName,guild,interaction)
}