const { connectDb } = require('../utils/db.js');
const { log } = require('../functions/log.js');

const db = connectDb();

const guildDeleteEvent = async (guild) => {
    const collection = db.collection('guilds');
    await collection.deleteOne({ _id: guild.id })
    await db.collection('logSettings').deleteOne({ guildId: guild.id })
    await db.collection('reportChannels').deleteOne({ guildId: guild.id })
    await db.collection('reports').deleteMany({ guildId: guild.id })
    await db.collection('warns').deleteMany({ guildId: guild.id })
    await db.collection('economy').deleteOne({ guildId: guild.id })

    var logData = `Left Guild -- ${guild.name}\n`
    await log(logData)

    console.log(`Left Guild -- ${guild.name}`)
}

exports.guildDeleteEvent = guildDeleteEvent;