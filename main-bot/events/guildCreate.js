const { connectDb } = require('../utils/db.js');
const { log } = require('../functions/log.js');

const db = connectDb();

const guildCreateEvent = async (guild) => {
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
    await log(logData)

    console.log(`New Guild -- ${guild.name}`)
}

exports.guildCreateEvent = guildCreateEvent;