const cron = require('cron');
const { MessageEmbed, MessageAttachment } = require('discord.js');
const { log } = require('./functions/log.js');
const { client, consoleWebhookClient } = require('./index.js');
const { connectDb } = require('./utils/db.js');
const fs = require('fs');

const db = connectDb()

// Process errors
process.on('uncaughtException', async function (error) {
    console.log('error', error.stack)

    log('error', error.stack)
});

exports.refreshHistory = new cron.CronJob('0 0 * * *', async () => {

    // This runs every day at 10:30:00, you can do anything you want
    const collection = db.collection('guilds');
    const guilds =  await collection.find({}).toArray()

    var gCount = 0
    var mCount = 0
    gCount = client.guilds.cache.size + gCount

    for (var i = 0; i < guilds.length; i++) {
        const guild = guilds[i]
        const server = client.guilds.cache.get(guild.id)
        if (server !== undefined) {
            mCount = server.memberCount + mCount
        }
    }

    const hisDataColl = db.collection('historicalData')
    await hisDataColl.updateOne({ type: 'guildData' }, { $set: { guildCount: gCount, userCount: mCount } })

    console.log('Updated historical data')

});

exports.clearLogs = new cron.CronJob('0 0 * * *', async () => {

    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

    fs.readFile('./logs/combined.log', function (err, data) {
        if (err) {
          console.log(err)
          return
        }
    
        let file = new MessageAttachment(Buffer.from(data), 'combined-logs.json', { contentType: 'application/json' })
    
        consoleWebhookClient.send({
            avatarURL: client.user.displayAvatarURL(),
            username: 'Console',
            content: `\`\`\`${date} ${time} | Combined Logs\`\`\``,
            files: [file],
        })
    
    })

    fs.readFile('./logs/error.log', function (err, data) {
        if (err) {
          console.log(err)
          return
        }
    
        let file2 = new MessageAttachment(Buffer.from(data), 'error-logs.json', { contentType: 'application/json' })
    
        consoleWebhookClient.send({
            avatarURL: client.user.displayAvatarURL(),
            username: 'Console',
            content: `\`\`\`${date} ${time} | Error Logs\`\`\``,
            files: [file2],
        })
    
    })


    setTimeout(() => {

        // then, clear the logs
        fs.writeFileSync('./logs/combined.log', '')
        fs.writeFileSync('./logs/error.log', '')

        console.log('Cleared logs')

        consoleWebhookClient.send({
            avatarURL: client.user.displayAvatarURL(),
            username: 'Console',
            content: `\`\`\`${date} ${time} | Cleared logs\`\`\``,
        })
    }, 3000)
});