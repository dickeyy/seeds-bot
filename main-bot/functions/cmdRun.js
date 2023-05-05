const { client, consoleWebhookClient, db } = require('../index.js');
const { EmbedBuilder } = require('discord.js');
const { log } = require('./log.js');

// Process errors
process.on('uncaughtException', async function (error) {
    console.log('error', error.stack)

    log('error', error.stack)
});

const cmdRun = async (user,cmdName,guild,interaction) => {
    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

    var collection = db.collection('commands')
    const doc = await collection.find({ name: cmdName }).toArray();

    log('info',`${user.tag} - ${cmdName}`)

    if (doc.length == 0) {
        const cmdData = {
            name: cmdName,
            runCount: 1
        }
        await collection.insertOne(cmdData)
    } else {
        var runCount = doc[0].runCount
        runCount ++ 

        await collection.updateOne({ name: cmdName }, { $set: { runCount: runCount }})
    }

    console.log(`${date} ${time} | ${user.tag} - ${cmdName}`)

    consoleWebhookClient.send({
        avatarURL: client.user.displayAvatarURL(),
        username: 'Console',
        content: `\`\`\`${date} ${time} | ${user.tag} - ${cmdName}\`\`\``
    })
    
    // Check if the user has any alerts
    if (cmdName == 'alert') {
        return
    }

    var alertColl = db.collection('alerts')

    const alertDoc = await alertColl.find({ active: true }).toArray()

    if (alertDoc.length == 0) {
        return
    }

    for (var i = 0; i < alertDoc.length; i++) {
        var alert = alertDoc[i]

        if (alert.viewedBy.includes(user.id)) {
            continue
        } else {
            const embed = new EmbedBuilder()
            .setTitle('You Have An Unread Alert!')
            .setDescription('Use `\`/alert`\` to read it!')
            .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL() })
            .setTimestamp()
            .setThumbnail('https://cdn1.iconfinder.com/data/icons/aami-flat-emails/64/email-47-512.png')
            .setColor('#23272A')

            setTimeout(() => {
                interaction.followUp({
                    embeds: [embed],
                    content: `<@${user.id}>`,
                    ephemeral: true
                })
            }, 1000)
        }
    }
}

exports.cmdRun = cmdRun;