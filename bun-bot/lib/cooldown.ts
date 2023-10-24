import { Guild, User, time } from "discord.js";
import { redis } from "../bot";
import embedBuilder from "./embedBuilder";

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
    if (duration == 'oneSec') return 1
    else if (duration == 'fiveSec') return 5
    else if (duration == 'tenSec') return 10
    else if (duration == 'thirtySec') return 30
    else if (duration == 'oneMin') return 60
    else if (duration == 'twoMin') return 120
    else if (duration == 'fiveMin') return 60 * 5
    else if (duration == 'tenMin') return 60 * 10
    else if (duration == 'thirtyMin') return 60 * 30
    else if (duration == 'oneHour') return 60 * 60
    else if (duration == 'twelveHour') return 60 * 60 * 12
    else if (duration == 'oneDay') return 60 * 60 * 24
    else if (duration == 'oneWeek') return 60 * 60 * 24 * 7
}

function randCDMessage() {
    const random = Math.floor(Math.random() * cdList.length);
    return cdList[random];
}

async function checkTimeRemaining(userId:string, cmdName:string, guildId:string) {
    const timeRemaining = await redis.ttl(`${userId}-${cmdName}-${guildId}`);
    return timeRemaining;
}

async function tellOnCooldown(interaction:any) {

    const timeRemaining = await checkTimeRemaining(interaction.user.id, interaction.commandName, interaction.guildId);
    const message = randCDMessage();

    const dateReady = new Date(Date.now() + timeRemaining * 1000);

    const embed = {
        description: `${message}\nYou can use this command again ${time(dateReady, "R")}.`,
        color: "Red"
    }

    await interaction.reply({ embeds: [ embedBuilder(embed as any) ], ephemeral: true });

}

export { addCooldown, isOnCooldown, randCDMessage, checkTimeRemaining, tellOnCooldown }