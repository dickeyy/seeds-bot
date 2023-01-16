// Import Commands
const helpCmd = require('./commands/help.js').helpCmd

// Moderation Commands
const banCmd = require('./commands/moderation/ban.js').banCmd
const kickCmd = require('./commands/moderation/kick.js').kickCmd
const unbanCmd = require('./commands/moderation/unban.js').unbanCmd
const warnCmd = require('./commands/moderation/warn.js').warnCmd
const deletecaseCmd = require('./commands/moderation/deletecase.js').deletecaseCmd
const casesCmd = require('./commands/moderation/cases.js').casesCmd
const setreportchannelCmd = require('./commands/moderation/setreportchannel.js').setreportchannelCmd
const reportCmd = require('./commands/moderation/report.js').reportCmd
const setlogchannelCmd = require('./commands/moderation/logging/setlogchannel.js').setlogchannelCmd
const toggleLogsCmd = require('./commands/moderation/logging/togglelogs.js').toggleLogsCmd
const purgeCmd = require('./commands/moderation/purge.js').purgeCmd
const lockdownCmd = require('./commands/moderation/lockdown.js').lockdownCmd
const unlockCmd = require('./commands/moderation/unlock.js').unlockCmd

// Fun Commands
const aiCmd = require('./commands/fun/ai.js').aiCmd
const tshCmd = require('./commands/fun/tsh.js').tshCmd
const coinflipCmd = require('./commands/fun/coinflip.js').coinflipCmd
const lovetestCmd = require('./commands/fun/lovetest.js').lovetestCmd
const todayinhistoryCmd = require('./commands/fun/todayinhistory.js').todayinhistoryCmd
const weatherCmd = require('./commands/fun/weather.js').weatherCmd

// Economy Commands
const balanceCmd = require('./commands/economy/balance.js').balanceCmd
const begCmd = require('./commands/economy/beg.js').begCmd
const dailyCmd = require('./commands/economy/daily.js').dailyCmd
const slotsCmd = require('./commands/economy/slots.js').slotsCmd
const mineCmd = require('./commands/economy/mine.js').mineCmd
const fishCmd = require('./commands/economy/fish.js').fishCmd
const rpsCmd = require('./commands/economy/rps.js').rpsCmd
const shopCmd = require('./commands/economy/shop.js').shopCmd
const buyCmd = require('./commands/economy/buy.js').buyCmd
const highlowCmd = require('./commands/economy/highlow.js').highlowCmd
const voteCmd = require('./commands/economy/vote.js').voteCmd

// Utility Commands
const botideaCmd = require('./commands/utility/botidea.js').botideaCmd
const pollCmd = require('./commands/utility/poll.js').pollCmd
const rcolorCmd = require('./commands/utility/rcolor.js').rcolorCmd
const statsCmd = require('./commands/utility/stats.js').statsCmd
const starboardSetCmd = require('./commands/utility/starboardSet.js').starboardSetCmd
const qrCmd = require('./commands/utility/qr.js').qrCmd
const alertCmd = require('./commands/utility/alert.js').alertCmd

// Recive slash commands
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
        const amount = options.getInteger('amount')
        await purgeCmd(user,guild,interaction,amount)
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
    
}