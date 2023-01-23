const { cmdRun } = require('../../functions/cmdRun.js')
const { MessageEmbed } = require('discord.js');
const { connectDb } = require('../../utils/db.js');
const { log } = require('../../functions/log.js');

const mainHex = '#d79a61'

const db = connectDb()


exports.alertCmd = async function alertCmd(user,guild,interaction) {
    const cmdName = 'alert'

    const coll = db.collection('alerts')

    const doc = await coll.find({ active: true }).toArray()

    if (doc.length == 0) {
        const embed = new MessageEmbed()
        .setTitle('You Have No Unread Alerts!')
        .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL() })
        .setColor('NOT_QUITE_BLACK')

        interaction.reply({
            embeds: [embed],
            ephemeral: true
        })

        cmdRun(user,cmdName,guild,interaction)
        return
    }

    const embed = new MessageEmbed()
    .setTitle('Message(s) From the Developers')
    .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL() })
    .setColor('NOT_QUITE_BLACK')

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