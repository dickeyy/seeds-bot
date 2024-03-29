const { Client, GatewayIntentBits, WebhookClient } = require('discord.js');
const intents = [
    GatewayIntentBits.Guilds, 
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildModeration,
    GatewayIntentBits.GuildEmojisAndStickers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildInvites,
    GatewayIntentBits.MessageContent
]
const client = new Client({ intents: intents });
const { REST } = require('@discordjs/rest');
const { Routes, InteractionResponseType } = require('discord-api-types/v9');
const dotenv = require('dotenv');
const { connectDb, connectSql } = require('./utils/db.js');
const { log } = require('./functions/log.js');
const { redis } = require('./utils/redis.js');

// Define Dev Mode
const devMode = false

// Dotenv initialize 
dotenv.config();

// register webhook client
const consoleWebhookClient = new WebhookClient({ url: process.env.WEBHOOK_URL });

// Connect to Mongo
const db = connectDb()

// Connect redis
redis.connect()
redis.on('connect', (err) => {
    if (err) throw err;
    console.log('Redis connected')
    log('info', 'Redis connected')
})

// if redis disconnects, try to reconnect
redis.on('error', (err) => {
    if (err) throw err;
    console.log('Redis disconnected')
    log('info', 'Redis disconnected')
    redis.connect()
})

// Connect to SQL
// const sql = connectSql()
// // test sql connection
// sql.query('SELECT * FROM `guilds`', (err, rows) => {
//     if (err) throw err;
//     console.log('SQL connected')
//     log('info', 'SQL connected')
// })

// Export stuff
module.exports = { client, consoleWebhookClient, devMode, redis, db };

// Import Events
const { readyEvent } = require('./events/ready.js');
const { guildCreateEvent } = require('./events/guildCreate.js');
const { guildDeleteEvent } = require('./events/guildDelete.js');
const { guildMemberAddEvent } = require('./events/guildMemberAdd.js');
const { guildMemberRemoveEvent } = require('./events/guildMemberRemove.js');
const { channelCreateEvent } = require('./events/channelCreate.js');
const { channelDeleteEvent } = require('./events/channelDelete.js');
const { channelPinsUpdateEvent } = require('./events/channelPinsUpdate.js');
const { channelUpdateEvent } = require('./events/channelUpdate.js');
const { emojiCreateEvent } = require('./events/emojiCreate.js');
const { emojiDeleteEvent } = require('./events/emojiDelete.js');
const { emojiUpdateEvent } = require('./events/emojiUpdate.js');
const { guildBanAddEvent } = require('./events/guildBanAdd.js');
const { guildBanRemoveEvent } = require('./events/guildBanRemove.js');
const { guildUpdateEvent } = require('./events/guildUpdate.js');
const { inviteCreateEvent } = require('./events/inviteCreate.js');
const { inviteDeleteEvent } = require('./events/inviteDelete.js');
const { roleCreateEvent } = require('./events/roleCreate.js');
const { roleDeleteEvent } = require('./events/roleDelete.js');
const { roleUpdateEvent } = require('./events/roleUpdate.js');
const { stickerCreateEvent } = require('./events/stickerCreate.js');
const { stickerDeleteEvent } = require('./events/stickerDelete.js');
const { stickerUpdateEvent } = require('./events/stickerUpdate.js');
const { threadCreateEvent } = require('./events/threadCreate.js');
const { threadDeleteEvent } = require('./events/threadDelete.js');
const { threadUpdateEvent } = require('./events/threadUpdate.js');
const { guildMemberUpdateEvent } = require('./events/guildMemberUpdate.js');
const { messageDeleteEvent } = require('./events/messageDelete.js');
const { messageUpdateEvent } = require('./events/messageUpdate.js');
const { messageDeleteBulkEvent } = require('./events/messageDeleteBulk.js');
const { messageReactionAddEvent } = require('./events/messageReactionAdd.js');
const { messageCreateEvent } = require('./events/messageCreate.js');

// Import Commands
const commands = require('./commands.js').commands
const { commandHandler } = require('./commandHandler.js');

// Import Cron Jobs
const { refreshHistory, clearLogs, redisBackup } = require('./cronJobs.js');

// Process errors
process.on('uncaughtException', async function (error) {
    console.log('error', error.stack)
    log('error', error.stack)
});

process.on('unhandledRejection', async function (error) {
    console.log('error', error.stack)
    log('error', error.stack)
});

