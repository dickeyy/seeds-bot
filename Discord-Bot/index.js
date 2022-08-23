const { Client, Intents, MessageEmbed, Constants, MessageActionRow, MessageButton, Interaction, Permissions, Message, } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_BANS, Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS] });
const { REST } = require('@discordjs/rest');
const { Routes, InteractionResponseType } = require('discord-api-types/v9');
const dotenv = require('dotenv');
const { MongoClient, ServerApiVersion } = require('mongodb');
const { Configuration, OpenAIApi } = require("openai");
const osu = require('node-os-utils');
const axios = require('axios').default
const fs = require('fs')
const cron = require('cron');

// Process errors
process.on('uncaughtException', async function (error) {
    console.log(error.stack);

    var logData = `${error.stack}\n`
    await log(logData)
});

// Dotenv initialize 
dotenv.config();

// Connect to Mongo
const MongoUri = process.env.MONGO_URI;
const mClient = new MongoClient(MongoUri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
mClient.connect();
const db = mClient.db('main');
var logData = `MongoDB Connected\n`
log(logData)
console.log('MongoDB Connected')

// Define Colors
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

// Permission Integers
const BAN_MEMBERS_PERM = 0x0000000000000004
const KICK_MEMBERS_PERM = 0x0000000000000002
const ADMIN_PERM = 0x0000000000000008
const MODERATE_PERM = 0x0000010000000000

// Open AI Connection
const aiConfig = new Configuration({
    apiKey: process.env.OPENAI_API_KEY
})
const openai = new OpenAIApi(aiConfig)

// Write Command Definitions
const commands = [

    { name: 'help', description: 'Get a list of all Seeds commands' },

    // Moderation Commands
    { name: 'ban', description: 'Ban a member from the server', default_member_permissions: BAN_MEMBERS_PERM, options: [{ name: 'user', description: 'The person you want to ban', required: true, type: Constants.ApplicationCommandOptionTypes.USER }, { name: 'reason', description: 'The reason the person is being banned', required: false, type: Constants.ApplicationCommandOptionTypes.STRING }] },
    { name: 'unban', description: 'Unban a previously banned member', default_member_permissions: BAN_MEMBERS_PERM, options: [{ name: 'user', description: 'The person you want to unban', required: true, type: Constants.ApplicationCommandOptionTypes.USER }] },
    { name: 'kick', description: 'Kick a member from the server', default_member_permissions: KICK_MEMBERS_PERM, options: [{ name: 'user', description: 'The person you want to kick', required: true, type: Constants.ApplicationCommandOptionTypes.USER }, { name: 'reason', description: 'The reason the person is being kicked', required: false, type: Constants.ApplicationCommandOptionTypes.STRING }] },
    { name: 'warn', description: 'Warn a member in the server', default_member_permissions: MODERATE_PERM, options: [{ name: 'user', description: 'The person you want to warn', required: true, type: Constants.ApplicationCommandOptionTypes.USER }, { name: 'reason', description: 'The reason for the warn', required: true, type: Constants.ApplicationCommandOptionTypes.STRING }] },
    { name: 'cases', description: 'Check a members cases', default_member_permissions: MODERATE_PERM, options: [{ name: 'user', description: 'The person whos cases you want', required: true, type: Constants.ApplicationCommandOptionTypes.USER }] },
    { name: 'deletecase', description: 'Delete a specific case', default_member_permissions: MODERATE_PERM, options: [{ name: 'case', description: 'The case ID that you want to delete', required: true, type: Constants.ApplicationCommandOptionTypes.INTEGER }] },

    // Fun Commands
    { name: 'friend', description: 'Talk to an AI friend', options: [{ name: 'message', description: 'What you want to say to your friend', required: true, type: Constants.ApplicationCommandOptionTypes.STRING }] },
    { name: 'tsh', description: 'Make a 2 sentence horror story based on a given topic', options: [{ name: 'topic', description: 'The topic of the horror story', required: true, type: Constants.ApplicationCommandOptionTypes.STRING }] },
    { name: 'poll', description: 'Send a poll for 2 options in the server', options: [{ name: 'option1', description: 'First option for the poll', required: true, type: Constants.ApplicationCommandOptionTypes.STRING }, { name: 'option2', description: 'Second option for the poll', required: true, type: Constants.ApplicationCommandOptionTypes.STRING }] },
    { name: 'coinflip', description: 'Flip a coin' },

    // Economy Commands
    { name: 'balance', description: 'Check you SeedCoin balance' },
    { name: 'beg', description: 'Beg Seeds for some coins (has varrying results)' },
    { name: 'daily', description: 'Claim your daily SeedsCoin' },
    { name: 'highlow', description: 'Guess if a secret number is higher or lower than another, guess right and get some SeedCoin' },
    { name: 'slots', description: 'Bet some coins in the slot machine', options: [{ name: 'bet', description: 'How much you want to bet, must be more than 10', required: true, type: Constants.ApplicationCommandOptionTypes.INTEGER }] },
    { name: 'rps', description: 'Play Seeds in a game of rock paper scissors', options: [{ name: 'bet', description: 'How much you want to bet ont the game', required: true, type: Constants.ApplicationCommandOptionTypes.INTEGER }, { name: 'move', description: 'The move for the game (either rock, paper, or scissors)', required: true, type: Constants.ApplicationCommandOptionTypes.STRING, choices: [{ name: 'rock', value: 'rock' }, { name: 'paper', value: 'paper' }, { name: 'scissors', value: 'scissors' }] }] },
    { name: 'shop', description: 'See items that are avaliable for purchase' },
    { name: 'buy', description: 'Buy something from the shop', options: [{ name: 'id', description: 'The shop id number, get this using /shop', required: true, type: Constants.ApplicationCommandOptionTypes.INTEGER }] },
    { name: 'fish', description: 'Cast your pole out and hope for a bite' },
    { name: 'vote', description: 'Vote for Seeds on top.gg and get 1000 SeedCoins' },

    // Utility Commands
    { name: 'stats', description: 'Get some cool stats about the bot' },
    { name: 'rcolor', description: 'Generate a random color (with hex code)' },
    { name: 'botidea', description: 'Suggest an idea to the devs (Your idea is publicly viewed and voted on in the support server)', options: [{ name: 'idea', description: 'The idea you want to suggest', required: true, type: Constants.ApplicationCommandOptionTypes.STRING }] },
]

// Register slash commands
const rest = new REST({ version: '9' }).setToken(process.env.TOKEN);
// const rest = new REST({ version: '9' }).setToken(process.env.BETA_TOKEN);

(async () => {
    try {
        var logData = 'Started refreshing application (/) commands.\n'
      await log(logData) 
      console.log('Started refreshing application (/) commands.');
  
      await rest.put(
        // Routes.applicationGuildCommands(process.env.BETA_APP_ID, '801360477984522260', '961272863363567636', '731445738290020442'),
        Routes.applicationCommands(process.env.APP_ID),
        {body: commands},
      );
        var logData = 'Successfully reloaded application (/) commands.\n'
      await log(logData)    
      console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
      console.error(error);
    }
})();

// When the bot is ready
client.on('ready', () => {
    client.user.setActivity('/help', { type: 'LISTENING' });
    var logData = `Logged in as: ${client.user.tag}\n`
    /log(logData)    
    console.log(`Logged in as: ${client.user.tag}`)
});

// Recive slash commands
client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;
    const { commandName, options, user, guild, channel, ChannelData } = interaction

    if (commandName == 'help') {
        helpCmd(user,guild,interaction)
    }

    if (commandName == 'ban') {
        const banUser = options.getUser('user')
        const reason = options.getString('reason')
        banCmd(user,guild,interaction,banUser,reason)
    }

    if (commandName == 'unban') {
        const unbanUser = options.getUser('user')
        unbanCmd(user,guild,interaction,unbanUser)
    }

    if (commandName == 'kick') {
        const kickUser = options.getUser('user') 
        const reason = options.getString('reason')
        kickCmd(user,guild,interaction,kickUser,reason)
    }

    if (commandName == 'warn') {
        const warnUser = options.getUser('user')
        const reason = options.getString('reason')
        await warnCmd(user,guild,interaction,warnUser,reason)
    }

    if (commandName == 'cases') {
        const caseUser = options.getUser('user')
        await casesCmd(user,guild,interaction,caseUser)
    }

    if (commandName == 'deletecase') {
        const caseId = options.getInteger('case')
        await deletecaseCmd(user,guild,interaction,caseId)
    }

    if (commandName == 'friend') {
        const prompt = options.getString('message')
        await aiCmd(user,guild,interaction,prompt)
    }

    if (commandName == 'tsh') {
        const topic = options.getString('topic')
        await tshCmd(user,guild,interaction,topic)
    }

    if (commandName == 'balance') {
        await balanceCmd(user,guild,interaction)
    }

    if (commandName == 'beg') {
        await begCmd(user,guild,interaction)
    }

    if (commandName == 'daily') {
        await dailyCmd(user,guild,interaction)
    }

    if (commandName == 'highlow') {
        await highlowCmd(user,guild,interaction)
    }

    if (commandName == 'slots') {
        const bet = options.getInteger('bet')
        await slotsCmd(user,guild,interaction,bet)
    }

    if (commandName == 'rps') {
        const bet = options.getInteger('bet')
        const move = options.getString('move')
        await rpsCmd(user,guild,interaction,bet,move)
    }

    if (commandName == 'shop') {
        await shopCmd(user,guild,interaction)
    }

    if (commandName == 'buy') {
        const shopId = options.getInteger('id')
        await buyCmd(user,guild,interaction,shopId)
    }

    if (commandName == 'fish') {
        await fishCmd(user,guild,interaction)
    }

    if (commandName == 'stats') {
        statsCmd(user,guild,interaction)
    }

    if (commandName == 'rcolor') {
        rcolorCmd(user,guild,interaction)
    }

    if (commandName == 'poll') {
        const option1 = options.getString('option1')
        const option2 = options.getString('option2')

        await pollCmd(user,guild,interaction,option1,option2)
    }

    if (commandName == 'coinflip') {
        coinflipCmd(user,guild,interaction)
    }

    if (commandName == 'botidea') {
        const idea = options.getString('idea')
        await botideaCmd(user,guild,interaction,idea)
    }

    if (commandName == 'vote') {
        voteCmd(user,guild,interaction)
    }
})

