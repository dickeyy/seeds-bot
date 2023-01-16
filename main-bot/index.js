const { Client, Intents, MessageEmbed, Constants, MessageActionRow, MessageButton, Interaction, Permissions, Message, } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_BANS, Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_INVITES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS] });
const { REST } = require('@discordjs/rest');
const { Routes, InteractionResponseType } = require('discord-api-types/v9');
const dotenv = require('dotenv');
const { connectRedis } = require('./utils/redis.js');

// Dotenv initialize 
dotenv.config();

// Export Client
exports.client = client;

// redis test
const redis = connectRedis();
console.log(redis);

// Import Functions
const { log } = require('./functions/log.js');

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

// Import Commands
const commands = require('./commands.js').commands
const { commandHandler } = require('./commandHandler.js');

// Import Cron Jobs
const { refreshHistory } = require('./cronJobs.js');
const { messageReactionAddEvent } = require('./events/messageReactionAdd.js');

// Process errors
process.on('uncaughtException', async function (error) {
    console.log(error.stack);

    var logData = `${error.stack}\n`
    await log(logData)
});

// Register slash commands
// const rest = new REST({ version: '9' }).setToken(process.env.TOKEN);
const rest = new REST({ version: '9' }).setToken(process.env.BETA_TOKEN);

(async () => {
    try {
      console.log('Started refreshing application (/) commands.');
  
      await rest.put(
        Routes.applicationGuildCommands(process.env.BETA_APP_ID, '1005778938108325970', '961272863363567636', '731445738290020442'),
        // Routes.applicationCommands(process.env.APP_ID),
        {body: commands},
      );    
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

// Cron Jobs
refreshHistory.start();

// Run Bot
client.login(process.env.BETA_TOKEN);
// client.login(process.env.TOKEN)