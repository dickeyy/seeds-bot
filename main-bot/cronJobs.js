const cron = require('cron');
const { client } = require('./index.js');
const { connectDb } = require('./utils/db.js');

const db = connectDb()

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