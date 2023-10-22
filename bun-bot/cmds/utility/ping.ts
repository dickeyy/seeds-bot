import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import embedBuilder from "../../lib/embedBuilder";

// create the command
const command = new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Replies with pong!');
    
// write the function
async function execute(interaction: ChatInputCommandInteraction) {

    const embedData = {
        description: `🏓 **Pong** - Bot Latency is \`${Date.now() - interaction.createdTimestamp}ms\`. API Latency is \`${Math.round(interaction.client.ws.ping)}ms\``,
        color: "Green",
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

