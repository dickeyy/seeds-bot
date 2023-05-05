const { cmdRun } = require('../../../functions/cmdRun.js')
const { EmbedBuilder, codeBlock  } = require('discord.js');
const { redis } = require('../../../index.js')

const mainHex = '#d79a61'

exports.levelsSettingsCmd = async function levelsSettingsCmd(user,guild,interaction) {
    const cmdName = 'levels-settings'

    let doc = await redis.hGet('guildXpData', guild.id)
    doc = JSON.parse(doc)

    if (doc == null) {
        const embed = new EmbedBuilder()
        .setTitle('Disabled Levels')
        .setDescription('You must enable levels to use this command.')
        .setColor('Red')

        interaction.reply({
            embeds: [embed]
        })
        return
    }

    if (!doc.settings.enabled) {
        const embed = new EmbedBuilder()
        .setTitle('Disabled Levels')
        .setDescription('You must enable levels to use this command.')
        .setColor('Red')

        interaction.reply({
            embeds: [embed]
        })
        return
    }

    const settings = `Levels Enabled: ${doc.settings.enabled}\nLevel Up Message Enabled: ${doc.settings.levelUpMessageEnabled}\nLevel Up Message Channel ID: ${doc.settings.levelUpMessageChannel}\nLevel Up Message: ${doc.settings.levelUpMessage}\nXP Per Message Low: ${doc.settings.xpPerMessageLow}\nXP Per Message High: ${doc.settings.xpPerMessageHigh}\nXP Cooldown: ${doc.settings.xpCooldown}\nXP Cooldown Type: ${doc.settings.xpCooldownType}\nIgnored Channels: ${doc.settings.ignoredChannels}\nIgnored Roles: ${doc.settings.ignoredRoles}\nReward Roles Enabled: ${doc.settings.rewardRoles.enabled}\nReward Roles: ${doc.settings.rewardRoles.roles}\nReward Roles Type: ${doc.settings.rewardRolesType}\nWeb Leaderboard Enabled: ${doc.settings.webLeaderboardEnabled}\nRank Card Background Color: ${doc.settings.rankCardSettings.backgroundColor}\nRank Card Accent Color: ${doc.settings.rankCardSettings.accentColor}`

    const embed = new EmbedBuilder()
    .setTitle(`Settings for ${guild.name} level system`)
    .setColor(mainHex)
    .setDescription('All settings can be edited on the [web dashboard](https://seedsbot.xyz/login)')
    .setFields([
        {
            name: 'Settings',
            value: codeBlock(settings)
        }
    ])
    .setFooter({
        iconURL: user.avatarURL(),
        text: `${user.tag}`
    })
    .setTimestamp()

    interaction.reply({
        embeds: [embed]
    })

    cmdRun(user,cmdName,guild,interaction)
}