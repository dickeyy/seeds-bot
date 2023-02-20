const { cmdRun } = require('../../functions/cmdRun.js')
const { EmbedBuilder, Permissions } = require('discord.js');
const { connectDb } = require('../../utils/db.js');
const { log } = require('../../functions/log.js');
const client = require('../../index.js').client

const db = connectDb()

const mainHex = '#d79a61'


exports.warnCmd = async function warnCmd(user,guild,interaction,warnUser,reason) {
    const cmdName = 'warn'

    const caseId = Math.round(Math.random() * 100000)

    const warnData = {
        user: warnUser.id,
        moderator: user.id,
        guildId: guild.id,
        reason: reason,
        caseId: caseId,
    }

    var collection = db.collection('warns')
    await collection.insertOne(warnData)

    const embed = new EmbedBuilder()
    .setTitle('Warned User | Case ID: ' + caseId)
    .setDescription("Warned <@" + warnUser.id + "> with reason `\`" + reason + "`\`")
    .setColor(mainHex)

    interaction.reply({
        embeds: [embed]
    })

    const embed2 = new EmbedBuilder()
    .setTitle('You have been warned in ' + guild.name)
    .setDescription('Reason: `\`' + reason + '`\`')
    .setColor(mainHex)

    client.users.cache.get(warnUser.id).send({
        embeds: [embed2]
    }).catch(error => { 
        embed.setDescription("Warned <@" + warnUser.id + "> with reason `\`" + reason + "`\`\n\n*Could not DM user*")

        interaction.editReply({
            embeds: [embed]
        })
        })

    cmdRun(user,cmdName,guild,interaction)
    
}