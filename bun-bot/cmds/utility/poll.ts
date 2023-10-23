import { ChatInputCommandInteraction, InteractionResponse, Message, SlashCommandBuilder } from "discord.js";
import embedBuilder from "../../lib/embedBuilder";

// create the command
const command = new SlashCommandBuilder()
    .setName('poll')
    .setDescription('Send a poll for multiple options in the server');

// add the options
command.addStringOption(option => option.setName('options').setDescription('Options for the poll, put up to 8 separated with ||').setRequired(true));

// execute the command
async function execute(interaction: ChatInputCommandInteraction) {
    // the option is a single string 
    const options = interaction.options.getString('options');

    // split the options into an array by the || delimiter
    const optionsArr = options?.split("||");

    // if there are more than 8 options, return an error
    if (optionsArr?.length) {
        if (optionsArr?.length > 8) {
            return await interaction.reply({ content: "You can only have up to 8 options in a poll.", ephemeral: true });
        }
    }

    // create the description string
    let description = "";

    // loop through each option
    optionsArr?.forEach((option, index) => {
        // add the option to the description string, the emoji is the index + 1 but make sure its an emoji
        description += `${index + 1}️⃣ **${option}**\n\n`;
    });

    // create the embed data
    const embedData = {
        title: "Poll - React with the emoji to vote!",
        description: description,
        author: {
            name: interaction.user.tag,
            iconURL: interaction.user.displayAvatarURL()
        },
        color: "Blue",
    }

    // build the embed
    const embed = embedBuilder(embedData as any);

    // send the embed
    const response = await interaction.reply({ embeds: [embed] });

    // get the message
    const message = await (response as InteractionResponse).fetch() as Message;

    // loop through each option
    optionsArr?.forEach((option, index) => {
        // react with the emoji
        message.react(`${index + 1}️⃣`);
    });
}

// export the command
const data = {
    data: command,
    execute: execute
}

export { 
    data
};