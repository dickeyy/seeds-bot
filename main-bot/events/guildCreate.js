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
        large: guild.large,
        vanityUrl: guild.vanityURLCode,
        description: guild.description,
        bannerUrl: guild.banner,
        icon: guild.icon,
        splash: guild.splash,
        shardId: guild.shardId,
        discoverySplash: guild.discoverySplash,
        owner: guild.ownerId,
        afkChannel: guild.afkChannelId,
        afkTimeout: guild.afkTimeout,
        verificationLevel: guild.verificationLevel,
        defaultMessageNotifications: guild.defaultMessageNotifications,
        systemChannel: guild.systemChannelId,
        rulesChannel: guild.rulesChannelId,
        publicUpdatesChannel: guild.publicUpdatesChannelId,
        maxMembers: guild.maximumMembers,
        premiumTier: guild.premiumTier,
        premiumSubscriptionCount: guild.premiumSubscriptionCount,
        explicitContentFilter: guild.explicitContentFilter,
        preferredLocale: guild.preferredLocale,
        features: guild.features,
        mfaLevel: guild.mfaLevel,
        applicationId: guild.applicationId,
        widgetEnabled: guild.widgetEnabled,
        widgetChannel: guild.widgetChannelId,
        systemChannelFlags: guild.systemChannelFlags,
        nsfwLevel: guild.nsfwLevel,
        joinedAt: guild.joinedAt,
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