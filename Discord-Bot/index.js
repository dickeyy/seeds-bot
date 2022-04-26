const { Client, Intents, MessageEmbed, Constants, MessageActionRow, MessageButton, Interaction, Permissions, Message } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_BANS, Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS] });
const { REST } = require('@discordjs/rest');
const { Routes, InteractionResponseType } = require('discord-api-types/v9');
const dotenv = require('dotenv');
const { MongoClient, ServerApiVersion } = require('mongodb');

// Process errors
process.on('uncaughtException', function (error) {
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
    { name: 'help', description: 'Get a list of all Seeds commands' },
    { name: 'ban', description: 'Ban a member from the server', options: [{ name: 'user', description: 'The person you want to ban', required: true, type: Constants.ApplicationCommandOptionTypes.USER }, { name: 'reason', description: 'The reason the person is being banned', required: false, type: Constants.ApplicationCommandOptionTypes.STRING }] },
    { name: 'unban', description: 'Unban a previously banned member', options: [{ name: 'user', description: 'The person you want to unban', required: true, type: Constants.ApplicationCommandOptionTypes.USER }] },
    { name: 'kick', description: 'Kick a member from the server', options: [{ name: 'user', description: 'The person you want to kick', required: true, type: Constants.ApplicationCommandOptionTypes.USER }, { name: 'reason', description: 'The reason the person is being kicked', required: false, type: Constants.ApplicationCommandOptionTypes.STRING }] },
    { name: 'warn', description: 'Warn a member in the server', options: [{ name: 'user', description: 'The person you want to warn', required: true, type: Constants.ApplicationCommandOptionTypes.USER }, { name: 'reason', description: 'The reason for the warn', required: true, type: Constants.ApplicationCommandOptionTypes.STRING }] },
    { name: 'cases', description: 'Check a members cases', options: [{ name: 'user', description: 'The person whos cases you want', required: true, type: Constants.ApplicationCommandOptionTypes.USER }] },
    { name: 'deletecase', description: 'Delete a specific case', options: [{ name: 'case', description: 'The case ID that you want to delete', required: true, type: Constants.ApplicationCommandOptionTypes.INTEGER }] }
]

// Register slash commands
const rest = new REST({ version: '9' }).setToken(process.env.TOKEN);

(async () => {
    try {
      console.log('Started refreshing application (/) commands.');
  
      await rest.put(
          Routes.applicationGuildCommands(process.env.APP_ID, '731445738290020442', '801360477984522260'),
        //   Routes.applicationCommands(process.env.APP_ID),
          {body: commands},
      );
  
      console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
      console.error(error);
    }
})();

// When the bot is ready
client.on('ready', () => {
    client.user.setActivity('/help', { type: 'LISTENING' });
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

    console.log(`New Guild -- ${guild.name}`)
})

// When the bot leaves a server
client.on('guildDelete', async guild => {
    const collection = db.collection('guilds');
    await collection.deleteOne({ _id: guild.id })
    console.log(`Left Guild -- ${guild.name}`)
})

// bot functions
// Command run
async function cmdRun(user,cmdName) {
    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

    var collection = db.collection('commands')
    const doc = await collection.find({ name: cmdName }).toArray();

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

// Help command
function helpCmd(user,guild,interaction) {
    const cmdName = 'help'

    const embed = new MessageEmbed()
    .setTitle('Seeds Help')
    .setColor(mainHex)
    .setDescription('All Seeds commands use the prefix `\`/`\`\n\n[parameter] = Required\n{parameter} = Optional\n')
    .setFields([
        { name: 'Moderation:', value: '`\`/ban [user] {reason}`\`, `\`/unban [user]`\`, `\`/kick [user] {reason}`\`, `\`/warn [user] [reason]`\`, `\`/cases [user]`\`, `\`/deletecase [case]`\`', inline: false }
    ])

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
            .setTitle(`${caseUser.tag}'s Cases`)
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

// Run Bot
client.login(process.env.TOKEN);
