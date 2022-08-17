const { Client, Intents, MessageEmbed, Constants, MessageActionRow, MessageButton, Interaction, Permissions, Message, MessageAttachment } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_BANS, Intents.FLAGS.GUILD_PRESENCES, Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS] });
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

// Pemissions numbers
const ADMIN_PERM = 0x0000000000000008

// Write Command Definitions
const commands = [
  // Rules Command
  { 
    name: "rules", 
    description: "Sends the rules message" 
  },

  // Suggestion system
  { 
    name: "botidea", 
    description: "Control the ideas in #bot-ideas", 
    default_member_permissions: ADMIN_PERM, 
    options: [ 
      { 
        name: 'approve', 
        description: 'Approve a bot idea', 
        type: 1, 
        options: [
          { 
            name: 'id', 
            description: 'The bot idea #', 
            required: true, 
            type: Constants.ApplicationCommandOptionTypes.INTEGER 
          }
        ] 
      },
      {
        name: 'deny',
        description: 'Deny a bot idea',
        type: 1,
        options: [
          {
            name: 'id',
            description: 'The bot idea #',
            required: true,
            type: Constants.ApplicationCommandOptionTypes.INTEGER
          }
        ]
      } 
    ] 
  },
  
  // Logs Command
  {
    name: "logs",
    description: "Get logs for the bot",
    default_member_permissions: ADMIN_PERM,
    options: [
      {
        name: 'date',
        description: 'Specify a date (YYYY-MM-DD) if none, default to today',
        required: false,
        type: Constants.ApplicationCommandOptionTypes.STRING
      }
    ]
  }

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
    client.user.setStatus('dnd');
    console.log(`Logged in as: ${client.user.tag}`)
});

// Recive slash commands
client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;
    const { commandName, options, user, guild, channel, ChannelData } = interaction

  if (commandName == 'rules') {
    rulesCmd(user,guild,interaction)
  }

  if (commandName == 'botidea') {
    const id = options.getInteger('id')

    if (options.getSubcommand() === 'approve') {
      botIdeaApproveCmd(user, guild, interaction, id)
    } else {
      botIdeaDenyCmd(user, guild, interaction, id)
    }
  }

  if (commandName == 'logs') {
    const dateArg = options.getString('date')

    logsCmd(user, guild, interaction, dateArg)
  }
})

// Check if is bot owner
function isBotOwner(id) {
  if (id === process.env.BOT_OWNER_ID) {
    return true;
  } else {
    return false;
  }
}

const notOwnerEmbed = new MessageEmbed()
.setTitle('ERROR: Permission Denied')
.setColor('RED')
.setDescription('Only <@' + process.env.BOT_OWNER_ID + '> or a bot admin can use this command.')

// Command run 
function cmdRun(user,cmdName) {
  var today = new Date();
  var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
  var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

  console.log(`${date} ${time} | ${user.tag} - ${cmdName}`)
}

// bot functions

// Watch for presence update
client.on("presenceUpdate", function (oldPresence, newPresence) {
  if (oldPresence == null) return

  const progression = `${oldPresence.status} -> ${newPresence.status}`
  const channel = client.channels.cache.find(channel => channel.id === '1005780010025635901')

	if (newPresence.userId == '968198214450831370') { 

    if (progression == 'online -> offline') {

      const embed = new MessageEmbed()
      .setTitle(':red_circle:  Seeds is Offline')
      .setDescription('We have detected an outage effecting all users. Please be patient while we work to get Seeds back up.')
      .setColor('RED')

      channel.send({
        embeds: [embed]
      }).then(() => {})

    } else if (progression == 'offline -> online') {

      const embed2 = new MessageEmbed()
      .setTitle(':green_circle:  Seeds is Online')
      .setDescription('Seeds is back online and should be up and running in all servers shortly. Thank you for your patience.')
      .setColor('GREEN')

      channel.send({
        embeds: [embed2]
      }).then(() => {})

    }
  }
})