// Client Events
// Bot joins a server
client.on('guildCreate', async guild => {
    const isPartnered = guild.partnered
    var today = new Date();
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

    var collection = db.collection('guilds')
    await collection.insertOne(guildData)

    var logData = `New Guild -- ${guild.name}\n`
    await log(logData)

    console.log(`New Guild -- ${guild.name}`)
})/

// When the bot leaves a server
client.on('guildDelete', async guild => {
    const collection = db.collection('guilds');
    await collection.deleteOne({ _id: guild.id })

    var logData = `Left Guild -- ${guild.name}\n`
    await log(logData)

    console.log(`Left Guild -- ${guild.name}`)
})

// User joins a server
client.on('guildMemberAdd', async member => {
    const collection = db.collection('guilds');
    const guild = await collection.findOne({ _id: member.guild.id })
    const memCout = Number(guild.memberCount) + 1
    await collection.updateOne({ _id: member.guild.id }, { $set: { memberCount: memCout } })
})

// update all counts (once)
// const doc = await collection.find({}).toArray()
// for (var i = 0; i < doc.length; i++) {
//     const server = doc[i]

//     const serverObj = client.guilds.cache.get(server.id)

//     if (serverObj !== undefined) {
//         const oldCount = Number(server.memberCount)
//         const newCount = Number(serverObj.memberCount)

//         if (oldCount !== newCount) {
//             await collection.updateOne({ _id: server.id }, { $set: { memberCount: newCount } })

//             console.log(`Updated memberCount for ${server.name} -- ${oldCount} -> ${newCount}`)
//         }
//     }
// } 

// User leaves a server
client.on('guildMemberRemove', async member => {
    const collection = db.collection('guilds');
    const guild = await collection.findOne({ _id: member.guild.id })
    const memCout = Number(guild.memberCount) - 1
    await collection.updateOne({ _id: member.guild.id }, { $set: { memberCount: memCout } })
})

// Cron Jobs
let refreshHistory = new cron.CronJob('0 0 * * *', async () => {

    // This runs every day at 10:30:00, you can do anything you want
    const collection = db.collection('guilds');
    const guilds =  await collection.find({}).toArray()

    var gCount = 0
    var mCount = 0
    gCount = client.guilds.cache.size + gCount

    for (var i = 0; i < guilds.length; i++) {
        const guild = guilds[i]
        const server = client.guilds.cache.get(guild.id)
        if (server !== undefined) {
            mCount = server.memberCount + mCount
        }
    }

    const hisDataColl = db.collection('historicalData')
    await hisDataColl.updateOne({ type: 'guildData' }, { $set: { guildCount: gCount, userCount: mCount } })

    console.log('Updated historical data')

});

refreshHistory.start();

// bot functions
// Command run
async function cmdRun(user,cmdName) {
    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

    var collection = db.collection('commands')
    const doc = await collection.find({ name: cmdName }).toArray();

    var logData = `${date} ${time} | ${user.tag} - ${cmdName}\n`
    await log(logData)

    if (doc.length == 0) {
        const cmdData = {
            name: cmdName,
            runCount: 1
        }
        await collection.insertOne(cmdData)
    } else {
        var runCount = doc[0].runCount
        runCount ++ 

        await collection.updateOne({ name: cmdName }, { $set: { runCount: runCount }})
    }

    console.log(`${date} ${time} | ${user.tag} - ${cmdName}`)
}

// Log functuon 
async function log(logData) {

    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();

    if (logData == null) {
        return
    }

    fs.appendFile('./logs/' + date + '.txt', logData, function (err) {
        if (err !== null) {
            fs.writeFile('./logs/' + date + '.txt', logData, function (err) {
                if (err) throw err;
            });
        }
    });

}


// Help command
function helpCmd(user,guild,interaction) {
    const cmdName = 'help'

    const embed = new MessageEmbed()
    .setTitle('Seeds Help')
    .setColor(mainHex)
    .setThumbnail('https://seedsbot.xyz/images/logo.png')
    .setDescription('All Seeds commands use the prefix `\`/`\`\n\n[parameter] = Required\n{parameter} = Optional\n')
    .setFields([
        { name: 'Moderation:', value: '`\`/ban [user] {reason}`\`, `\`/unban [user]`\`, `\`/kick [user] {reason}`\`, `\`/warn [user] [reason]`\`, `\`/cases [user]`\`, `\`/deletecase [case]`\`', inline: false },
        { name: 'Economy:', value: '`\`/balance`\`, `\`/daily`\`, `\`/beg`\`, `\`/highlow`\`, `\`/slots [bet > 10]`\`, `\`/rps [bet > 10] [move]`\`, `\`/fish`\`, `\`/shop`\`, `\`/buy [shop id]`\`, `\`/vote`\`', inline: false },
        { name: 'Fun:', value: '`\`/friend [message]`\`, `\`/tsh [topic]`\`, `\`/coinflip`\`', inline: false },
        { name: 'Utility: ', value: '`\`/stats`\`, `\`/rcolor`\`, `\`/poll [option 1] [option 2]`\`, `\`/botidea [idea]`\`', inline: false }
    ])
    .addField('Links', '[🌐 Website](https://seedsbot.xyz) | [<:invite:823987169978613851> Invite](https://seedsbot.xyz/invite) | [<:discord:823989269626355793> Support](https://seedsbot.xyz/support)')

    interaction.reply({
        embeds: [embed]
    })

    cmdRun(user,cmdName)
}

