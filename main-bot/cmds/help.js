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
    .setDescription('All Seeds commands use the prefix `\`/`\`\n\n**Commands: **[All of Seeds commands can be found here](https://seedsbot.xyz/commands)\n**Need Help?** [Join our support server](https://seedsbot.xyz/support)')
    .addFields({name: 'Links', value:'[🌐 Website](https://seedsbot.xyz) | [<:invite:823987169978613851> Invite](https://seedsbot.xyz/invite) | [<:discord:823989269626355793> Support](https://seedsbot.xyz/support) | [<:vote:1077397143242952786> Vote](https://top.gg/bot/968198214450831370/vote)'})

    interaction.reply({
        embeds: [embed]
    })

    cmdRun(user,cmdName,guild,interaction)
}