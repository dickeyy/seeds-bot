const { cmdRun } = require('../../functions/cmdRun.js')
const { MessageEmbed, Permissions } = require('discord.js');
const { connectDb } = require('../../utils/db.js')
const client = require('../../index.js').client

const db = connectDb()

const mainHex = '#d79a61'

exports.deletecaseCmd = async function deletecaseCmd(user,guild,interaction,caseId) {
    const cmdName = 'deletecase'

    if (interaction.member.permissions.has(Permissions.FLAGS.MODERATE_MEMBERS)) {
        var collection = db.collection('warns')
        await collection.deleteOne({ caseId: caseId, guildId: guild.id }).then(() => {
            const embed = new MessageEmbed()
            .setTitle('Deleted Case ' + caseId)
            .setColor(mainHex)
    
            interaction.reply({
                embeds: [embed]
            })
    
            cmdRun(user,cmdName,guild,interaction)
        })
    }
}