// Moderation Commands
// Ban member 
function banCmd(user,guild,interaction,banUser,reason) {
    const cmdName = 'ban'

    if (interaction.member.permissions.has(Permissions.FLAGS.BAN_MEMBERS)) {
        if (user == banUser) {
            const embed = new MessageEmbed()
            .setTitle('Error: You cannot ban yourself.')
            .setColor('RED')
            interaction.reply({
                embeds: [embed],
                ephemeral: true
            })
        } else {
            if (reason == null) {
                const reason = 'None'
                guild.members.ban(banUser).catch(error => {
                    if (error.code == 50013) {
                        const embed = new MessageEmbed()
                        .setTitle('Error: Permissions Error')
                        .setDescription(`Seeds is not high up enough in the role hierarchy to ban <@${banUser.id}>. To fix this, move Seeds to the top of the hierarchy`)
                        .setColor('RED')
                        interaction.reply({
                            embeds: [embed],
                            ephemeral: true
                        })
                    }
                    return
                }).then(() => {
                    const embed = new MessageEmbed()
                    .setTitle('Member Banned')
                    .setDescription(`Banned <@${banUser.id}> with reason` + " `\`" + reason + "`\`")
                    .setColor(mainHex)
                
                    interaction.reply({
                        embeds: [embed]
                    }).catch(error => { })

                    const embed2 = new MessageEmbed()
                    .setTitle(`You have been banned from ${guild.name}`)
                    .setDescription("Reason: `\`" + reason + "`\`")

                    client.users.cache.get(banUser.id).send({
                        embeds: [embed2]
                    }).catch(error => { })
                })
            } else {
                guild.members.ban(banUser, {
                    reason: reason,
                }).catch(error => {
                    if (error.code == 50013) {
                        const embed = new MessageEmbed()
                        .setTitle('Error: Permissions Error')
                        .setDescription(`Seeds is not high up enough in the role hierarchy to ban <@${banUser.id}>. To fix this, move Seeds to the top of the hierarchy`)
                        .setColor('RED')
                        interaction.reply({
                            embeds: [embed],
                            ephemeral: true
                        })
                    }
                    return
                }).then(() => {
                    const embed = new MessageEmbed()
                    .setTitle('Member Banned')
                    .setDescription(`Banned <@${banUser.id}> with reason` + " `\`" + reason + "`\`")
                    .setColor(mainHex)
                
                    interaction.reply({
                        embeds: [embed]
                    }).catch(error => { })

                    const embed2 = new MessageEmbed()
                    .setTitle(`You have been banned from ${guild.name}`)
                    .setDescription("Reason: `\`" + reason + "`\`")

                    client.users.cache.get(banUser.id).send({
                        embeds: [embed2]
                    }).catch(error => { })
                })
            }
            cmdRun(user,cmdName)
        }

    } else {
        const embed = new MessageEmbed()
        .setTitle('Error: You do not have permission to do that')
        .setColor('RED')

        interaction.reply({
            embeds: [embed],
            ephemeral: true 
        })
    }
}

// Unban User
function unbanCmd(user,guild,interaction,unbanUser) {
    const cmdName = 'unban'

    if (interaction.member.permissions.has(Permissions.FLAGS.BAN_MEMBERS)) {
        guild.members.unban(unbanUser).catch(error => {
            if (error.code == 10026) {
                const embed = new MessageEmbed()
                .setTitle('Error: That person is not banned')
                .setColor('RED')
                interaction.reply({
                    embeds: [embed],
                    ephemeral: true
                })
            } else {
                console.log(error)
            }
        }).then(() => {
            const embed = new MessageEmbed()
            .setTitle('Unbanned Member')
            .setDescription(`Unbanned <@${unbanUser.id}>`)
            .setColor(mainHex)
    
            interaction.reply({
                embeds: [embed]
            }).catch(error => { })
            cmdRun(user,cmdName)
        })

    } else {
        const embed = new MessageEmbed()
        .setTitle('Error: You do not have permission to do that')
        .setColor('RED')

        interaction.reply({
            embeds: [embed],
            ephemeral: true 
        })
    }
}

// Kick member 
function kickCmd(user,guild,interaction,kickUser, reason) {
    const cmdName = 'kick'

    if (reason == null) reason = 'None';

    if (interaction.member.permissions.has(Permissions.FLAGS.KICK_MEMBERS)) {
        if (user == kickUser) {
            const embed = new MessageEmbed()
            .setTitle('Error: You cannot kick yourself.')
            .setColor('RED')
            interaction.reply({
                embeds: [embed],
                ephemeral: true
            })
        } else {
            guild.members.kick(kickUser, {
                reason: reason
            }).catch(error => {
                if (error.code == 50013) {
                    const embed = new MessageEmbed()
                    .setTitle('Error: Permissions Error')
                    .setDescription('To fix this move Seeds to the top of the role hierarchy')
                    .setColor('RED')
                    interaction.reply({
                        embeds: [embed],
                        ephemeral: true
                    }).catch(error => { })
                } else {
                    console.log(error)
                }
            }).then(() => {
                const embed = new MessageEmbed()
                .setTitle('Kicked Member')
                .setDescription('Kicked <@' + kickUser.id + "> with reason `\`" + reason + "`\`")
                .setColor(mainHex)
    
                interaction.reply({
                    embeds: [embed]
                }).catch(error => { })

                cmdRun(user,cmdName)
            })
        }
    } else {
        const embed = new MessageEmbed()
        .setTitle('Error: You do not have permission to do that')
        .setColor('RED')

        interaction.reply({
            embeds: [embed],
            ephemeral: true 
        })
    }
}

// Warn System
async function warnCmd(user,guild,interaction,warnUser,reason) {
    const cmdName = 'warn'

    if (interaction.member.permissions.has(Permissions.FLAGS.MODERATE_MEMBERS)) {
        const caseId = Math.round(Math.random() * 100000)

        const warnData = {
            user: warnUser.id,
            moderator: user.id,
            guildId: guild.id,
            reason: reason,
            caseId: caseId,
        }

        var collection = db.collection('warns')
        await collection.insertOne(warnData)

        const embed = new MessageEmbed()
        .setTitle('Warned User | Case ID: ' + caseId)
        .setDescription("Warned <@" + warnUser.id + "> with reason `\`" + reason + "`\`")
        .setColor(mainHex)

        interaction.reply({
            embeds: [embed]
        })

        const embed2 = new MessageEmbed()
        .setTitle('You have been warned in ' + guild.name)
        .setDescription('Reason: `\`' + reason + '`\`')
        .setColor(mainHex)

        client.users.cache.get(warnUser.id).send({
            embeds: [embed2]
        }).catch(error => { })

        cmdRun(user,cmdName)
    } else {
        const embed = new MessageEmbed()
        .setTitle('Error: You do not have permission to do that')
        .setColor('RED')

        interaction.reply({
            embeds: [embed],
            ephemeral: true 
        })
    }
}

// Fetch cases command
async function casesCmd(user,guild,interaction,caseUser) {
    const cmdName = 'cases'

    if (interaction.member.permissions.has(Permissions.FLAGS.MODERATE_MEMBERS)) {
        var collection = db.collection('warns')

        const doc = await collection.find({ user: caseUser.id, guildId: guild.id }).toArray();
        
        if (doc.length == 0) {
            const embed = new MessageEmbed()
            .setTitle(`${caseUser.tag} has no cases`)
            .setColor(mainHex)
            interaction.reply({
                embeds: [embed]
            })
        } else {
            const embed = new MessageEmbed()
            .setTitle(caseUser.tag + "'s Cases")
            .setDescription(doc.length + ' Cases')
            .setColor(mainHex)

            doc.forEach((i) => {
                embed.addField(`Case ${i.caseId}:`, "`\`" + i.reason + "`\`\nMod: <@" + i.moderator + ">")
            })
            

            interaction.reply({
                embeds: [embed]
            })
            cmdRun(user,cmdName)
        }
    }
}

