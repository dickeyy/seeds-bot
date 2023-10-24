const { cmdRun } = require('../../functions/cmdRun.js')
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, time } = require('discord.js');
const axios = require('axios').default
const { client, db } = require('../../index.js')
const { cooldownAdd, cooldownCheck, cdList, cooldownCheckTime } = require('../../functions/cooldown.js')

const mainHex = '#d79a61'

exports.voteCmd = async function voteCmd(user,guild,interaction) {
    const cmdName = 'vote'

    if (await cooldownCheck(user, cmdName, guild)) {
        await cooldownCheckTime(user, cmdName, guild).then((res) => {
            let dt = new Date();
            dt.setSeconds(dt.getSeconds() + res);

            const embed = new EmbedBuilder()
            .setTitle(cdList[Math.floor(Math.random() * cdList.length)])
            .setDescription('You can use this command again ' + time(dt, 'R'))
            .setColor('Red')
            interaction.reply({
                embeds: [embed],
                ephemeral: true
            })
        })
        return
    }

    const embed = new EmbedBuilder()
    .setTitle('Vote for Seeds on Top.gg')
    .setDescription('Click the "Vote Here" button to vote then click the "I Voted" button to get your coins!')
    .setColor(mainHex)

    const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setURL('https://top.gg/bot/968198214450831370/vote')
                .setLabel('Vote Here')
                .setStyle(ButtonStyle.Link),

            new ButtonBuilder()
                .setCustomId('voted')
                .setLabel('I Voted')
                .setStyle(ButtonStyle.Success),

        )
    interaction.reply({
        embeds: [embed],
        ephemeral: true,
        components: [row]
    })

        client.on('interactionCreate', interaction2 => {
            if (!interaction2.isButton()) return;

            if (interaction2['customId'] == 'voted') {
                
                const url = `https://top.gg/api/bots/${process.env.APP_ID}/check?userId=${user.id}`;

                const req = axios.get(url, {
                    headers: {
                        'Authorization': `${process.env.TOPGG_TOKEN}`
                    }
                }).then((res) => {
                    if (res.status != 200) {
                        const embed2 = new EmbedBuilder()
                        .setTitle('ERROR')
                        .setDescription('An error occured while trying to get your vote status. Please try again later. If this error persists, please join the [Support Server](https://seedsbot.xyz/support).')
                        .setColor('RED')

                        interaction.editReply({
                            embeds: [embed2],
                            ephemeral: true,
                            components: []
                        })
                    }

                    else {

                        if (res['data'] === 0) {
                            const embed2 = new EmbedBuilder()
                            .setTitle('You have not voted yet!')
                            .setDescription('Please vote using the "Vote Here" button.')
                            .setColor('Red')

                            interaction.editReply({
                                embeds: [embed2],
                                ephemeral: true,
                                components: [row]
                            })
                        } else {

                            const coll = db.collection('economy')
                            const doc = coll.findOne({ userId: user.id, guildId: guild.id }).then((data) => {

                                if (data == null) {
                                    const embed2 = new EmbedBuilder()
                                    .setTitle('You dont have any coins!')
                                    .setDescription('Please use the `\`/daily`\` command to get some then try again.')
                                    .setColor('Red')
    
                                    interaction.editReply({
                                        embeds: [embed2],
                                        ephemeral: true,
                                        components: []
                                    })
                                } else {
    
                                    const newBalance = data.coins + 1000
    
                                    coll.updateOne({ userId: user.id, guildId: guild.id }, { $set: { coins: newBalance } }).then(() => {
    
                                        const embed2 = new EmbedBuilder()
                                        .setTitle('Thank you for voting!')
                                        .setDescription('We have recieved your vote and 1000 coins have been added to your balance. \n\nPlease vote again in 12 hours to recieve more coins!')
                                        .setColor('Green')
            
                                        interaction.editReply({
                                            embeds: [embed2],
                                            ephemeral: false,
                                            components: []
                                        })
                                    })
    
                                }

                            })
                            
                        }

                    }
                });

            } 
        })

    cooldownAdd(user,cmdName,guild,'twelveHour')

    cmdRun(user,cmdName,guild,interaction)
}