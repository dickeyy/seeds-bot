import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import embedBuilder from "../../lib/embedBuilder";

// create the command
const command = new SlashCommandBuilder()
    .setName('coinflip')
    .setDescription('Flip a coin! duh');

// write the function
async function execute(interaction: ChatInputCommandInteraction) {

    // generate a random number 0 and 1. round it
    const random = Math.round(Math.random());
    let embedData;

    if (random == 1) {
        embedData = {
            title: "<:simp_coin:824720566241853460> Heads!",
            color: "Gold"
        }
    } else {
        embedData = {
            title: "<:fuck_coin:824720614543196220> Tails!",
            color: "LightGrey"
        }
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