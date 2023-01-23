const { cmdRun } = require('../functions/cmdRun.js')
const { MessageEmbed } = require('discord.js');
const { log } = require('../functions/log.js');

const mainHex = '#d79a61'


exports.helpCmd = function helpCmd(user,guild,interaction) {
    const cmdName = 'help'

    const embed = new MessageEmbed()
    .setTitle('Seeds Help')
    .setColor(mainHex)
    .setThumbnail('https://seedsbot.xyz/images/logo.png')
    .setDescription('All Seeds commands use the prefix `\`/`\`\n\n[parameter] = Required\n{parameter} = Optional\n')
    .setFields([
        { name: 'Moderation:', value: '`\`/ban [user] {reason}`\`, `\`/unban [user]`\`, `\`/kick [user] {reason}`\`, `\`/warn [user] [reason]`\`, `\`/cases [user]`\`, `\`/deletecase [case]`\`, `\`/setreportchannel [channel]`\`, `\`/report [reason] {user}`\`, `\`/log set_channel [log type] [channel]`\`, `\`/log toggle [log type] [event]`\`, `\`/purge [amount]`\`', inline: false },
        { name: 'Economy:', value: '`\`/balance`\`, `\`/daily`\`, `\`/beg`\`, `\`/highlow`\`, `\`/slots [bet > 10]`\`, `\`/rps [bet > 10] [move]`\`, `\`/fish`\`, `\`/mine`\`, `\`/shop`\`, `\`/buy [shop id]`\`, `\`/vote`\`', inline: false },
        { name: 'Fun:', value: '`\`/friend [message]`\`, `\`/tsh [topic]`\`, `\`/coinflip`\`, `\`/lovetest [user]`\`, `\`/todayinhistory`\`, `\`/weather [location]`\`', inline: false },
        { name: 'Utility: ', value: '`\`/stats`\`, `\`/rcolor`\`, `\`/poll [option 1] [option 2]`\`, `\`/botidea [idea]`\`, `\`/qr [url]`\`, `\`/alert`\`', inline: false }
    ])
    .addField('Links', '[🌐 Website](https://seedsbot.xyz) | [<:invite:823987169978613851> Invite](https://seedsbot.xyz/invite) | [<:discord:823989269626355793> Support](https://seedsbot.xyz/support)')

    interaction.reply({
        embeds: [embed]
    })

    cmdRun(user,cmdName,guild,interaction)
}