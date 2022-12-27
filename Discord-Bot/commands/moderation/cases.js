const { cmdRun } = require('../../functions/cmdRun.js')
const { MessageEmbed, Permissions } = require('discord.js');
const { connectDb } = require('../../utils/db.js')
const client = require('../../index.js').client

const db = connectDb()

const mainHex = '#d79a61'

exports.casesCmd = async function casesCmd(user,guild,interaction,caseUser) {
    const cmdName = 'cases'

    if (interaction.member.permissions.has(Permissions.FLAGS.MODERATE_MEMBERS)) {
        var collection = db.collection('warns')

        const doc = await collection.find({ user: caseUser.id, guildId: guild.id }).toArray();
        
        if (doc.length == 0) {
            const embed = new MessageEmbed()
            .setTitle(`${caseUser.tag} has no cases`)
            .setColor(mainHex)
            interaction.reply({
                embeds: [embed]
            })
        } else {
            const embed = new MessageEmbed()
            .setTitle(caseUser.tag + "'s Cases")
            .setDescription(doc.length + ' Cases')
            .setColor(mainHex)

            doc.forEach((i) => {
                embed.addField(`Case ${i.caseId}:`, "`\`" + i.reason + "`\`\nMod: <@" + i.moderator + ">")
            })
            

            interaction.reply({
                embeds: [embed]
            })
            cmdRun(user,cmdName)
        }
    }
}