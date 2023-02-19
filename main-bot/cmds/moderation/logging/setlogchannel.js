const { cmdRun } = require('../../../functions/cmdRun.js')
const { EmbedBuilder } = require('discord.js');
const { connectDb } = require('../../../utils/db.js');
const { log } = require('../../../functions/log.js');
const client = require('../../../index.js').client

const db = connectDb()

const mainHex = '#d79a61'


exports.setlogchannelCmd = async function setlogchannelCmd(user,guild,interaction,logType,channel) {
    const cmdName = 'setlogchannel'

    // // Verify that the bot has permission to embed links in the channel
    // if (!channel.permissionsFor(guild.me).has('EMBED_LINKS')) {
    //     const embed = new EmbedBuilder()
    //     .setTitle('Missing Permissions')
    //     .setDescription('I do not have permission to embed links in that channel.')
    //     .setColor('Red')

    //     interaction.reply({
    //         embeds: [embed],
    //         ephemeral: true
    //     })
    //     return
    // }

    // // Verify that the bot has permission to add reactions in the channel
    // if (!channel.permissionsFor(guild.me).has('ADD_REACTIONS')) {
    //     const embed = new EmbedBuilder()
    //     .setTitle('Missing Permissions')
    //     .setDescription('I do not have permission to add reactions in that channel.')
    //     .setColor('Red')

    //     interaction.reply({
    //         embeds: [embed],
    //         ephemeral: true
    //     })
    //     return
    // }

    const coll = db.collection('logSettings')

    const logSettings = await coll.findOne({ guildId: guild.id })

    channel.createWebhook({
        name: 'Seeds Logging',
        avatar: client.user.avatarURL()
    })
    .then(webhook => {
        if (logSettings) {
            coll.updateOne({
                guildId: guild.id
            }, {
                $set: {
                    channels: {
                        ...logSettings.channels,
                        [logType]: channel.id
                    },
                    webhookUrls: {
                        ...logSettings.webhookUrls,
                        [logType]: webhook.url
                    }
                }
            })
        } else {
            coll.insertOne({
                guildId: guild.id,
                channels: {
                    [logType]: channel.id
                },
                webhookUrls: {
                    [logType]: webhook.url
                },
                toggles: {
                    serverEvents: {
                        channelCreate: true,
                        channelDelete: true,
                        channelUpdate: true,
                        channelPinsUpdate: true,
                        emojiCreate: true,
                        emojiDelete: true,
                        emojiUpdate: true,
                        guildBanAdd: true,
                        guildBanRemove: true,
                        guildScheduledEventCreate: true,
                        guildScheduledEventDelete: true,
                        guildScheduledEventUpdate: true,
                        guildUpdate: true,
                        inviteCreate: true,
                        inviteDelete: true,
                        roleCreate: true,
                        roleDelete: true,
                        roleUpdate: true,
                        stickerCreate: true,
                        stickerDelete: true,
                        stickerUpdate: true,
                        threadCreate: true,
                        threadDelete: true,
                        threadUpdate: true,
                    },
                    memberEvents: {
                        guildMemberAdd: true,
                        guildMemberRemove: true,
                        guildMemberUpdate: true,
                        userUpdate: true,
                    },
                    messageEvents: {
                        messageDelete: true,
                        messageDeleteBulk: true,
                        messageUpdate: true,
                    }
                }
            })
        }
    
        const embed = new EmbedBuilder()
        .setTitle('Log Channel Set')
        .setDescription(`The ${logType} log channel has been set to <#${channel.id}>.\n\nAll events are enabled by default. To toggle any event, use \`/log toggle\`.`)
        .setColor('Green')
    
        const embed2 = new EmbedBuilder()
        .setTitle('Log Channel Set')
        .setDescription(`The ${logType} log channel has been set to this channel.`)
        .setColor(mainHex)
    
        if (channel.id === interaction.channelId) {
            interaction.reply({
                embeds: [embed2]
            })
        }
        else {
            interaction.reply({
                embeds: [embed]
            })
    
            channel.send({
                embeds: [embed2]
            })
        }
    })
    .catch(console.error);

    

    cmdRun(user, cmdName,guild,interaction)
    
}