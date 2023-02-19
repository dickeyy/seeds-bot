const client = require('../index.js').client
const devMode = require('../index.js').devMode
const { connectDb } = require('../utils/db.js');
const { log } = require('../functions/log.js');

const db = connectDb();

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

            const isPartnered = guild.partnered
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

            if (!gIdArray.includes(guild.id)) {
                console.log(`Adding guild ${guild.name} to database...`)
                log('info', `Adding guild ${guild.name} to database...`)

                var collection = db.collection('guilds')
                await collection.insertOne(guildData)
            }

        })

        if (client.guilds.cache.length < gIdArray.length) {
            console.log('Removing extra guild from database...')
            log('info', 'Removing extra guilds from database...')

            await db.collection('guilds').deleteMany({ id: { $nin: client.guilds.cache.map(g => g.id) } })
        }
    }

    console.log('Guilds and DB are synced.')
    log('info', 'Guilds and DB are synced.')

    client.user.setActivity('/help', { type: 'LISTENING' }); 

    console.log(`Logged in as: ${client.user.tag}`)
    log('info', `Logged in as: ${client.user.tag}`)
}

exports.readyEvent = readyEvent;