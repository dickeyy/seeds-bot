const { connectDb } = require('../utils/db.js');
const { log } = require('../functions/log.js');

const db = connectDb();

const guildDeleteEvent = async (guild) => {
    const collection = db.collection('guilds');
    await collection.deleteOne({ _id: guild.id })

    var logData = `Left Guild -- ${guild.name}\n`
    await log(logData)

    console.log(`Left Guild -- ${guild.name}`)
}

exports.guildDeleteEvent = guildDeleteEvent;