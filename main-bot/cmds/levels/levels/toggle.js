const { cmdRun } = require('../../../functions/cmdRun.js')
const { EmbedBuilder } = require('discord.js');
const { db, redis } = require('../../../index.js')

const mainHex = '#d79a61'

exports.levelsToggleCmd = async function levelsToggleCmd(user,guild,interaction) {
    const cmdName = 'toggle-levels'

    // const coll = db.collection('levels')
    // const redisDoc = await coll.findOne({ guildId: guild.id })
    let redisDoc = await redis.hGet('guildXpData', guild.id)
    redisDoc = JSON.parse(redisDoc)

    const coll = db.collection('levels')
    let mongoDoc = await coll.findOne({ guildId: guild.id })

    if (redisDoc == null && mongoDoc == null) {
        // the server is not setup yet
        const levelsData = {
            guildId: guild.id,
            settings: {
                enabled: true,
                levelUpMessageEnabled: true,
                levelUpMessageChannel: null,
                levelUpMessage: 'Congrats {user}! You are now level **{level}!**',
                xpPerMessageLow: 10,
                xpPerMessageHigh: 20,
                xpCooldown: 60,
                xpCooldownType: 'seconds',
                ignoredChannels: [],
                ignoredRoles: [],
                rewardRoles: {
                    enabled: false,
                    roles: []
                },
                rewardRolesType: 'add',
                webLeaderboardEnabled: true,
                rankCardSettings: {
                    accentColor: mainHex,
                    backgroundColor: '#0e0e10',
                    usernameColor: '#ffffff',
                },
                curve: calculateCurve()
            },
            users: {
                // userId: {
                //     xp: 0,
                //     level: 0
                // }
            }
        }

        redis.hSet('guildXpData', guild.id, JSON.stringify(levelsData))

        const embed = new EmbedBuilder()
        .setTitle('Enabled Levels')
        .setDescription('Levels have been enabled for this server! \nCheck your settings with </levels settings:1100506205056663673>\n\n**Note:** Settings can only be edited on the [Dashboard](https://seedsbot.xyz/login)')
        .setColor(mainHex)

        interaction.reply({
            embeds: [embed]
        })
    } else {
        // the server is setup in either redis or mongo
        if (redisDoc == null) {
            // the server is setup in mongo so we need to add it to redis
            redis.hSet('guildXpData', guild.id, JSON.stringify(mongoDoc))
        } 
        // if the server is setup in redis we don't need to do anything, we only need to fix it if it is in mongo not redis
        // the server is already setup we need to check if it is enabled or not
        if (redisDoc.settings.enabled) {
            // it is enabled so we need to disable it
            redis.hSet('guildXpData', guild.id, JSON.stringify({ ...redisDoc, settings: { ...redisDoc.settings, enabled: false } }))

            const embed = new EmbedBuilder()
            .setTitle('Disabled Levels')
            .setDescription('Levels have been disabled for this server!')
            .setColor(mainHex)

            interaction.reply({
                embeds: [embed]
            })
        } else {
            // it is disabled so we need to enable it
            redis.hSet('guildXpData', guild.id, JSON.stringify({ ...redisDoc, settings: { ...redisDoc.settings, enabled: true } }))

            const embed = new EmbedBuilder()
            .setTitle('Enabled Levels')
            .setDescription('Levels have been enabled for this server! \nCheck your settings with </levels settings:1100506205056663673>\n\n**Note:** Settings can only be edited on the [Dashboard](https://seedsbot.xyz/login)')
            .setColor(mainHex)

            interaction.reply({
                embeds: [embed]
            })
        }
    }

    cmdRun(user,cmdName,guild,interaction)
}

const calculateCurve = () => {
    // the curve is a set of unique numbers that are used to calculate the xp needed for each level
    
    let curve = new Set()

    for (let i = 0; i <= 500; i++) {
        curve.add(Math.floor(i * i * 100))
    }

    return Array.from(curve)
    
}