process.on('exit', async function (error) {
    console.log('error', error.stack)
    log('error', error.stack)
});

// Register slash commands
let rest;
if (devMode) rest = new REST({ version: '9' }).setToken(process.env.BETA_TOKEN);
else rest = new REST({ version: '9' }).setToken(process.env.TOKEN);

(async () => {
    try {
        console.log('Started refreshing application (/) commands.');
        
        if (devMode) await rest.put(
            Routes.applicationGuildCommands(process.env.BETA_APP_ID, '1005778938108325970', '961272863363567636', '731445738290020442'),
            {body: commands},
        );
        else {
            await rest.put(
                Routes.applicationCommands(process.env.APP_ID),
                {body: commands},
            );
        }    
        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
})();

// Client Events
// Recive slash commands
client.on('interactionCreate', async interaction => {
    commandHandler(interaction)
})

// When the bot is ready
client.on('ready', () => {
    readyEvent()
});

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

// channel create
client.on('channelCreate', async channel => {
    channelCreateEvent(channel)
})

// channel delete
client.on('channelDelete', async channel => {
    channelDeleteEvent(channel)
})

// channel pins update
client.on('channelPinsUpdate', async (channel, time) => {
    channelPinsUpdateEvent(channel)
})

// channel update
client.on('channelUpdate', async (oldChannel, newChannel) => {
    channelUpdateEvent(oldChannel, newChannel)
})

// emoji create
client.on('emojiCreate', async emoji => {
    emojiCreateEvent(emoji)
})

// emoji delete
client.on('emojiDelete', async emoji => {
    emojiDeleteEvent(emoji)
})

// emoji update
client.on('emojiUpdate', async (oldEmoji, newEmoji) => {
    emojiUpdateEvent(oldEmoji, newEmoji)
})

// guild ban add
client.on('guildBanAdd', async (ban) => {
    guildBanAddEvent(ban)
})

// guild ban remove
client.on('guildBanRemove', async (ban) => {
    guildBanRemoveEvent(ban)
})

// guild update
client.on('guildUpdate', async (oldGuild, newGuild) => {
    guildUpdateEvent(oldGuild, newGuild)
})

// invite create
client.on('inviteCreate', async invite => {
    inviteCreateEvent(invite)
})

// invite delete
client.on('inviteDelete', async invite => {
    inviteDeleteEvent(invite)
})

// role create
client.on('roleCreate', async role => {
    roleCreateEvent(role)
})

// role delete
client.on('roleDelete', async role => {
    roleDeleteEvent(role)
})

// role update
client.on('roleUpdate', async (oldRole, newRole) => {
    roleUpdateEvent(oldRole, newRole)
})

// sticker create
client.on('stickerCreate', async sticker => {
    stickerCreateEvent(sticker)
})

// sticker delete
client.on('stickerDelete', async sticker => {
    stickerDeleteEvent(sticker)
})

// sticker update
client.on('stickerUpdate', async (oldSticker, newSticker) => {
    stickerUpdateEvent(oldSticker, newSticker)
})

// thread create
client.on('threadCreate', async thread => {
    threadCreateEvent(thread)
})

// thread delete
client.on('threadDelete', async thread => {
    threadDeleteEvent(thread)
})

// thread update
client.on('threadUpdate', async (oldThread, newThread) => {
    threadUpdateEvent(oldThread, newThread)
})

// guild member update
client.on('guildMemberUpdate', async (oldMember, newMember) => {
    guildMemberUpdateEvent(oldMember, newMember)
})

// message delete
client.on('messageDelete', async message => {
    messageDeleteEvent(message)
})

// message update
client.on('messageUpdate', async (oldMessage, newMessage) => {
    messageUpdateEvent(oldMessage, newMessage)
})

// message delete bulk
client.on('messageDeleteBulk', async messages => {
    messageDeleteBulkEvent(messages)
})

// message reaction add
client.on('messageReactionAdd', async (reaction, user) => {
    messageReactionAddEvent(reaction, user)
})

// message create
client.on('messageCreate', async message => {
    // messageCreateEvent(message)
})

// Cron Jobs
refreshHistory.start();
clearLogs.start();
// redisBackup.start();

// Run Bot
if (devMode) {
    client.login(process.env.BETA_TOKEN);
} else {
    client.login(process.env.TOKEN)
}