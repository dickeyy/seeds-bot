const { cmdRun } = require('../../functions/cmdRun.js')
const { EmbedBuilder } = require('discord.js');
const { db } = require('../../index.js')

const mainHex = '#d79a61'

exports.deletecaseCmd = async function deletecaseCmd(user,guild,interaction,caseId) {
    const cmdName = 'deletecase'

    if (true) {
        var collection = db.collection('warns')
        await collection.deleteOne({ caseId: caseId, guildId: guild.id }).then(() => {
            const embed = new EmbedBuilder()
            .setTitle('Deleted Case ' + caseId)
            .setColor(mainHex)
    
            interaction.reply({
                embeds: [embed]
            })
    
            cmdRun(user,cmdName,guild,interaction)
        })
    }
}