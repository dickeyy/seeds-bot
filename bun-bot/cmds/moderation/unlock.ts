import { ChannelType, ChatInputCommandInteraction, DiscordAPIError, PermissionFlagsBits, SlashCommandBuilder, User } from "discord.js";
import embedBuilder from "../../lib/embedBuilder";
import { logger } from "../../lib/logger";
import { client, db } from "../../bot";

// create the command
const command = new SlashCommandBuilder()
    .setName('unlock')
    .setDescription('Unlock a channel');

command.setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
command.addChannelOption(option => option.setName('channel').setDescription('The channel to unlock. Defaults to the current channel if not specified.').setRequired(false))

// write the function
async function execute(interaction: ChatInputCommandInteraction) {

    const channel:any = interaction.options.getChannel('channel') ?? interaction.channel;

    if (channel?.type !== ChannelType.GuildText) {
        const embedData = {
            title: "Error: Invalid channel.",
            description: "You can only unlock text channels.",
            color: "Red",
        }
        return await interaction.reply({ embeds: [embedBuilder(embedData as any)], ephemeral: true });
    }

    const embedData = {
        title: "🔓 Channel Unlocked",
        description: `This channel has been unlocked.`,
        color: client.mainColor,
        timestamp: new Date()
    }
    const replyEmbedData = {
        description: `Successfully unlocked <#${channel.id}>`,
        color: 'Green',
    }

    const replyEmbed = embedBuilder(replyEmbedData as any);
    const embed = embedBuilder(embedData as any);

    await channel.permissionOverwrites.edit(interaction.guild?.roles.everyone!, { SendMessages: null });

    await interaction.reply({ embeds: [replyEmbed] });
    await channel.send({ embeds: [embed] });

}

// export everything
const data = {
    data: command,
    execute: execute,
}

export {
    data
};