// rules command
function rulesCmd(user, guild, interaction) {
  const cmdName = 'rules' 

  const embed = new MessageEmbed()
  .setTitle('---------- RULES ----------\n')
  .setColor(mainHex)
  .setDescription('Please read all the following rules.')
  .setFields([
    { name: 'Follow Discord ToS', value: "- You are required to follow Discord's TOS at all times, they can be found at https://discord.com/terms", inline: false },
    { name: 'Respect People', value: "- Please respect everyone's opinions and views, just be a good person.", inline: false },
    { name: 'No Racism / Discrimination', value: "- Racism and discrimination of any kind are strictly prohibited. Any discrimination will result in an immediate ban.", inline: false },
    { name: "Respect Channel Topics", value: "- Please post things in the correct channels to keep the server clean and organized.", inline: false }, 
    { name: "No NSFW Content", value: "- Don't post NSFW content of any kind (i.e. pictures, videos, sexual messages...). This is not a dating server." },
    { name: "No Advertisments", value: "- Any self-promo / advertisements of any kind is looked down on, unless posted in the correct channel.", inline: false },
    { name: "No Spamming", value: "- Spam of any kind is prohibited. This includes mic spam, text spam, image spam, reaction spam, emote spam, etc.", inline: false },
    { name: "Listen to Staff", value: "- Respect mods and admins. Punishments can be handed out at the staffs discretion, don't get upset.", inline: false },
    { name: "More Stuff", value: "`\`1.`\` 'Edgy' jokes are tolerated to an extent.\n`\`2.`\` Keep beef out of the server.\n`\`3.`\` Impersonation is discouraged but tolerated as long as it's harmless\n`\`4.`\` No Doxxing / IP grabbing of any kind.\n`\`5.`\` No exploitative scripts / programs.\n`\`6.`\` This is not an E-Dating server.\n`\`7.`\` Epileptic sensitive imagery / sounds are not permitted.\n`\`8.`\` Non-taggable names are not permitted.\n`\`9.`\` Recording people without their consent is not permitted.", inline: false }
  ])
  .setFooter({ text: 'Moderators can punish even if rule is not listed. || Updated: August 13, 2022' })

  interaction.reply({
    embeds: [embed]
  })

  cmdRun(user,cmdName)
}

// Bot idea system
// Approve
async function botIdeaApproveCmd(user, guild, interaction, id) {
  const cmdName = 'botidea-approve' 

  const coll = db.collection('botIdeas')
  const doc = await coll.findOne({ ideaId: id })

  if (doc === null) {

    const embed = new MessageEmbed()
    .setTitle('ERROR: No such idea ID exists.')
    .setDescription('Please check the ID and try again')
    .setColor('RED')

    interaction.reply({
      embeds: [embed],
      ephemeral: true
    })

  } else {

    const submitterId = doc.submittedBy
    const messageID = doc.messageId
    const idea = doc.idea
    const botideaChannelId = doc.botideaChannelId
    const status = doc.status

    if (status == 'approved') {
      const errorEmbed1 = new MessageEmbed()
      .setTitle('ERROR: Idea already approved.')
      .setColor('RED')

      interaction.reply({
        embeds: [errorEmbed1],
        ephemeral: true
      })
    }

    const botIdeaChannel = client.channels.cache.find(channel => channel.id === botideaChannelId)

    botIdeaChannel.messages.fetch(messageID).then(message => {
      
      const embed = new MessageEmbed()
      .setTitle('Aprroved Idea #' + id)
      .setDescription(`**Idea:** ${idea}\n\n**Submitted by:** <@${submitterId}>\n\n**Approved by:** <@${user.id}>`)
      .setColor('GREEN')

      message.delete()

      botIdeaChannel.send({
        embeds: [embed]
      })

      const embed2 = new MessageEmbed()
      .setTitle('Your Idea has been approved!')
      .setDescription('Thank you for your contribution!\n\nPlease keep up in the support server for updates!')
      .setColor('GREEN')

      coll.updateOne({ ideaId: id }, { $set: { status: 'approved' } }).then(() => {
        const successEmbed = new MessageEmbed()
        .setTitle('Success!')
        .setDescription('The idea has been approved!')
        .setColor('GREEN')

        try {
          client.users.cache.get(submitterId).send({
            embeds: [embed2]
          })
        } catch (error) {
          successEmbed.addFields({ name: 'Error', value: 'Could not send message to user.' })
        }

        interaction.reply({
          embeds: [successEmbed]
        })

      })

    })

  }

  cmdRun(user, cmdName)

}

