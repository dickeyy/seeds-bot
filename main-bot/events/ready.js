const { ActivityType } = require('discord.js');
const { log } = require('../functions/log.js');
const { client, db, devMode, sql } = require('../index.js')

const readyEvent = async function readyEvent() {

    if (!devMode) {
        let gIdArray = []
        const today = new Date()

        console.log('Loading guild data...')
        log('info', 'Loading guild data...')

        await db.collection('guilds').find({}).toArray().then(async (guilds) => {
            for (let i = 0; i < guilds.length; i++) {
                let guild = guilds[i]
                let guildId = guild.id
                gIdArray.push(guildId)
            }
        })

        console.log('Checking for missing guilds...')
        log('info', 'Checking for missing guilds...')

        client.guilds.cache.forEach(async (guild) => {

            const guildData = {
                _id: guild.id,
                id: guild.id,
                name: guild.name,
                memberCount: guild.memberCount,
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

            if (!gIdArray.includes(guild.id)) {
                console.log(`Adding guild ${guild.name} to database...`)
                log('info', `Adding guild ${guild.name} to database...`)

                var collection = db.collection('guilds')
                await collection.insertOne(guildData)
            }

        })

        if (client.guilds.cache.size < gIdArray.length) {
            console.log('Removing extra guild from database...')
            log('info', 'Removing extra guilds from database...')

            await db.collection('guilds').deleteMany({ id: { $nin: client.guilds.cache.map(g => g.id) } })
        }
    }

    // then report that the guilds and db are synced

    console.log('Guilds and DB are synced.')
    log('info', 'Guilds and DB are synced.')

    // Set the bots activity
    client.user.setPresence({
        activities: [{
            name: '/help | seedsbot.xyz',
            type: ActivityType.Watching,
            status: 'online'
        }]
    })

    // update channel label for guild count
    let guildCount = client.guilds.cache.size
    let guildCountChannel = client.channels.cache.get('1123601662846714018')
    guildCountChannel.setName(`Servers: ${guildCount.toLocaleString()}`)

    console.log(`Logged in as: ${client.user.tag}`)
    log('info', `Logged in as: ${client.user.tag}`)
}

exports.readyEvent = readyEvent;