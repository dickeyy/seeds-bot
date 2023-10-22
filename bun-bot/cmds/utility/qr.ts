import { ChatInputCommandInteraction, Guild, SlashCommandBuilder } from "discord.js";
import embedBuilder from "../../lib/embedBuilder";
import { client } from "../../bot";

// create the command
const command = new SlashCommandBuilder()
    .setName('qr')
    .setDescription('Generate a QR code for a link');

// add the options
command.addStringOption(option => option.setName('link').setDescription('The link you want a QR code for').setRequired(true));

// execute the command
async function execute(interaction: ChatInputCommandInteraction) {
    
    const link = interaction.options.getString('link');
    let url = link;

    // make sure the link starts with http:// or https://, if not, add it
    if (!url?.startsWith('https://') && !url?.startsWith('http://')) {
        url = 'https://' + url;
    }

    // create the embed data
    const embedData = {
        title: "QR Code",
        description: `[Original URL](${url})`,
        image: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${url}`,
        color: client.mainColor,
        timestamp: new Date(),
    }

    // build the embed
    const embed = embedBuilder(embedData as any);

    // send the embed
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