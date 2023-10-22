import { Guild, User } from "discord.js";
import { redis } from "../bot";

const cdList = ['Chill Out', 'CHILLLLL', 'Stop.', 'Take a Breather', 'ok', 'Spamming commands is cringe', 'Slow it down', 'Wee-Woo-Wee-Woo Pull Over', 'No :)', '-_-', 'Why tho...', 'Yikes U Should Like Not', 'Slow it Cowboy', 'Take a Break Bro', 'Go Touch Some Grass']

async function addCooldown(user:User, cmdName:string, guild:Guild, duration:string) {

    // check if the user is already on cooldown
    if (await isOnCooldown(user.id, cmdName, guild.id)) return false;

    // convert the cooldown duration to seconds
    const durationSeconds:any = convertCooldown(duration);

    // add the user to redis cooldown
    const addToRedis = await redis.setEx(`${user.id}-${cmdName}-${guild.id}`, durationSeconds, 'cooldown')
    if (addToRedis == 'OK') return true;
    return false;
}   

async function isOnCooldown(userId:string, cmdName:string, guildId:string) {

    // check if the user is on cooldown
    const onCooldown = await redis.get(`${userId}-${cmdName}-${guildId}`);
    if (onCooldown) return true;
    return false;

}

function convertCooldown(duration:string) {
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

    if (duration == 'tenSec') return tenSecCooldown
    else if (duration == 'thirtySec') return thirtySecCooldown
    else if (duration == 'oneMin') return oneMinCooldown
    else if (duration == 'twoMin') return twoMinCooldown
    else if (duration == 'fiveMin') return fiveMinCooldown
    else if (duration == 'tenMin') return tenMinCooldown
    else if (duration == 'thirtyMin') return thirtyMinCooldown
    else if (duration == 'oneHour') return oneHourCooldown
    else if (duration == 'twelveHour') return twelveHourCooldown
    else if (duration == 'oneDay') return OneDayCooldown
    else if (duration == 'oneWeek') return OneWeekCooldown
}

function randCDMessage() {
    const random = Math.floor(Math.random() * cdList.length);
    return cdList[random];
}

async function checkTimeRemaining(userId:string, cmdName:string, guildId:string) {
    const timeRemaining = await redis.ttl(`${userId}-${cmdName}-${guildId}`);
    return timeRemaining;
}

export { addCooldown, isOnCooldown, randCDMessage, checkTimeRemaining }