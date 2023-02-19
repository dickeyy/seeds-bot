const { cmdRun } = require('../../functions/cmdRun.js')
const { EmbedBuilder } = require('discord.js');
const { connectDb } = require('../../utils/db.js');
const { log } = require('../../functions/log.js');
const client = require('../../index.js').client

const db = connectDb()

const mainHex = '#d79a61'


exports.setreportchannelCmd = async function setreportchannelCmd(user, guild, interaction, channel) {
    const cmdName = 'setreportchannel'

    // Verify that the channel is a text channel
    if (channel.type !== 0) {
        const embed = new EmbedBuilder()
        .setTitle('Invalid channel Type')
        .setDescription('Please provide a text channel.')
        .setColor('Red')

        interaction.reply({
            embeds: [embed],
            ephemeral: true
        })
        return
    }

    // // Verify that the bot has permission to send messages in the channel
    // if (!channel.permissionsFor(guild.me).has('SEND_MESSAGES')) {
    //     const embed = new EmbedBuilder()
    //     .setTitle('Missing Permissions')
    //     .setDescription('I do not have permission to send messages in that channel.')
    //     .setColor('Red')

    //     interaction.reply({
    //         embeds: [embed],
    //         ephemeral: true
    //     })
    //     return
    // }

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

    // Set the report channel in db
    const coll = db.collection('reportChannels')

    // Check if the report channel is already set
    const reportChannel = await coll.findOne({
        guildId: guild.id
    })

    if (reportChannel) {

        // Update the report channel
        await coll.updateOne({
            guildId: guild.id
        }, {
            $set: {
                channelId: channel.id
            }
        })
    } else {

        // Insert the report channel
        await coll.insertOne({
            guildId: guild.id,
            channelId: channel.id
        })
    }

    const embed = new EmbedBuilder()
    .setTitle('Report Channel Set')
    .setDescription(`The report channel has been set to <#${channel.id}>`)
    .setColor('Green')

    interaction.reply({
        embeds: [embed]
    })

    const embed2 = new EmbedBuilder()
    .setTitle('Report Channel Set')
    .setDescription(`This channel has been set as the report channel.`)
    .setColor('Green')

    channel.send({ embeds: [embed2] })

    cmdRun(user, cmdName,guild,interaction)
}