// delete a case
async function deletecaseCmd(user,guild,interaction,caseId) {
    const cmdName = 'deletecase'

    if (interaction.member.permissions.has(Permissions.FLAGS.MODERATE_MEMBERS)) {
        var collection = db.collection('warns')
        await collection.deleteOne({ caseId: caseId, guildId: guild.id }).then(() => {
            const embed = new MessageEmbed()
            .setTitle('Deleted Case ' + caseId)
            .setColor(mainHex)
    
            interaction.reply({
                embeds: [embed]
            })
    
            cmdRun(user,cmdName)
        })
    }
}

// AI command
async function aiCmd(user,guild,interaction,prompt) {
    const cmdName = 'friend'

    if (cooldown.has(`${user.id}--${cmdName}`)) {
        const embed = new MessageEmbed()
        .setTitle(cdList[Math.floor(Math.random() * cdList.length)])
        .setDescription('That command can only be run once every 5 minutes')
        .setColor('RED')
        interaction.reply({
            embeds: [embed],
            ephemeral: true
        })
    } else {

        try {
            const completion = await openai.createCompletion({
                model: "text-ada-001",
                prompt: "You: " + prompt + " \n Friend: ",
                temperature: 0.5,
                max_tokens: 60,
                top_p: 1.0,
                frequency_penalty: 0.5,
                presence_penalty: 0.0,
                stop: ["You:"],
            });

            if (completion.data.choices[0].text != '') {
                const embed = new MessageEmbed()
                .setTitle('AI Friend')
                .setDescription('You: ' + prompt )
                .addField('AI:', completion.data.choices[0].text)
                .setColor(mainHex)
        
                interaction.reply({
                    embeds: [embed]
                })
            }

            //now, set cooldown
            cooldown.add(`${user.id}--${cmdName}`);
            setTimeout(() => {
                cooldown.delete(`${user.id}--${cmdName}`);
            }, fiveMinCooldown);

        } catch (error) {
            if (error.response) {
            console.log(error.response.status);
            console.log(error.response.data);
            } else {
            console.log(error.message);
            }

            const embed = new MessageEmbed()
            .setTitle('ERROR')
            .setDescription('An error occured with this command. Please try again later. If the error persists, reach out to [SUPPORT](https://seedsbot.xyz/support)')
            .setColor("RED")
    
            interaction.reply({
            embeds: [embed],
            ephemeral: true
            })
        }
    }

    cmdRun(user,cmdName)
}

// Two sentence horror
async function tshCmd(user,guild,interaction,topic) { 
    const cmdName = 'tsh'

    if (cooldown.has(`${user.id}--${cmdName}`)) {
        const embed = new MessageEmbed()
        .setTitle(cdList[Math.floor(Math.random() * cdList.length)])
        .setDescription('That command can only be run once every 10 minutes')
        .setColor('RED')
        interaction.reply({
            embeds: [embed],
            ephemeral: true
        })
    } else {

        try {

            const res = await openai.createCompletion("text-davinci-002", {
                prompt: `Topic: ${topic}\nTwo-Sentence Horror Story:`,
                temperature: 0.8,
                max_tokens: 60,
                top_p: 1.0,
                frequency_penalty: 0.5,
                presence_penalty: 0.0,
            })
        
            if (res.data.choices[0].text != '') {
                const embed = new MessageEmbed()
                .setTitle('Two Sentence Horror | Topic: ' + topic)
                .setDescription(res.data.choices[0].text)
                .setColor(mainHex)
        
                interaction.reply({
                    embeds: [embed]
                })
            }

            //now, set cooldown
            cooldown.add(`${user.id}--${cmdName}`);
            setTimeout(() => {
                cooldown.delete(`${user.id}--${cmdName}`);
            }, tenMinCooldown);

        } catch (error) {

            if (error.response) {
                console.log(error.response.status);
                console.log(error.response.data);
            } else {
                console.log(error.message);
            }
    
            const embed = new MessageEmbed()
                .setTitle('ERROR')
                .setDescription('An error occured with this command. Please try again later. If the error persists, reach out to [SUPPORT](https://seedsbot.xyz/support)')
                .setColor("RED")
        
            interaction.reply({
                embeds: [embed],
                ephemeral: true
            })
        }


    }

    cmdRun(user,cmdName)
}

// Economy System 
// balance command
async function balanceCmd(user,guild,interaction) {
    const cmdName = 'balance'

    var collection = db.collection('economy')
    const doc = await collection.findOne({ userId: user.id, guildId: guild.id })

    if (doc == null) {
        const embed = new MessageEmbed()    
        .setTitle('You have no SeedCoin')
        .setDescription('Run `\`/daily`\` to get some!')
        .setColor(mainHex)
        
        interaction.reply({
            embeds: [embed]
        })
    } else {
        const coins = doc.coins
        const embed = new MessageEmbed()
        .setTitle('Bank Balance')
        .setDescription('<@' + user.id + '> has **<:fuck_coin:824720614543196220> ' + coins + ' SeedCoins**')
        .setColor(mainHex)

        interaction.reply({
            embeds: [embed]
        })
    }
    cmdRun(user,cmdName)
}

// beg command
async function begCmd(user,guild,interaction) {
    const cmdName = 'beg'

    if (cooldown.has(`${user.id}--${cmdName}`)) {
        const embed = new MessageEmbed()
        .setTitle(cdList[Math.floor(Math.random() * cdList.length)])
        .setDescription('That command can only be run once every 10 minutes')
        .setColor('RED')
        interaction.reply({
            embeds: [embed],
            ephemeral: true
        })
        
    } else {

        const coinsAdd = Math.floor(Math.random() * 100)

        var collection = db.collection('economy')
        const doc = await collection.findOne({ userId: user.id, guildId: guild.id })
    
        if (doc == null) {
            const userData = {
                userId: user.id,
                guildId: guild.id,
                coins: coinsAdd,
                fishingPole: null,
                pickaxe: null
            }
    
            await collection.insertOne(userData)
    
            const embed = new MessageEmbed()
            .setTitle('Ugh.. I guess')
            .setDescription("Here's **<:fuck_coin:824720614543196220>" + coinsAdd + "**\n\nYour new balance is **<:fuck_coin:824720614543196220>" + coinsAdd + "**")
            
            interaction.reply({
                embeds: [embed]
            })
        } else {
            const oldBal = doc.coins
            const newBal = oldBal + coinsAdd
    
            await collection.updateOne({ userId: user.id, guildId: guild.id }, { $set: { coins: newBal }})
    
            const embed = new MessageEmbed()
            .setTitle('Ugh.. I guess')
            .setDescription("Here's **<:fuck_coin:824720614543196220>" + coinsAdd + "**\n\nYour new balance is **<:fuck_coin:824720614543196220>" + newBal + "**")
    
            interaction.reply({
                embeds: [embed]
            })
        }
    
        //now, set cooldown
       cooldown.add(`${user.id}--${cmdName}`);
        setTimeout(() => {
            cooldown.delete(`${user.id}--${cmdName}`);
        }, tenMinCooldown);
    }
    cmdRun(user,cmdName)
}

// Daily command
async function dailyCmd(user,guild,interaction) {
    const cmdName = 'daily'

    if (cooldown.has(`${user.id}--${cmdName}`)) {
        const embed = new MessageEmbed()
        .setTitle(cdList[Math.floor(Math.random() * cdList.length)])
        .setDescription('That command can only be run once every 24 hours')
        .setColor('RED')
        interaction.reply({
            embeds: [embed],
            ephemeral: true
        })
    } else {

        var collection = db.collection('economy')
        const doc = await collection.findOne({ userId: user.id, guildId: guild.id })

        if (doc == null) {
            const userData = {
                userId: user.id,
                guildId: guild.id,
                coins: 1000,
                fishingPole: null,
                pickaxe: null
            }
            await collection.insertOne(userData)

            const embed = new MessageEmbed()
            .setTitle('<:fuck_coin:824720614543196220> 1000 Recived')
            .setDescription('Come back tomorrow for more!')
            .setFooter({ text: 'Balance: 1000 SC' })

            interaction.reply({
                embeds: [embed]
            }) 
        } else {
            
            var oldBal = doc.coins
            const newBal = oldBal + 500

            await collection.updateOne({ userId: user.id, guildId: guild.id }, { $set: { coins: newBal } })

            const embed = new MessageEmbed()
            .setTitle('<:fuck_coin:824720614543196220> 500 Recived')
            .setDescription('Come back tomorrow for more!')
            .setFooter({ text: 'Balance: ' + newBal + ' SC' })

            interaction.reply({
                embeds: [embed]
            }) 
        }

        cooldown.add(`${user.id}--${cmdName}`);
        setTimeout(() => {
            cooldown.delete(`${user.id}--${cmdName}`);
        }, OneDayCooldown);

        cmdRun(user,cmdName)
    }
}

