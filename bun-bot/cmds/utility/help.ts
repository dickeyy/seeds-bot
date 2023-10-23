import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import embedBuilder from "../../lib/embedBuilder";
import { client } from "../../bot";

// create the command
const command = new SlashCommandBuilder()
    .setName('help')
    .setDescription('Get help with Seeds commands.');

// write the function
async function execute(interaction: ChatInputCommandInteraction) {

    const embedData = {
        title: "Seeds Help",
        color: client.mainColor,
        thumbnail: interaction.client.user?.displayAvatarURL(),
        description: "All Seeds commands use the prefix `\`/`\`\n\n**Commands: **[All of Seeds commands can be found here](https://seedsbot.xyz/commands)\n**Need Help?** [Join our support server](https://seedsbot.xyz/discord)",
        fields: [
            {
                name: "Links",
                value: "[🌐 Website](https://seedsbot.xyz) | [<:invite:823987169978613851> Invite](https://seedsbot.xyz/invite) | [<:discord:823989269626355793> Support](https://seedsbot.xyz/discord)",
                inline: false
            }
        ]
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