// deny
async function botIdeaDenyCmd(user, guild, interaction, id) {
  const cmdName = 'botidea-deny' 

  const coll = db.collection('botIdeas')
  const doc = await coll.findOne({ ideaId: id })

  if (doc === null) {

    const embed = new MessageEmbed()
    .setTitle('ERROR: No such idea ID exists.')
    .setDescription('Please check the ID and try again')
    .setColor('RED')

    interaction.reply({
      embeds: [embed],
      ephemeral: true
    })

  } else {

    const submitterId = doc.submittedBy
    const messageID = doc.messageId
    const idea = doc.idea
    const botideaChannelId = doc.botideaChannelId
    const status = doc.status

    if (status == 'denied') {
      const errorEmbed1 = new MessageEmbed()
      .setTitle('ERROR: Idea already denied.')
      .setColor('RED')

      interaction.reply({
        embeds: [errorEmbed1],
        ephemeral: true
      })
    }

    const botIdeaChannel = client.channels.cache.find(channel => channel.id === botideaChannelId)

    botIdeaChannel.messages.fetch(messageID).then(message => {
      
      const embed = new MessageEmbed()
      .setTitle('Denied Idea #' + id)
      .setDescription(`**Idea:** ${idea}\n\n**Submitted by:** <@${submitterId}>\n\n**Denied by:** <@${user.id}>`)
      .setColor('RED')

      message.delete()

      botIdeaChannel.send({
        embeds: [embed]
      })

      const embed2 = new MessageEmbed()
      .setTitle('Your Idea has been denied.')
      .setDescription('If you think of a new idea suggest it!\n\nPlease keep up in the support server for updates!')
      .setColor('RED')

      coll.updateOne({ ideaId: id }, { $set: { status: 'denied' } }).then(() => {
        const successEmbed = new MessageEmbed()
        .setTitle('Success!')
        .setDescription('The idea has been denied.')
        .setColor('GREEN')

        try {
          client.users.cache.get(submitterId).send({
            embeds: [embed2]
          })
        } catch (error) {
          successEmbed.addFields({ name: 'Error', value: 'Could not send message to user.' })
        }

        interaction.reply({
          embeds: [successEmbed]
        })

      })

    })

  }

  cmdRun(user, cmdName)

}

// logs command
function logsCmd(user, guild, interaction, dateArg) {
  const cmdName = 'logs'

  const fs = require('fs')
  
  if (!isBotOwner(user.id)) {
    interaction.reply({
      embeds: [notOwnerEmbed],
      ephemeral: true
    })

    return
  }

  if (dateArg === null) {

    var today = new Date(); 
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();

    fs.readFile('../Discord-Bot/logs/' + date + '.txt', 'utf8', function (err, data) {
      if (err) throw err;
      
      const embed = new MessageEmbed() 
      .setTitle('Logs for ' + date)
  
      const file = new MessageAttachment('../Discord-Bot/logs/' + date + '.txt')
  
      // interaction.reply("Logs For " + date + "`\`\`" + data + "`\`\`")
      interaction.reply({
        content: 'Logs For ' + date,
        files: [file],
      })
  
    })

  } else {

    var date = dateArg

    fs.readFile('../Discord-Bot/logs/' + date + '.txt', 'utf8', function (err, data) {
      if (err) throw err;
      
      const embed = new MessageEmbed() 
      .setTitle('Logs for ' + date)
  
      const file = new MessageAttachment('../Discord-Bot/logs/' + date + '.txt')
  
      // interaction.reply("Logs For " + date + "`\`\`" + data + "`\`\`")
      interaction.reply({
        content: 'Logs For ' + date,
        files: [file],
      })
  
    })

  }

  cmdRun(user, cmdName)
}

// Run Bot
client.login(process.env.TOKEN)