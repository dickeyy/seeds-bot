const { log } = require('./functions/log.js');

// Process errors
process.on('uncaughtException', async function (error) {
    console.log('error', error.stack)

    log('error', error.stack)
});

// Import Commands
const helpCmd = require('./cmds/help.js').helpCmd

// Moderation Commands
const banCmd = require('./cmds/moderation/ban.js').banCmd
const kickCmd = require('./cmds/moderation/kick.js').kickCmd
const unbanCmd = require('./cmds/moderation/unban.js').unbanCmd
const warnCmd = require('./cmds/moderation/warn.js').warnCmd
const deletecaseCmd = require('./cmds/moderation/deletecase.js').deletecaseCmd
const casesCmd = require('./cmds/moderation/cases.js').casesCmd
const setreportchannelCmd = require('./cmds/moderation/setreportchannel.js').setreportchannelCmd
const reportCmd = require('./cmds/moderation/report.js').reportCmd
const setlogchannelCmd = require('./cmds/moderation/logging/setlogchannel.js').setlogchannelCmd
const toggleLogsCmd = require('./cmds/moderation/logging/togglelogs.js').toggleLogsCmd
const lockdownCmd = require('./cmds/moderation/lockdown.js').lockdownCmd
const unlockCmd = require('./cmds/moderation/unlock.js').unlockCmd
const purgeAllCmd = require('./cmds/moderation/purge/purgeAll.js').purgeAllCmd
const purgeUserCmd = require('./cmds/moderation/purge/purgeUser.js').purgeUserCmd
const purgeBotCmd = require('./cmds/moderation/purge/purgeBot.js').purgeBotCmd
const purgeSeedsCmd = require('./cmds/moderation/purge/purgeSeeds.js').purgeSeedsCmd
const purgeContainsCmd = require('./cmds/moderation/purge/purgeContains.js').purgeContainsCmd
const purgeEmbedsCmd = require('./cmds/moderation/purge/purgeEmbeds.js').purgeEmbedsCmd
const purgeEmojiCmd = require('./cmds/moderation/purge/purgeEmoji.js').purgeEmojiCmd
const purgeAttachmentsCmd = require('./cmds/moderation/purge/purgeAttachments.js').purgeAttachmentsCmd

// Fun Commands
const aiCmd = require('./cmds/fun/ai.js').aiCmd
const tshCmd = require('./cmds/fun/tsh.js').tshCmd
const coinflipCmd = require('./cmds/fun/coinflip.js').coinflipCmd
const lovetestCmd = require('./cmds/fun/lovetest.js').lovetestCmd
const todayinhistoryCmd = require('./cmds/fun/todayinhistory.js').todayinhistoryCmd
const weatherCmd = require('./cmds/fun/weather.js').weatherCmd
const tictactoeCmd = require('./cmds/fun/games/tictactoe.js').tictactoeCmd

// Economy Commands
const balanceCmd = require('./cmds/economy/balance.js').balanceCmd
const begCmd = require('./cmds/economy/beg.js').begCmd
const dailyCmd = require('./cmds/economy/daily.js').dailyCmd
const slotsCmd = require('./cmds/economy/slots.js').slotsCmd
const mineCmd = require('./cmds/economy/mine.js').mineCmd
const fishCmd = require('./cmds/economy/fish.js').fishCmd
const rpsCmd = require('./cmds/economy/rps.js').rpsCmd
const shopCmd = require('./cmds/economy/shop.js').shopCmd
const buyCmd = require('./cmds/economy/buy.js').buyCmd
const highlowCmd = require('./cmds/economy/highlow.js').highlowCmd
const voteCmd = require('./cmds/economy/vote.js').voteCmd

// Utility Commands
const botideaCmd = require('./cmds/utility/botidea.js').botideaCmd
const pollCmd = require('./cmds/utility/poll.js').pollCmd
const rcolorCmd = require('./cmds/utility/rcolor.js').rcolorCmd
const statsCmd = require('./cmds/utility/stats.js').statsCmd
const starboardSetCmd = require('./cmds/utility/starboardSet.js').starboardSetCmd
const qrCmd = require('./cmds/utility/qr.js').qrCmd
const alertCmd = require('./cmds/utility/alert.js').alertCmd

