const { cmdRun } = require('../../functions/cmdRun.js')
const { EmbedBuilder } = require('discord.js');
const { client, db } = require('../../index.js')

const mainHex = '#d79a61'

exports.botideaCmd = async function botideaCmd(user, guild, interaction, idea) {
    const cmdName = 'botidea'

    const ideaId = Math.floor(Math.random() * 10000)

    const embed = new EmbedBuilder()
        .setTitle('Your idea has been submitted! | ID: ' + ideaId)
        .setDescription(`Thank you for your idea! View it in #bot-ideas in the [Support Server](https://seedsbot.xyz/support) \n\n**Idea:** ${idea}`)
        .setColor(mainHex)

    const botIdeaChannel = client.channels.cache.find(channel => channel.id === '1006830410812096532')

    const embed2 = new EmbedBuilder()
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

    cmdRun(user, cmdName,guild,interaction)
}