const { cmdRun } = require('../../functions/cmdRun.js')
const { EmbedBuilder } = require('discord.js');
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
            const embed = new EmbedBuilder()
                .setColor(mainHex)
                .setTitle('Seeds Stats')
                .setThumbnail('https://seedsbot.xyz/images/logo.png')
                .setFields([
                    {
                        name: 'Servers:',
                        value: `${guilds}`,
                        inline: true
                    },
                    {
                        name: 'CPU %:',
                        value: `${cpuPercentage}`,
                        inline: true
                    },
                    {
                        name: 'Mem. %:',
                        value: `${info.freeMemPercentage}%`,
                        inline: true
                    },
                    {
                        name: 'Ping:',
                        value: `${Math.round(client.ws.ping)}ms`,
                        inline: true
                    },
                    {
                        name: 'Uptime:',
                        value: `${uptime} Days`,
                        inline: true
                    },
                    {
                        name: 'Library:',
                        value: 'Discord.JS',
                        inline: true
                    },
                    {
                        name: 'Links',
                        value: '[🌐 Website](https://seedsbot.xyz) | [<:invite:823987169978613851> Invite](https://seedsbot.xyz/invite) | [<:discord:823989269626355793> Support](https://seedsbot.xyz/support)'
                    }
                ])
            interaction.reply({
                embeds: [embed],
            })
            cmdRun(user,cmdName,guild,interaction)
        });
    });
} 