// Recive slash cmds
exports.commandHandler = async (interaction) => {
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
        const unbanUser = options.getString('user')
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

    if (commandName == 'friend') {
        const prompt = options.getString('message')
        await aiCmd(user,guild,interaction,prompt)
    }

    if (commandName == 'tsh') {
        const topic = options.getString('topic')
        await tshCmd(user,guild,interaction,topic)
    }

    if (commandName == 'balance') {
        await balanceCmd(user,guild,interaction)
    }

    if (commandName == 'beg') {
        await begCmd(user,guild,interaction)
    }

    if (commandName == 'daily') {
        await dailyCmd(user,guild,interaction)
    }

    if (commandName == 'highlow') {
        await highlowCmd(user,guild,interaction)
    }

    if (commandName == 'slots') {
        const bet = options.getInteger('bet')
        await slotsCmd(user,guild,interaction,bet)
    }

    if (commandName == 'rps') {
        const bet = options.getInteger('bet')
        const move = options.getString('move')
        await rpsCmd(user,guild,interaction,bet,move)
    }

    if (commandName == 'shop') {
        await shopCmd(user,guild,interaction)
    }

    if (commandName == 'buy') {
        const shopId = options.getInteger('id')
        await buyCmd(user,guild,interaction,shopId)
    }

    if (commandName == 'fish') {
        await fishCmd(user,guild,interaction)
    }

    if (commandName == 'stats') {
        statsCmd(user,guild,interaction)
    }

    if (commandName == 'rcolor') {
        rcolorCmd(user,guild,interaction)
    }

    if (commandName == 'poll') {
        const option1 = options.getString('option1')
        const option2 = options.getString('option2')

        await pollCmd(user,guild,interaction,option1,option2)
    }

    if (commandName == 'coinflip') {
        coinflipCmd(user,guild,interaction)
    }

    if (commandName == 'botidea') {
        const idea = options.getString('idea')
        await botideaCmd(user,guild,interaction,idea)
    }

    if (commandName == 'vote') {
        voteCmd(user,guild,interaction)
    }

    if (commandName == 'mine') {
        await mineCmd(user,guild,interaction)
    }

    if (commandName == 'setreportchannel') {
        const reportChannel = options.getChannel('channel')
        await setreportchannelCmd(user,guild,interaction,reportChannel)
    }

    if (commandName == 'report') {
        const reportUser = options.getUser('user')
        const reason = options.getString('reason')
        await reportCmd(user,guild,interaction,reportUser,reason)
    }

    if (commandName == 'log') {
        const subCmd = options.getSubcommand()
        if (subCmd == 'set_channel') {
            
            const logType = options.getString('type')
            const logChannel = options.getChannel('channel')

            await setlogchannelCmd(user,guild,interaction,logType,logChannel)

        } else if (subCmd == 'toggle') {

            const serverEvents = options.getString('server_events')
            const memberEvents = options.getString('member_events')
            const messageEvents = options.getString('message_events')

            await toggleLogsCmd(user,guild,interaction,serverEvents,memberEvents,messageEvents)
        }
    }

    if (commandName == 'purge') {
        const subCmd = options.getSubcommand()
        if (subCmd == 'all') {
            let amount = options.getInteger('amount')
            await purgeAllCmd(user,guild,interaction,amount)
        } else if (subCmd == 'user') {
            let amount = options.getInteger('amount')
            let purgeUser = options.getUser('user')
            await purgeUserCmd(user,guild,interaction,purgeUser,amount)
        } else if (subCmd == 'bot') {
            let amount = options.getInteger('amount')
            await purgeBotCmd(user,guild,interaction,amount)
        } else if (subCmd == 'seeds') {
            let amount = options.getInteger('amount')
            await purgeSeedsCmd(user,guild,interaction,amount)
        } else if (subCmd == 'contains') {
            let amount = options.getInteger('amount')
            let contains = options.getString('string')
            await purgeContainsCmd(user,guild,interaction,contains,amount)
        } else if (subCmd == 'embeds') {
            let amount = options.getInteger('amount')
            await purgeEmbedsCmd(user,guild,interaction,amount)
        } else if (subCmd == 'emoji') {
            let amount = options.getInteger('amount')
            let emoji = options.getString('emoji')
            await purgeEmojiCmd(user,guild,interaction,emoji,amount)
        } else if (subCmd == 'attachments') {
            let amount = options.getInteger('amount')
            await purgeAttachmentsCmd(user,guild,interaction,amount)
        }
    } 

    if (commandName == 'starboard') {
        const subCmd = options.getSubcommand()
        if (subCmd == 'set') {
            const starChannel = options.getChannel('channel')
            const starAmount = options.getInteger('amount')
            const starEmoji = options.getString('emoji')

            await starboardSetCmd(user,guild,interaction,starChannel,starEmoji,starAmount)
        }
    }

    if (commandName == 'qr') {
        const qrUrl = options.getString('url')
        await qrCmd(user,guild,interaction,qrUrl)
    }

    if (commandName == 'lovetest') {
        const loveUser = options.getUser('user')
        await lovetestCmd(user,guild,interaction,loveUser)
    }

    if (commandName == 'todayinhistory') {
        await todayinhistoryCmd(user,guild,interaction)
    }

    if (commandName == 'weather') {
        const location = options.getString('location')
        await weatherCmd(user,guild,interaction,location)
    }

    if (commandName == 'lockdown') {
        const lockChannel = options.getChannel('channel')
        await lockdownCmd(user,guild,interaction,lockChannel)
    }

    if (commandName == 'unlock') {
        const unlockChannel = options.getChannel('channel')
        await unlockCmd(user,guild,interaction,unlockChannel)
    }

    if (commandName == 'alert') {
        await alertCmd(user,guild,interaction)
    }

    if (commandName == 'game') {
        const game = options.getSubcommand()
        if (game == 'tictactoe') {
            const tttUser = options.getUser('user')
            await tictactoeCmd(user,guild,interaction,tttUser)
        }
    }
    
}