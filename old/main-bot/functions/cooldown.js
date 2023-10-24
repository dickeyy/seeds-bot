const { redis } = require('../index.js');

const cdList = ['Chill Out', 'CHILLLLL', 'Stop.', 'Take a Breather', 'ok', 'Spamming commands is cringe', 'Slow it down', 'Wee-Woo-Wee-Woo Pull Over', 'No :)', '-_-', 'Why tho...', 'Yikes U Should Like Not', 'Slow it Cowboy', 'Take a Break Bro', 'Go Touch Some Grass']

const cooldownAdd = async (user, command, guild, cooldownStr) => {
    // check if the user is on a cooldown already for that command and guild
    if (await cooldownCheck(user, command, guild)) {
        return
    }

    // convert the cooldown string to seconds
    const cooldownLength = convertStringToSeconds(cooldownStr)

    // add the user to the cooldown
    await redis.setEx(`${user.id}-${command}-${guild.id}`, cooldownLength, 'cooldown').then(() => {
        console.log(`${user.tag} is now on cooldown for ${command} in ${guild.id} for ${cooldownLength} seconds`)
    })
}

const cooldownCheck = async (user, command, guild) => {
    return new Promise((resolve, reject) => {
        redis.get(`${user.id}-${command}-${guild.id}`).then((res) => {
            if (res == null) {
                resolve(false)
            } else {
                resolve(true)
            }
        })
    })
}

const cooldownRemove = async (user, command, guild) => {
    redis.del(`${user.id}-${command}-${guild.id}`).then(() => {
        console.log(`${user.tag} is no longer on cooldown for ${command} in ${guild.name}`)
    })
}

const cooldownCheckTime = async (user, command, guild) => {
    return new Promise((resolve, reject) => {
        redis.ttl(`${user.id}-${command}-${guild.id}`).then((res) => {
            resolve(res)
        })
    })
}

const convertStringToSeconds = (string) => {

    const tenSecCooldown = 10;
    const thirtySecCooldown = tenSecCooldown * 3;
    const oneMinCooldown = thirtySecCooldown * 2;
    const twoMinCooldown = oneMinCooldown * 2;
    const fiveMinCooldown = oneMinCooldown * 5; 
    const tenMinCooldown = fiveMinCooldown * 2 ; 
    const thirtyMinCooldown = tenMinCooldown * 3;
    const oneHourCooldown = thirtyMinCooldown * 2;
    const twelveHourCooldown = oneHourCooldown * 12;
    const OneDayCooldown = twelveHourCooldown * 2;
    const OneWeekCooldown = OneDayCooldown * 7;

    if (string == 'tenSec') return tenSecCooldown
    else if (string == 'thirtySec') return thirtySecCooldown
    else if (string == 'oneMin') return oneMinCooldown
    else if (string == 'twoMin') return twoMinCooldown
    else if (string == 'fiveMin') return fiveMinCooldown
    else if (string == 'tenMin') return tenMinCooldown
    else if (string == 'thirtyMin') return thirtyMinCooldown
    else if (string == 'oneHour') return oneHourCooldown
    else if (string == 'twelveHour') return twelveHourCooldown
    else if (string == 'oneDay') return OneDayCooldown
    else if (string == 'oneWeek') return OneWeekCooldown
}

exports.cooldownCheckTime = cooldownCheckTime;
exports.cdList = cdList;
exports.cooldownAdd = cooldownAdd;
exports.cooldownCheck = cooldownCheck;
exports.cooldownRemove = cooldownRemove;