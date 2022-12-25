const { cmdRun } = require('../../functions/cmdRun.js')
const { MessageEmbed } = require('discord.js');
const osu = require('node-os-utils');
const client = require('../../index.js').client

const mainHex = '#d79a61'

exports.statsCmd = function statsCmd(user,guild,interaction) {
    const cmdName = 'stats'

    const guilds = client.guilds.cache.size

    const cpu = osu.cpu
    const mem = osu.mem
    const uptime = Math.round(client.uptime / 1000 / 60 / 60 / 24)

    cpu.usage().then(cpuPercentage => {
        mem.info().then(info => {
            const embed = new MessageEmbed()
                .setColor(mainHex)
                .setTitle('Jams Stats')
                .setThumbnail('https://seedsbot.xyz/images/logo.png')
                .addField("Servers:", `${guilds}`, true)
                .addField('CPU %:', `${cpuPercentage}`, true)
                .addField('Mem. %:', `${info.freeMemPercentage}%`, true)
                .addField('Ping:', `${Math.round(client.ws.ping)}ms`, true)
                .addField('Uptime:', `${uptime} Days`, true)
                .addField('Library:', 'Discord.JS', true)
                .addField('Links', '[🌐 Website](https://seedsbot.xyz) | [<:invite:823987169978613851> Invite](https://seedsbot.xyz/invite) | [<:discord:823989269626355793> Support](https://seedsbot.xyz/support)')
            interaction.reply({
                embeds: [embed],
            })
            cmdRun(user,cmdName)
        });
    });
} 