// High Low Command
async function highlowCmd(user,guild,interaction) {
    const cmdName = 'highlow'

    if (cooldown.has(user.id + '--' + cmdName)) {
        const embed = new MessageEmbed()
        .setTitle(cdList[Math.floor(Math.random() * cdList.length)])
        .setDescription('That command can only be run once every five minutes')
        .setColor('RED')
        interaction.reply({
            embeds: [embed],
            ephemeral: true
        })
    } else {

        const hint = Math.round(Math.random() * 100)
        const num = Math.round(Math.random() * 100)
        var coinsAdd = Math.round(Math.random() * 500)

        var collection = db.collection('economy')
        const doc = await collection.findOne({ userId: user.id, guildId: guild.id })
        var coins = doc.coins

        const embed = new MessageEmbed()
        .setTitle('Higher / Lower | Hint: ' + hint)
        .setDescription('A random number between 1 and 100 has been chosen. Your hint is **' + hint + '**. Chose one of the buttons below, higher if the number is higher than the hint, lower if the number is lower than the hint, or equal if the number is equal to the hint.')

        const row = new MessageActionRow()
        .addComponents(
            new MessageButton()
            .setCustomId('higher')
            .setLabel('Higher')
            .setStyle('SECONDARY'),
    
            new MessageButton()
            .setCustomId('lower')
            .setLabel('Lower')
            .setStyle('SECONDARY'),

            new MessageButton()
            .setCustomId('equal')
            .setLabel('Equal')
            .setStyle('SECONDARY'),
        )

        interaction.reply({
            embeds: [embed],
            components: [row]
        })

        client.on('interactionCreate', interaction2 => {
            if (!interaction2.isButton()) return;

            const embed2 = new MessageEmbed()

            if (interaction2['customId'] == 'higher') {
                if (doc == null) {
                    if (num > hint) {
                        const userData = {
                            userId: user.id,
                            guildId: guild.id,
                            coins: coinsAdd,
                            fishingPole: null,
                            pickaxe: null
                        }
                        collection.insertOne(userData).then(() => {})

                        embed2.setTitle('Congrats!')
                        embed2.setDescription('You got it right! The number was **' + num + '** \nYou recived **' + coinsAdd + '** SC')
                        embed2.setFooter({ text: 'Balance: ' + coinsAdd })
                        embed2.setColor('GREEN')

                        interaction.editReply({
                            embeds: [embed2],
                            components: []
                        })

                    } else {
                        embed2.setTitle('Nope!')
                        embed2.setDescription('The number was **' + num + '**')

                        interaction.editReply({
                            embeds: [embed2],
                            components: []
                        })
                    }
                } else {
                    if (num > hint) {
                        const newBal = coins + coinsAdd

                        collection.updateOne({ userId: user.id, guildId: guild.id }, { $set: { coins: newBal } }).then(() => {})    
                        embed2.setTitle('Congrats!')
                        embed2.setDescription('You got it right! The number was **' + num + '** \nYou recived **' + coinsAdd + '** SC')
                        embed2.setFooter({ text: 'Balance: ' + newBal })
                        embed2.setColor('GREEN')

                        interaction.editReply({
                            embeds: [embed2],
                            components: []
                        })
                    } else {
                        embed2.setTitle('Nope!')
                        embed2.setDescription('The number was **' + num + '**')

                        interaction.editReply({
                            embeds: [embed2],
                            components: []
                        })
                    }
                }
            } else if (interaction2['customId'] == 'lower') {
                if (doc == null) {
                    if (num < hint) {
                        const userData = {
                            userId: user.id,
                            guildId: guild.id,
                            coins: coinsAdd,
                            fishingPole: null,
                            pickaxe: null
                        }
                        collection.insertOne(userData).then(() => {})

                        embed2.setTitle('Congrats!')
                        embed2.setDescription('You got it right! The number was **' + num + '** \nYou recived **' + coinsAdd + '** SC')
                        embed2.setFooter({ text: 'Balance: ' + coinsAdd })
                        embed2.setColor('GREEN')

                        interaction.editReply({
                            embeds: [embed2],
                            components: []
                        })

                    } else {
                        embed2.setTitle('Nope!')
                        embed2.setDescription('The number was **' + num + '**')

                        interaction.editReply({
                            embeds: [embed2],
                            components: []
                        })
                    }
                } else {
                    if (num < hint) {
                        const newBal = coins + coinsAdd

                        collection.updateOne({ userId: user.id, guildId: guild.id }, { $set: { coins: newBal } }).then(() => { })

                        embed2.setTitle('Congrats!')
                        embed2.setDescription('You got it right! The number was **' + num + '** \nYou recived **' + coinsAdd + '** SC')
                        embed2.setFooter({ text: 'Balance: ' + newBal })
                        embed2.setColor('GREEN')

                        interaction.editReply({
                            embeds: [embed2],
                            components: []
                        })
                    } else {
                        embed2.setTitle('Nope!')
                        embed2.setDescription('The number was **' + num + '**')

                        interaction.editReply({
                            embeds: [embed2],
                            components: []
                        })
                    }
                }
            } else if (interaction2['customId'] == 'equal') {
                coinsAdd * 2

                if (doc == null) {
                    if (num == hint) {
                        const userData = {
                            userId: user.id,
                            guildId: guild.id,
                            coins: coinsAdd,
                            fishingPole: null,
                            pickaxe: null
                        }
                        collection.insertOne(userData).then(() => {})

                        embed2.setTitle('Congrats!')
                        embed2.setDescription('You got it right! The number was **' + num + '** \nYou recived **' + coinsAdd + '** SC')
                        embed2.setFooter({ text: 'Balance: ' + coinsAdd })
                        embed2.setColor('GOLD')

                        interaction.editReply({
                            embeds: [embed2],
                            components: []
                        })

                    } else {
                        embed2.setTitle('Nope!')
                        embed2.setDescription('The number was **' + num + '**')

                        interaction.editReply({
                            embeds: [embed2],
                            components: []
                        })
                    }
                } else {
                    if (num == hint) {
                        const newBal = coins + coinsAdd

                        collection.updateOne({ userId: user.id, guildId: guild.id }, { $set: { coins: newBal } }).then(() => {})
    
                        embed2.setTitle('Congrats!')
                        embed2.setDescription('You got it right! The number was **' + num + '** \nYou recived **' + coinsAdd + '** SC')
                        embed2.setFooter({ text: 'Balance: ' + newBal })
                        embed2.setColor('GOLD')

                        interaction.editReply({
                            embeds: [embed2],
                            components: []
                        })
                    } else {
                        embed2.setTitle('Nope!')
                        embed2.setDescription('The number was **' + num + '**')

                        interaction.editReply({
                            embeds: [embed2],
                            components: []
                        })
                    }
                }
            }
        })

        cooldown.add(`${user.id}--${cmdName}`);
        setTimeout(() => {
            cooldown.delete(`${user.id}--${cmdName}`);
        }, fiveMinCooldown);

        cmdRun(user,cmdName)
    }
}

