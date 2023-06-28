const { log } = require('../functions/log.js');
const { consoleWebhookClient, client, db } = require('../index.js')

const guildCreateEvent = async (guild) => {

    let today = new Date();
    let date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

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

    let collection = db.collection('guilds')
    await collection.insertOne(guildData)

    let logData = `New Guild -- ${guild.name}\n`
    log('info',logData)

    consoleWebhookClient.send({
        avatarURL: client.user.displayAvatarURL(),
        username: 'Console',
        content: `\`\`\`${date} ${time}\n\nNEW GUILD:\nName: ${guild.name}\nID: ${guild.id}\nShard ID: ${guild.shardId}\nOwner ID: ${guild.ownerId}\nMem. Count: ${guild.memberCount.toLocaleString()}/${guild.maximumMembers.toLocaleString()}\`\`\``
    })

    console.log(`New Guild -- ${guild.name}`)

    // update channel label for guild count
    let guildCount = client.guilds.cache.size
    let guildCountChannel = client.channels.cache.get('1123601662846714018')
    guildCountChannel.setName(`${guildCount.toLocaleString()} servers`)
}

exports.guildCreateEvent = guildCreateEvent;