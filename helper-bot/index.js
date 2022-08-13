const { Client, Intents, MessageEmbed, Constants, MessageActionRow, MessageButton, Interaction, Permissions, Message, } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_BANS, Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS] });
const { REST } = require('@discordjs/rest');
const { Routes, InteractionResponseType } = require('discord-api-types/v9');
const dotenv = require('dotenv');
const { MongoClient, ServerApiVersion } = require('mongodb')
const osu = require('node-os-utils');
const axios = require('axios').default

// Process errors
process.on('uncaughtException', async function (error) {
    console.log(error.stack);
});

// Dotenv initialize 
dotenv.config();

// Connect to Mongo
const MongoUri = process.env.MONGO_URI;
const mClient = new MongoClient(MongoUri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
mClient.connect();
const db = mClient.db('main');
console.log('MongoDB Connected')

// Define Colors
const mainHex = '#d79a61'

// Write Command Definitions
const commands = [

  
    
]

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
    client.user.setActivity('Seeds', { type: 'WATCHING' });
    console.log(`Logged in as: ${client.user.tag}`)
});

// Recive slash commands
client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;
    const { commandName, options, user, guild, channel, ChannelData } = interaction

    
})

// bot functions

// Run Bot
client.login(process.env.TOKEN)