// Slots Command
async function slotsCmd(user,guild,interaction,bet) {
    const cmdName = 'slots'

    if (cooldown.has(user.id + '--' + cmdName)) {
        const embed = new MessageEmbed()

        .setTitle(cdList[Math.floor(Math.random() * cdList.length)])
        .setDescription('That command can only be run once every one minute')
        .setColor('RED')
        interaction.reply({
            embeds: [embed],
            ephemeral: true
        })
    } else {

        if (bet < 10) {
            const embed = new MessageEmbed()
            .setTitle('Bet must be more than 10 SC')
            .setColor('RED')
            interaction.reply({
                embeds: [embed],
                ephemeral: true
            })
        } else {
            const emojiList = ['🎉','💎','🏆','💯','💵','🔔']
            const emoji1 = emojiList[Math.floor(Math.random() * emojiList.length )]
            const emoji2 = emojiList[Math.floor(Math.random() * emojiList.length )]
            const emoji3 = emojiList[Math.floor(Math.random() * emojiList.length )]

            const win1 = bet * 1.5
            const win2 = bet * 3
    
            var collection = db.collection('economy')
            const doc = await collection.findOne({ userId: user.id, guildId: guild.id })

            const embed = new MessageEmbed()
            embed.setTitle('Slot Machine')
            embed.setDescription('- ' + emoji1 + ' ' + emoji2 + ' ' + emoji3 + ' -')
    
            if (doc == null) {
                const embedNoCoins = new MessageEmbed()
                embedNoCoins.setTitle('You have no SC, run /daily to get some')
                embedNoCoins.setColor('RED')

                interaction.reply({
                    embeds: [embedNoCoins],
                    ephemeral: true
                })
            } else if (doc.coins < bet) {
                const notEnoughCoins = new MessageEmbed()
                .setTitle('You do not have that many coins')
                .setDescription('Balance: ' + doc.coins)
                .setColor('RED')

                interaction.reply({
                    embeds: [notEnoughCoins],
                    ephemeral: true
                })
            } else {
                if (emoji1 != emoji2 && emoji2 != emoji3) {
                    // Lose
                    var bal = doc.coins - bet
                    
                    embed.setColor('RED')
                    embed.addField('You Lost!', 'Losings: ' + bet)
                    embed.setFooter({ text: 'Balance: ' + bal})

                    await collection.updateOne({ userId: user.id, guildId: guild.id }, { $set: { coins: bal } })

                    interaction.reply({
                        embeds: [embed]
                    })
                } else if (emoji1 == emoji2 && emoji2 != emoji3) {
                    // Win 1.5x emoji 1 and 2
                    var bal = doc.coins + win1

                    embed.setColor('GREEN')
                    embed.addField('You Won!', 'Winnings: ' + win1)
                    embed.setFooter({ text: 'Balance: ' + bal })

                    await collection.updateOne({ userId: user.id, guildId: guild.id }, { $set: { coins: bal } })

                    interaction.reply({ 
                        embeds: [embed]
                    })
                } else if (emoji2 == emoji3 && emoji3 != emoji1) {
                    // Win 1.5x emoji 2 and 3
                    var bal = doc.coins + win1

                    embed.setColor('GREEN')
                    embed.addField('You Won!', 'Winnings: ' + win1)
                    embed.setFooter({ text: 'Balance: ' + bal })

                    await collection.updateOne({ userId: user.id, guildId: guild.id }, { $set: { coins: bal } })

                    interaction.reply({
                        embeds: [embed]
                    })
                } else if (emoji1 == emoji2 && emoji2 == emoji3) {
                    // Win 3x emoji 1,2,3
                    var bal = doc.coins + win2

                    embed.setColor('GOLD')
                    embed.addField('You Won!', 'Winnings: ' + win2)
                    embed.setFooter({ text: 'Balance: ' + bal })

                    await collection.updateOne({ userId: user.id, guildId: guild.id }, { $set: { coins: bal } })

                    interaction.reply({
                        embeds: [embed]
                    })
                }
                cooldown.add(user.id + '--' + cmdName);
                setTimeout(() => {
                    cooldown.delete(user.id + '--' + cmdName);
                }, oneMinCooldown);

                cmdRun(user,cmdName)
            }
        }
    }
}

// RPS Command
async function rpsCmd(user,guild,interaction,bet,move) {
    const cmdName = 'rps'

    if (cooldown.has(user.id + '--' + cmdName)) {
        const embed = new MessageEmbed()

        .setTitle(cdList[Math.floor(Math.random() * cdList.length)])
        .setDescription('That command can only be run once every five minutes')
        .setColor('RED')
        interaction.reply({
            embeds: [embed],
            ephemeral: true
        })
    } else {
        if (bet < 10) {
            const embed = new MessageEmbed()
            .setTitle('Minimum Bet is 10 Coins')
            .setColor('RED')

            interaction.reply({
                embeds: [embed],
                ephemeral: true
            })
        } else {
            const botMoveList = ['rock', 'paper', 'scissors']
            const botMove = botMoveList[Math.floor(Math.random() * botMoveList.length)]

            if (botMove == 'rock') var botMoveEmoji = '🪨'
            else if (botMove == 'paper') var botMoveEmoji = '📄'
            else if (botMove == 'scissors') var botMoveEmoji = '✂️'

            if (move == 'rock') var moveEmoji = '🪨'
            else if (move == 'paper') var moveEmoji = '📄'
            else if (move == 'scissors') var moveEmoji = '✂️'

            const winAmount = bet * 1.25

            var collection = db.collection('economy')
            const doc = await collection.findOne({ userId: user.id, guildId: guild.id })

            const embed = new MessageEmbed()
            embed.setTitle('Rock Paper Scissors')
            embed.setDescription(user.username + ' plays: ' + moveEmoji + '\nSeeds plays: ' + botMoveEmoji)

            if (doc == null) {
                const embed = new MessageEmbed()
                .setTitle('You have no coins')
                .setDescription('Run `\`/daily`\` to get some')
                .setColor('RED')

                interaction.reply({
                    embeds: [embed],
                    ephemeral: true
                })
            } else {
                if (botMove == 'rock' && move == 'scissors' || botMove == 'paper' && move == 'rock' || botMove == 'scissors' && move == 'paper') {
                    // Player wins
                    var bal = doc.coins + winAmount

                    embed.setColor('GREEN')
                    embed.addField('You Win!', 'Winnings: ' + winAmount, false)
                    embed.setFooter({ text: 'Balance: ' + bal })

                    await collection.updateOne({ userId: user.id, guildId: guild.id }, { $set: { coins: bal } })

                    interaction.reply({
                        embeds: [embed]
                    })
                } else if (botMove == 'rock' && move == 'rock' || botMove == 'paper' && move == 'paper' || botMove == 'scissors' && move == 'scissors') {
                    // Tie
                    var bal = doc.coins

                    embed.setColor('ORANGE')
                    embed.addField('Tie!', 'You didnt win or lose anything')
                    embed.setFooter({ text: 'Balance: ' + bal })

                    interaction.reply({
                        embeds: [embed]
                    })
                } else if (botMove == 'rock' && move == 'paper' || botMove == 'paper' && move == 'scissors' || botMove == 'scissors' && move == 'rock') {
                    // Bot Wins
                    var bal = doc.coins - bet

                    embed.setColor('RED')
                    embed.addField('You Lost!', 'Lossings: ' + bet, false)
                    embed.setFooter({ text: 'Balance: ' + bal })

                    await collection.updateOne({ userId: user.id, guildId: guild.id }, { $set: { coins: bal } })

                    interaction.reply({
                        embeds: [embed]
                    })
                }

                cooldown.add(user.id + '--' + cmdName);
                setTimeout(() => {
                    cooldown.delete(user.id + '--' + cmdName);
                }, oneMinCooldown);

                cmdRun(user,cmdName)
            }
        }
    }
}

