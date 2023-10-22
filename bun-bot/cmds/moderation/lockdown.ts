import { ChannelType, ChatInputCommandInteraction, DiscordAPIError, PermissionFlagsBits, SlashCommandBuilder, User } from "discord.js";
import embedBuilder from "../../lib/embedBuilder";
import { logger } from "../../lib/logger";
import { client, db } from "../../bot";

// create the command
const command = new SlashCommandBuilder()
    .setName('lockdown')
    .setDescription('Lockdown a channel or the server');

command.setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)

command.addSubcommand(
    subcommand => subcommand
    .setName('channel')
    .setDescription('Lockdown a channel')
    .addChannelOption(option => option.setName('channel').setDescription('The channel to lockdown. Defaults to the current channel if not specified.').setRequired(false))
)

command.addSubcommand(
    subcommand => subcommand
    .setName('server')
    .setDescription('Lockdown the server. Warning: This will lock every channel in the server.')
)

// write the function
async function execute(interaction: ChatInputCommandInteraction) {

    const subcommand = interaction.options.getSubcommand();

    if (subcommand == "channel") {
        await executeChannel(interaction);
    } else if (subcommand == "server") {
        await executeServer(interaction);
    }

}

async function executeChannel(interaction: ChatInputCommandInteraction) {

    const channel:any = interaction.options.getChannel('channel') ?? interaction.channel;
    
    if (channel.type !== ChannelType.GuildText) {
        const embedData = {
            title: "Error: Invalid channel.",
            description: "You can only lockdown text channels.",
            color: "Red",
        }
        return await interaction.reply({ embeds: [embedBuilder(embedData as any)], ephemeral: true });
    }

    const embedData = {
        title: "🔒 Channel Locked",
        description: `Please wait for a moderator to unlock this channel.`,
        color: client.mainColor,
        timestamp: new Date()
    }

    const replyEmbedData = {
        description: `Successfully locked <#${channel.id}>`,
        color: "Green"
    }

    const embed = embedBuilder(embedData as any);

    await channel.permissionOverwrites.edit(interaction.guild?.roles.everyone!, { SendMessages: false });
    await channel.send({ embeds: [embed] });

    await interaction.reply({ embeds: [embedBuilder(replyEmbedData as any)] });

}

async function executeServer(interaction: ChatInputCommandInteraction) {

    // go through every channel in the server, if the channel already has the permissions, skip it
    const channels = interaction.guild?.channels.cache.filter(channel => channel.type === ChannelType.GuildText);
    
    // check if each channel has the permissions
    channels?.forEach(async (channel: any) => {
        if (channel.permissionsFor(interaction.guild?.roles.everyone!)?.has(PermissionFlagsBits.SendMessages)) {
            await channel.permissionOverwrites.edit(interaction.guild?.roles.everyone!, { SendMessages: false });
        }

        const embedData = {
            title: "🔒 Channel Locked",
            description: `Please wait for a moderator to unlock this channel.`,
            color: client.mainColor,
            timestamp: new Date()
        }

        const embed = embedBuilder(embedData as any);

        await channel.send({ embeds: [embed] });
    });

    const embedData = {
        description: `Successfully locked the server.`,
        color: "Green",
    }

    await interaction.reply({ embeds: [embedBuilder(embedData as any)] });

}

// export everything
const data = {
    data: command,
    execute: execute,
}

export {
    data
};