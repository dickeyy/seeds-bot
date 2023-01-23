const { connectDb } = require('../utils/db.js');
const { log } = require('../functions/log.js');
const { consoleWebhookClient, client } = require('../index.js')

const db = connectDb();

const guildCreateEvent = async (guild) => {

    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

    const isPartnered = guild.partnered
    var today = new Date();
    const guildData = {
        _id: guild.id,
        id: guild.id,
        name: guild.name,
        description: guild.description,
        memberCount: guild.memberCount,
        large: guild.large,
        vanityUrl: guild.vanityURLCode,
        joinedAt: today,
        ownerId: guild.ownerId,
        shardId: guild.shardId,
        bannerUrl: guild.banner,
        features: guild.features,
        icon: guild.icon,
        maxMembers: guild.maximumMembers,
        partnered: isPartnered,
    }

    var collection = db.collection('guilds')
    await collection.insertOne(guildData)

    var logData = `New Guild -- ${guild.name}\n`
    log('info',logData)

    consoleWebhookClient.send({
        avatarURL: client.user.displayAvatarURL(),
        username: 'Console',
        content: `\`\`\`${date} ${time} | ${logData}\`\`\``
    })

    console.log(`New Guild -- ${guild.name}`)
}

exports.guildCreateEvent = guildCreateEvent;