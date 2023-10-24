const { EmbedBuilder, WebhookClient } = require('discord.js');
const { redis, db } = require('../index.js')

const xpCooldown = new Set()

// Colors
const mainHex = '#d79a61'

const coll = db.collection('levels')

const messageCreateEvent = async (message) => {

    // first check if the message is from a bot
    if (message.author.bot) return

    let doc = await redis.hGet('guildXpData', message.guild.id)
    doc = JSON.parse(doc)

    if (!doc) return

    if (!doc.settings.enabled) return

    if (doc.settings.ignoredChannels.includes(message.channel.id)) return

    if (doc.settings.ignoredRoles.some(role => message.member.roles.cache.has(role))) return

    const xp = Math.floor(Math.random() * (doc.settings.xpPerMessageHigh - doc.settings.xpPerMessageLow + 1) + doc.settings.xpPerMessageLow)
    
    if (!xpCooldown.has(`${message.author.id}--${message.guild.id}`)) {
        // userr is not on cooldown
        // add the user to the cooldown
        // xpCooldown.add(`${message.author.id}--${message.guild.id}`)
        // setTimeout(() => {
        //     xpCooldown.delete(`${message.author.id}--${message.guild.id}`)
        // }, doc.settings.xpCooldown * 1000)

        // add the xp
        addXp(message, xp, doc)
    }

}

async function addXp(message, xp, doc) {

    // get the data
    const curve = doc.settings.curve

    // check if the user is in the database
    if (!doc.users[message.author.id]) {
        // the user is not in redis, so we need to add them
        await redis.hSet('guildXpData', message.guild.id, JSON.stringify({ ...doc, users: { ...doc.users, [message.author.id]: { xp: xp, level: 0 } } }))
    }

    const user = doc.users[message.author.id] || { xp: xp, level: 0 }
    const currentLevel = user.level
    const currentXp = user.xp
    
    // calculate the new xp
    const newXp = Number(currentXp + xp)

    // check if the user has leveled up
    const checkOne = currentLevel < curve.length
    const checkTwo = newXp >= curve[currentLevel + 1]
    const checkThree = newXp >= curve[currentLevel]

    if ( checkOne && checkTwo && checkThree ) {

        // the user has leveled up
        // check what the new level is
        let newLevel = 0
        for (let i = 0; i < curve.length; i++) {
            if (newXp >= curve[i]) {
                newLevel = i
            }
        }

        // check if the level up message is enabled
        if (doc.settings.levelUpMessageEnabled) {

            // format the messsage replacing the placeholders
            const levelUpMessage = doc.settings.levelUpMessage
            .replace('{user}', message.author)
            .replace('{level}', newLevel)
            .replace('{xp}', newXp)

            // check if the channel is null (current channel)
            if (doc.settings.levelUpMessageChannel == null) {
                // send the message in the current channel
                message.channel.send(levelUpMessage)
            } else {
                // send the message in the specified channel
                const channel = message.guild.channels.cache.get(doc.settings.levelUpMessageChannel)
                channel.send(levelUpMessage)
            }

        }

        // update redis for the level and xp
        await redis.hSet('guildXpData', message.guild.id, JSON.stringify({ ...doc, users: { ...doc.users, [message.author.id]: { xp: newXp, level: newLevel } } }))

    } else {

        // the user has not leveled up, however we still need to update the xp
        await redis.hSet('guildXpData', message.guild.id, JSON.stringify({ ...doc, users: { ...doc.users, [message.author.id]: { xp: newXp, level: currentLevel } } }))

    }
    
} 

exports.messageCreateEvent = messageCreateEvent;