// shop command
async function shopCmd(user,guild,interaction) {
    const cmdName = 'shop'

    var collection = db.collection('economy')
    const shopData = await collection.findOne({ shop: true })
    const doc = await collection.findOne({ userId: user.id, guildId: guild.id })

    const embed = new MessageEmbed()

    if (doc == null) {
        embed.setTitle('Seed Shop | Balance: 0')
    } else {
        embed.setTitle('Seed Shop | Balance: ' + doc.coins)
    }

    embed.setDescription('Buy any items with `\`/buy [item id]`\`')
    embed.setFields([
        { name: 'Fishing Poles', value: '> `\`' + shopData.items.i_1.id + '`\` - ' + shopData.items.i_1.name + ': ' + shopData.items.i_1.description + ' Price: **' + shopData.items.i_1.price + '**', inline: false },
        { name: 'Pickaxes', value: '> `\`' + shopData.items.i_2.id + '`\` - ' + shopData.items.i_2.name + ': ' + shopData.items.i_2.description + ' Price: **' + shopData.items.i_2.price + '**\n' + '> `\`' + shopData.items.i_3.id + '`\` - ' + shopData.items.i_3.name + ': ' + shopData.items.i_3.description + ' Price: **' + shopData.items.i_3.price + '**\n' + '> `\`' + shopData.items.i_4.id + '`\` - ' + shopData.items.i_4.name + ': ' + shopData.items.i_4.description + ' Price: **' + shopData.items.i_4.price + '**\n' + '> `\`' + shopData.items.i_5.id + '`\` - ' + shopData.items.i_5.name + ': ' + shopData.items.i_5.description + ' Price: **' + shopData.items.i_5.price + '**\n' + '> `\`' + shopData.items.i_6.id + '`\` - ' + shopData.items.i_6.name + ': ' + shopData.items.i_6.description + ' Price: **' + shopData.items.i_6.price + '**\n', inline: false }
    ])

    interaction.reply({
        embeds: [embed]
    })
    
    cmdRun(user,cmdName)
}

async function buyCmd(user,guild,interaction,shopId) {
    const cmdName = 'buy'

    var collection = db.collection('economy')
    const shopData = await collection.findOne({ shop: true })
    const doc = await collection.findOne({ userId: user.id, guildId: guild.id })
    const itemData = shopData.items['i_' + shopId]

    if (doc == null) {
        const embed = new MessageEmbed()
        .setTitle('You have no coins')
        .setDescription('Run `\`/daily`\` to get some')
        .setColor('RED')

        interaction.reply({
            embeds: [embed],
            ephemeral: true
        })
    }

    if (doc.coins < itemData.price) {
        const embed = new MessageEmbed()
        .setTitle('You do not have enough coins to buy that')
        .setDescription('Balance: ' + doc.coins)
        .setColor('RED')

        interaction.reply({ 
            emebds: [embed],
            ephemeral: true
        })
    } else {
        if (doc['i_' + shopId] != null && !itemData.stackable || doc['i_' + shopId] != undefined && !itemData.stackable ) {
            const embed2 = new MessageEmbed()
            .setTitle('That item is not stackable, you already own one')
            .setColor('RED')

            interaction.reply({ 
                embeds: [embed2],
                ephemeral: true
            })
        } else {
            const userUpdateItemData = {
                durability: itemData.durability,
                name: itemData.name
            }
            const bal = doc.coins - itemData.price

            await collection.updateOne({ userId: user.id, guildId: guild.id }, { $set: { ['i_' + shopId]: userUpdateItemData, coins: bal } })

            const embed3 = new MessageEmbed()
            .setTitle('Purchased ' + itemData.name + ' Successfully')
            .setDescription('Balance: ' + bal)
            .setColor('GREEN')

            interaction.reply({
                embeds: [embed3]
            })
        }
        cmdRun(user,cmdName)
    }

}

// Fish Command
async function fishCmd(user,guild,interaction) {
    const cmdName = 'fish'

    if (cooldown.has(user.id + '--' + cmdName)) {
        const embed = new MessageEmbed()

        .setTitle(cdList[Math.floor(Math.random() * cdList.length)])
        .setDescription('That command can only be run once every five minutes')
        .setColor('RED')
        interaction.reply({
            embeds: [embed],
            ephemeral: true
        })
        return
    }

    const collection = db.collection('economy')
    const doc = await collection.findOne({ userId: user.id, guildId: guild.id })

    if (doc.i_1 == null) {
        const noPoleEmbed = new MessageEmbed()
        .setTitle('Error: You do not have a fishing pole.')
        .setDescription('Use `\`/buy 1`\` to get one')
        .setColor('RED')

        interaction.reply({
            embeds: [noPoleEmbed],
            ephemeral: true
        })
    } else { 
        if (doc.i_1.durability <= 0) {
            const embed = new MessageEmbed()
            .setTitle('Your fishing pole is broken!')
            .setDescription('Buy a new one using `\`/buy 1`\`')
            .setColor('RED')

            await collection.updateOne({ userId: user.id, guildId: guild.id }, { $set: { i_1: null } })

            interaction.reply({
                embeds: [embed],
                ephemeral: true
            })
        } else {
            const fishList = ['f10','f10','f10','f10','f10','f10','f10','f10','f10','f10','f10','f10','f1', 'f1','f1','f1','f1','f1','f1','f1','f2', 'f2','f2','f2','f2','f2','f2','f2','Carp', 'f3','f3','f3','f3','f3','f4', 'f4','f4','f4','f5', 'f5','f5','f5','f5','f5','f6', 'f6','f6','f7', 'f7','f7','f8','f8','f8','f8','f8','f8','f8','f8','f8','f8','f8','f8','f9']
            const fishToFetch = fishList[Math.floor(Math.random() * fishList.length)]
    
            const fishDoc = await collection.findOne({ shop: true })
            const fish = fishDoc.fish[fishToFetch]
            const fishPole = doc.i_1
        
            const newBalance = doc.coins + fish.price
    
            const embed = new MessageEmbed()
            
            if (fish.name == 'Nothing') {
                embed.setTitle('You caught nothing :(')
                embed.setDescription('You lost 10 coins')
                embed.setFooter({ text: 'Balance: ' + newBalance })
                embed.setColor("RED")
    
                await collection.updateOne({ userId: user.id, guildId: guild.id }, { $set: { coins: newBalance } })
    
                interaction.reply({
                    embeds: [embed]
                })
            } else {
                const newDurability = fishPole.durability - fish.damage || fishPole.durability
    
                embed.setTitle('You caught a ' + fish.name)
                embed.setDescription('You earned **' + fish.price + ' Coins**\n Fishing Pole Durability: ' + newDurability)
                embed.setFooter({ text: 'Balance: ' + newBalance })
                embed.setColor('GREEN')
    
                await collection.updateOne({ userId: user.id, guildId: guild.id }, { $set: { i_1: { name: 'Basic Pole', durability: newDurability }, coins: newBalance } })
    
                interaction.reply({
                    embeds: [embed]
                })
            }   

            cooldown.add(user.id + '--' + cmdName);
                setTimeout(() => {
                    cooldown.delete(user.id + '--' + cmdName);
                }, fiveMinCooldown);

                cmdRun(user,cmdName)
            
        }
    }
}

