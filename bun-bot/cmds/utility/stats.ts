import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import embedBuilder from "../../lib/embedBuilder";
import { client } from "../../bot";
import { heapStats } from "bun:jsc";

// create the command
const command = new SlashCommandBuilder()
    .setName('stats')
    .setDescription('Get some stats about the bot.');
    
// write the function
async function execute(interaction: ChatInputCommandInteraction) {

    const heapstat = heapStats();

    const embedData = {
        title: "Seeds Stats",
        description: `Some statistics about Seeds\`\`\`asciidoc
Servers   ::   ${interaction.client.guilds.cache.size.toLocaleString('en-US')}
Users     ::   ${interaction.client.users.cache.size.toLocaleString('en-US')} (in cache)
CPU       ::   ${(process.cpuUsage().system / 1000000).toFixed(2)}%
RAM       ::   ${(heapstat.heapSize / 1024 / 1024).toFixed(2)} MB (${((heapstat.heapSize / heapstat.heapCapacity) * 100).toFixed(2)}%)
Ping      ::   ${Math.round(interaction.client.ws.ping)} ms
Uptime    ::   ${Math.round(process.uptime() / 1000 / 60 / 60 / 24)} days
Library   ::   Discord.js
Runtime   ::   Bun\`\`\``
        ,
        color: client.mainColor,
        fields: [
            {
                name: "Links",
                value: "[🌐 Website](https://seedsbot.xyz) | [<:invite:823987169978613851> Invite](https://seedsbot.xyz/invite) | [<:discord:823989269626355793> Support](https://seedsbot.xyz/discord)",
                inline: false
            }
        ],
    }
    
    const embed = embedBuilder(embedData as any);

    await interaction.reply({ embeds: [embed] });

}

// export the command
const data = {
    data: command,
    execute: execute
}

export { 
    data
};