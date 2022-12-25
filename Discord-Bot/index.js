const { Client, Intents, MessageEmbed, Constants, MessageActionRow, MessageButton, Interaction, Permissions, Message, } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_BANS, Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS] });
exports.client = client;
const { REST } = require('@discordjs/rest');
const { Routes, InteractionResponseType } = require('discord-api-types/v9');
const dotenv = require('dotenv');
const cron = require('cron');

// Import Functions
const { log } = require('./functions/log.js');

// Import Utils
const { connectDb } = require('./utils/db.js');

// Import Events
const { readyEvent } = require('./events/ready.js');
const { guildCreateEvent } = require('./events/guildCreate.js');
const { guildDeleteEvent } = require('./events/guildDelete.js');
const { guildMemberAddEvent } = require('./events/guildMemberAdd.js');
const { guildMemberRemoveEvent } = require('./events/guildMemberRemove.js');

// Import Commands
const commands = require('./commands.js').commands

const helpCmd = require('./commands/help.js').helpCmd

// Moderation Commands
const banCmd = require('./commands/moderation/ban.js').banCmd
const kickCmd = require('./commands/moderation/kick.js').kickCmd
const unbanCmd = require('./commands/moderation/unban.js').unbanCmd
const warnCmd = require('./commands/moderation/warn.js').warnCmd
const deletecaseCmd = require('./commands/moderation/deletecase.js').deletecaseCmd
const casesCmd = require('./commands/moderation/cases.js').casesCmd
const setreportchannelCmd = require('./commands/moderation/setreportchannel.js').setreportchannelCmd
const reportCmd = require('./commands/moderation/report.js').reportCmd

// Fun Commands
const aiCmd = require('./commands/fun/ai.js').aiCmd
const tshCmd = require('./commands/fun/tsh.js').tshCmd
const coinflipCmd = require('./commands/fun/coinflip.js').coinflipCmd

// Economy Commands
const balanceCmd = require('./commands/economy/balance.js').balanceCmd
const begCmd = require('./commands/economy/beg.js').begCmd
const dailyCmd = require('./commands/economy/daily.js').dailyCmd
const slotsCmd = require('./commands/economy/slots.js').slotsCmd
const mineCmd = require('./commands/economy/mine.js').mineCmd
const fishCmd = require('./commands/economy/fish.js').fishCmd
const rpsCmd = require('./commands/economy/rps.js').rpsCmd
const shopCmd = require('./commands/economy/shop.js').shopCmd
const buyCmd = require('./commands/economy/buy.js').buyCmd
const highlowCmd = require('./commands/economy/highlow.js').highlowCmd
const voteCmd = require('./commands/economy/vote.js').voteCmd

// Utility Commands
const botideaCmd = require('./commands/utility/botidea.js').botideaCmd
const pollCmd = require('./commands/utility/poll.js').pollCmd
const rcolorCmd = require('./commands/utility/rcolor.js').rcolorCmd
const statsCmd = require('./commands/utility/stats.js').statsCmd

// Process errors
process.on('uncaughtException', async function (error) {
    console.log(error.stack);

    var logData = `${error.stack}\n`
    await log(logData)
});

// Dotenv initialize 
dotenv.config();

// // Connect to Mongo
const db = connectDb();

// Register slash commands
const rest = new REST({ version: '9' }).setToken(process.env.TOKEN);
// const rest = new REST({ version: '9' }).setToken(process.env.BETA_TOKEN);

(async () => {
    try {
      console.log('Started refreshing application (/) commands.');
  
      await rest.put(
        // Routes.applicationGuildCommands(process.env.BETA_APP_ID, '801360477984522260', '961272863363567636', '731445738290020442'),
        Routes.applicationCommands(process.env.APP_ID),
        {body: commands},
      );    
      console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
      console.error(error);
    }
})();

// When the bot is ready
client.on('ready', () => {
    readyEvent()
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

    if (commandName == 'mine') {
        await mineCmd(user,guild,interaction)
    }

    if (commandName == 'setreportchannel') {
        const reportChannel = options.getChannel('channel')
        await setreportchannelCmd(user,guild,interaction,reportChannel)
    }

    if (commandName == 'report') {
        const reportUser = options.getUser('user')
        const reason = options.getString('reason')
        await reportCmd(user,guild,interaction,reportUser,reason)
    }
})

// Client Events
// Bot joins a server
client.on('guildCreate', async guild => {
    guildCreateEvent(guild)
})

// When the bot leaves a server
client.on('guildDelete', async guild => {
    guildDeleteEvent(guild)
})

// User joins a server
client.on('guildMemberAdd', async member => {
    guildMemberAddEvent(member)
})

// User leaves a server
client.on('guildMemberRemove', async member => {
    guildMemberRemoveEvent(member)
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

// Run Bot
// client.login(process.env.BETA_TOKEN);
client.login(process.env.TOKEN)