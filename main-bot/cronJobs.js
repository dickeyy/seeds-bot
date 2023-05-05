const cron = require('cron');
const { EmbedBuilder, AttachmentBuilder } = require('discord.js');
const { log } = require('./functions/log.js');
const { client, consoleWebhookClient, redis, db } = require('./index.js');
const fs = require('fs');

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
// '0 0 * * *'
exports.clearLogs = new cron.CronJob('0 0 * * *', async () => {

    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

    fs.readFile('./logs/combined.log', function (err, data) {
        if (err) {
          console.log(err)
          return
        }
    
        let file = new AttachmentBuilder(Buffer.from(data), {
            name: 'combined-logs.json',
            description: 'Combined logs'
        })
    
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
    
        let file2 = new AttachmentBuilder(Buffer.from(data), {
            name: 'error-logs.json',
            description: 'Error logs'
        })
    
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

// redis backup to mongo every 20 minutes
exports.redisBackup = new cron.CronJob('*/30 * * * *', async () => {

    // for now, we know that we only need to update guildXpData
    let guildXpData = await redis.hGetAll('guildXpData')

    const coll = db.collection('levels')

    for (let [key, value] of Object.entries(guildXpData)) {

        // convert the value to an object
        value = JSON.parse(value)

        // check if the guild exists in the database 
        if (await coll.findOne({ guildId: key }) === null) {
            // if it doesn't exist, create it
            await coll.insertOne({
                _id: key,
                guildId: key,
                ...value,
            })
        } else {
            // if it does exist, delete it and create a new one
            // delete the document from the database
            await coll.deleteOne({ guildId: key })

            await coll.insertOne({
                _id: key,
                guildId: key,
                ...value,
            })
        }
    }

});