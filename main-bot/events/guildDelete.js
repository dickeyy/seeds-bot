const { connectDb } = require('../utils/db.js');
const { log } = require('../functions/log.js');
const { consoleWebhookClient, client } = require('../index.js');

const db = connectDb();

const guildDeleteEvent = async (guild) => {

    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

    const collection = db.collection('guilds');
    await collection.deleteOne({ _id: guild.id })
    await db.collection('logSettings').deleteOne({ guildId: guild.id })
    await db.collection('reportChannels').deleteOne({ guildId: guild.id })
    await db.collection('reports').deleteMany({ guildId: guild.id })
    await db.collection('warns').deleteMany({ guildId: guild.id })
    await db.collection('economy').deleteOne({ guildId: guild.id })

    var logData = `Left Guild -- ${guild.name}\n`
    log('info', logData)

    consoleWebhookClient.send({
        avatarURL: client.user.displayAvatarURL(),
        username: 'Console',
        content: `\`\`\`${date} ${time} | ${logData}\`\`\``
    })

    console.log(`Left Guild -- ${guild.name}`)
    
}

exports.guildDeleteEvent = guildDeleteEvent;