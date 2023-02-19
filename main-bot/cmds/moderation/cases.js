const { cmdRun } = require('../../functions/cmdRun.js')
const { EmbedBuilder, Permissions } = require('discord.js');
const { connectDb } = require('../../utils/db.js');
const { log } = require('../../functions/log.js');
const client = require('../../index.js').client

const db = connectDb()

const mainHex = '#d79a61'


exports.casesCmd = async function casesCmd(user,guild,interaction,caseUser) {
    const cmdName = 'cases'

    if (true) {
        var collection = db.collection('warns')

        const doc = await collection.find({ user: caseUser.id, guildId: guild.id }).toArray();
        
        if (doc.length == 0) {
            const embed = new EmbedBuilder()
            .setTitle(`${caseUser.tag} has no cases`)
            .setColor(mainHex)
            interaction.reply({
                embeds: [embed]
            })
        } else {
            const embed = new EmbedBuilder()
            .setTitle(caseUser.tag + "'s Cases")
            .setDescription(doc.length + ' Cases')
            .setColor(mainHex)

            doc.forEach((i) => {
                embed.addFields({name:`Case ${i.caseId}:`, value:"`\`" + i.reason + "`\`\nMod: <@" + i.moderator + ">"})
            })
            

            interaction.reply({
                embeds: [embed]
            })
            cmdRun(user,cmdName,guild,interaction)
        }
    }
}