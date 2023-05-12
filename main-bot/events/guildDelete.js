const { consoleWebhookClient, client, db } = require('../index.js');
const { log } = require('../functions/log.js');

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
        content: `\`\`\`${date} ${time}\n\nLEFT GUILD:\nName: ${guild.name}\nID: ${guild.id}\nShard ID: ${guild.shardId}\nOwner ID: ${guild.ownerId}\nMem. Count: ${guild.memberCount.toLocaleString()}/${guild.maximumMembers.toLocaleString()}\`\`\``
    })

    console.log(`Left Guild -- ${guild.name}`)
    
}

exports.guildDeleteEvent = guildDeleteEvent;