// Vote command
async function voteCmd(user,guild,interaction) {
    const cmdName = 'vote'

    if (cooldown.has(user.id + '--' + cmdName)) {
        const embed = new MessageEmbed()
        .setTitle(cdList[Math.floor(Math.random() * cdList.length)])
        .setDescription('That command can only be run once every 12 hours')
        .setColor('RED')
        interaction.reply({
            embeds: [embed],
            ephemeral: true
        })
        return
    }

    const embed = new MessageEmbed()
    .setTitle('Vote for Seeds on Top.gg')
    .setDescription('Click the "Vote Here" button to vote then click the "I Voted" button to get your coins!')
    .setColor(mainHex)

    const row = new MessageActionRow()
        .addComponents(
            new MessageButton()
                .setURL('https://top.gg/bot/968198214450831370/vote')
                .setLabel('Vote Here')
                .setStyle('LINK'),

            new MessageButton()
                .setCustomId('voted')
                .setLabel('I Voted')
                .setStyle('SUCCESS'),

        )
    interaction.reply({
        embeds: [embed],
        ephemeral: true,
        components: [row]
    })

        client.on('interactionCreate', interaction2 => {
            if (!interaction2.isButton()) return;

            if (interaction2['customId'] == 'voted') {
                
                const url = `https://top.gg/api/bots/${process.env.APP_ID}/check?userId=${user.id}`;

                const req = axios.get(url, {
                    headers: {
                        'Authorization': `${process.env.TOPGG_TOKEN}`
                    }
                }).then((res) => {
                    if (res.status != 200) {
                        const embed2 = new MessageEmbed()
                        .setTitle('ERROR')
                        .setDescription('An error occured while trying to get your vote status. Please try again later. If this error persists, please join the [Support Server](https://seedsbot.xyz/support).')
                        .setColor('RED')

                        interaction.editReply({
                            embeds: [embed2],
                            ephemeral: true,
                            components: []
                        })
                    }

                    else {

                        if (res['data'] === 0) {
                            const embed2 = new MessageEmbed()
                            .setTitle('You have not voted yet!')
                            .setDescription('Please vote using the "Vote Here" button.')
                            .setColor('RED')

                            interaction.editReply({
                                embeds: [embed2],
                                ephemeral: true,
                                components: [row]
                            })
                        } else {

                            const coll = db.collection('economy')
                            const doc = coll.findOne({ userId: user.id, guildId: guild.id }).then((data) => {

                                if (data == null) {
                                    const embed2 = new MessageEmbed()
                                    .setTitle('You dont have any coins!')
                                    .setDescription('Please use the `\`/daily`\` command to get some then try again.')
                                    .setColor('RED')
    
                                    interaction.editReply({
                                        embeds: [embed2],
                                        ephemeral: true,
                                        components: []
                                    })
                                } else {
    
                                    const newBalance = data.coins + 1000
    
                                    coll.updateOne({ userId: user.id, guildId: guild.id }, { $set: { coins: newBalance } }).then(() => {
    
                                        const embed2 = new MessageEmbed()
                                        .setTitle('Thank you for voting!')
                                        .setDescription('We have recieved your vote and 1000 coins have been added to your balance. \n\nPlease vote again in 12 hours to recieve more coins!')
                                        .setColor('GREEN')
            
                                        interaction.editReply({
                                            embeds: [embed2],
                                            ephemeral: false,
                                            components: []
                                        })
                                    })
    
                                }

                            })
                            
                        }

                    }
                });

            } 
        })

    cooldown.add(user.id + '--' + cmdName);
    setTimeout(() => {
        cooldown.delete(user.id + '--' + cmdName);
    }, twelveHourCooldown);

    cmdRun(user,cmdName)
}

// Utility Commands
// Stats
function statsCmd(user,guild,interaction) {
    const cmdName = 'stats'

    const guilds = client.guilds.cache.size

    const cpu = osu.cpu
    const mem = osu.mem
    const uptime = Math.round(client.uptime / 1000 / 60 / 60 / 24)

    cpu.usage().then(cpuPercentage => {
        mem.info().then(info => {
            const embed = new MessageEmbed()
                .setColor(mainHex)
                .setTitle('Jams Stats')
                .setThumbnail('https://seedsbot.xyz/images/logo.png')
                .addField("Servers:", `${guilds}`, true)
                .addField('CPU %:', `${cpuPercentage}`, true)
                .addField('Mem. %:', `${info.freeMemPercentage}%`, true)
                .addField('Ping:', `${Math.round(client.ws.ping)}ms`, true)
                .addField('Uptime:', `${uptime} Days`, true)
                .addField('Library:', 'Discord.JS', true)
                .addField('Links', '[🌐 Website](https://seedsbot.xyz) | [<:invite:823987169978613851> Invite](https://seedsbot.xyz/invite) | [<:discord:823989269626355793> Support](https://seedsbot.xyz/support)')
            interaction.reply({
                embeds: [embed],
            })
            cmdRun(user,cmdName)
        });
    });
} 

// Random color command
async function rcolorCmd(user,guild,interaction) {
    const cmdName = 'rcolor'

    const r = Math.round(Math.random() * 256)
    const g = Math.round(Math.random() * 256)
    const b = Math.round(Math.random() * 256)
    const rgb = `(${r},${g},${b})`

    const data = await axios({
        method: 'get',
        url: `https://www.thecolorapi.com/id?rgb=rgb${rgb}`,
        responseType: 'json'
    })
    const res = data['data']
    const hexClean = res['hex']['clean']
    const hex = res['hex']['value']
    const name = res['name']['value']

    const embed = new MessageEmbed()
    .setTitle(name)
    .setURL(`https://www.color-hex.com/color/${hexClean}`)
    .setDescription(hex)
    .setImage(`https://singlecolorimage.com/get/${hexClean}/125x125`)
    .setColor(hex)

    interaction.reply({
        embeds: [embed]
    })

    cmdRun(user,cmdName)
}

// poll command
async function pollCmd(user,guild,interaction,option1,option2) {
    const cmdName = 'poll'

    const embed = new MessageEmbed()
        .setTitle(`Poll:`)
        .setDescription(`1️⃣: ${option1}\n\n2️⃣: ${option2}`)


    const message = await interaction.reply({
        embeds: [embed],
        fetchReply: true
    })

    message.react('1️⃣')
    message.react('2️⃣')

    cmdRun(user,cmdName)
}

// Coinflip command
function coinflipCmd(user, guild, interaction) {
    const cmdName = 'coinflip'

    const choice = Math.round(Math.random())
    
    if (choice === 1) {
        const embed = new MessageEmbed()
        .setTitle('<:simp_coin:824720566241853460> Heads!')
        .setColor('GOLD')
        
        cmdRun(user, cmdName)
        
        interaction.reply({
            embeds: [embed]
        })

    } else {
        const embed = new MessageEmbed()
        .setTitle('<:fuck_coin:824720614543196220> Tails!')
        .setColor('GOLD')
        
        cmdRun(user, cmdName)

        interaction.reply({
            embeds: [embed]
        })
    }
}

// Bot idea system
// recommend idea
async function botideaCmd(user, guild, interaction, idea) {
    const cmdName = 'botidea'

    if (cooldown.has(user.id + '--' + cmdName)) {
        const embed = new MessageEmbed()

        .setTitle(cdList[Math.floor(Math.random() * cdList.length)])
        .setDescription('That command can only be run once every week.')
        .setColor('RED')
        interaction.reply({
            embeds: [embed],
            ephemeral: true
        })
        return
    }

    const ideaId = Math.floor(Math.random() * 10000)

    const embed = new MessageEmbed()
        .setTitle('Your idea has been submitted! | ID: ' + ideaId)
        .setDescription(`Thank you for your idea! View it in #bot-ideas in the [Support Server](https://seedsbot.xyz/support) \n\n**Idea:** ${idea}`)
        .setColor(mainHex)

    const botIdeaChannel = client.channels.cache.find(channel => channel.id === '1006830410812096532')

    const embed2 = new MessageEmbed()
        .setTitle(`Idea #${ideaId}`)
        .setDescription(`**Idea:** ${idea}\n\nSubmitted by: <@${user.id}>`)
        .setColor(mainHex)

    const message = await botIdeaChannel.send({ embeds: [embed2] })

    const coll = db.collection('botIdeas')
    await coll.insertOne({
        ideaId: ideaId,
        idea: idea,
        submittedBy: user.id,
        submitterGuildId: guild.id,
        submittedAt: new Date(),
        messageId: message.id,
        botideaChannelId: message.channelId,
        botideaGuildId: message.guildId,
        status: 'pending'
    })

    message.react('👍')
    message.react('👎')

    interaction.reply({
        embeds: [embed],
        ephemeral: true
    })

    cooldown.add(user.id + '--' + cmdName);
    setTimeout(() => {
        cooldown.delete(user.id + '--' + cmdName);
    }, OneWeekCooldown);

    cmdRun(user, cmdName)
}

// eventually add admin commands

 

// Run Bot
// client.login(process.env.BETA_TOKEN);
client.login(process.env.TOKEN)