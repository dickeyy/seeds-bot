const { cmdRun } = require('../../functions/cmdRun.js')
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const { connectDb } = require('../../utils/db.js');
const { log } = require('../../functions/log.js');
const client = require('../../index.js').client

const db = connectDb()

const mainHex = '#d79a61'

// Set up cooldown stuff
const cooldown = new Set();
const oneMinCooldown = 60000;
const twoMinCooldown = oneMinCooldown * 2;
const fiveMinCooldown = oneMinCooldown * 5; 
const tenMinCooldown = fiveMinCooldown * 2 ; 
const thirtyMinCooldown = tenMinCooldown * 3;
const oneHourCooldown = thirtyMinCooldown * 2;
const twelveHourCooldown = oneHourCooldown * 12;
const OneDayCooldown = twelveHourCooldown * 2;
const OneWeekCooldown = OneDayCooldown * 7;

const cdList = ['Chill Out', 'CHILLLLL', 'Stop.', 'Take a Breather', 'ok', 'Spamming commands is cringe', 'Slow it down', 'Wee-Woo-Wee-Woo Pull Over', 'No smile', '-_-', 'Why tho...', 'Yikes U Should Like Not', 'Slow it Cowboy', 'Take a Break Bro', 'Go Touch Some Grass']


exports.coinflipCmd = function coinflipCmd(user, guild, interaction) {
    const cmdName = 'coinflip'

    const choice = Math.round(Math.random())
    
    if (choice === 1) {
        const embed = new MessageEmbed()
        .setTitle('<:simp_coin:824720566241853460> Heads!')
        .setColor('GOLD')
        
        cmdRun(user, cmdName,guild,interaction)
        
        interaction.reply({
            embeds: [embed]
        })

    } else {
        const embed = new MessageEmbed()
        .setTitle('<:fuck_coin:824720614543196220> Tails!')
        .setColor('GOLD')
        
        cmdRun(user, cmdName,guild,interaction)

        interaction.reply({
            embeds: [embed]
        })
    }
}