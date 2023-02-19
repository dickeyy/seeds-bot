const { cmdRun } = require('../../functions/cmdRun.js')
const { EmbedBuilder } = require('discord.js');
const { connectDb } = require('../../utils/db.js');
const { log } = require('../../functions/log.js');
const client = require('../../index.js').client

const db = connectDb()

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


exports.botideaCmd = async function botideaCmd(user, guild, interaction, idea) {
    const cmdName = 'botidea'

    if (cooldown.has(user.id + '--' + cmdName)) {
        const embed = new EmbedBuilder()

        .setTitle(cdList[Math.floor(Math.random() * cdList.length)])
        .setDescription('That command can only be run once every week.')
        .setColor('Red')
        interaction.reply({
            embeds: [embed],
            ephemeral: true
        })
        return
    }

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

    cooldown.add(user.id + '--' + cmdName);
    setTimeout(() => {
        cooldown.delete(user.id + '--' + cmdName);
    }, OneWeekCooldown);

    cmdRun(user, cmdName,guild,interaction)
}