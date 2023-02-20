const { cmdRun } = require('../functions/cmdRun.js')
const { EmbedBuilder } = require('discord.js');
const { log } = require('../functions/log.js');

const mainHex = '#d79a61'


exports.helpCmd = function helpCmd(user,guild,interaction) {
    const cmdName = 'help'

    const embed = new EmbedBuilder()
    .setTitle('Seeds Help')
    .setColor(mainHex)
    .setThumbnail('https://seedsbot.xyz/images/logo.png')
    .setDescription('All Seeds commands use the prefix `\`/`\`\n')
    .setFields([
        { name: 'Moderation:', value: '</ban:1056459905218916434>, </unban:1056459905218916435>, </kick:1056459905218916436>, </warn:1056459905218916437>, </cases:1056459905218916438>, </deletecase:1056459905218916439>, </setreportchannel:1056459905218916440>, </report:1056466283530567690>, </log set_channel:1058323936854687764>, </log toggle:1058323936854687764>, </purge all:1058333987065569330>, </purge user:1058333987065569330>, </purge contains:1058333987065569330>, </purge attachments:1058333987065569330>, </purge bot:1058333987065569330>, </purge embeds:1058333987065569330>, </purge emoji:1058333987065569330>, </purge seeds:1058333987065569330>', inline: false },
        { name: 'Economy', value: '</balance:1056459905680285699>, </daily:1056459905680285701>, </beg:1056459905680285700>, </highlow:1056459905680285702>, </slots:1056459905680285703>, </rps:1056459905680285704>, </fish:1056459905856442419>, </mine:1056459905856442421>, </shop:1056459905680285705>, </buy:1056459905856442418>, </vote:1056459905856442420>', inline: false },
        { name: 'Fun', value:'</friend:1056459905218916441>, </tsh:1056459905680285696>, </coinflip:1056459905680285698>, </lovetest:1063644949536583751>, </todayinhistory:1063644949536583752>, </weather:1063644949536583753>', inline: false },
        { name: 'Games', value:'</game tictactoe:1065152190852894801>', inline: false },
        { name: 'Utility', value: '</stats:1056459905856442422>, </rcolor:1056459905856442423>, </poll:1056459905680285697>, </botidea:1006832507553054741> </qr:1063644949536583754>, </alert:1064421035744690279>', inline: false }
    ])
    .addFields({name: 'Links', value:'[🌐 Website](https://seedsbot.xyz) | [<:invite:823987169978613851> Invite](https://seedsbot.xyz/invite) | [<:discord:823989269626355793> Support](https://seedsbot.xyz/support)'})

    interaction.reply({
        embeds: [embed]
    })

    cmdRun(user,cmdName,guild,interaction)
}