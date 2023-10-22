import { ChatInputCommandInteraction, DiscordAPIError, PermissionFlagsBits, SlashCommandBuilder, User } from "discord.js";
import embedBuilder from "../../lib/embedBuilder";
import { logger } from "../../lib/logger";
import { client, db } from "../../bot";

// create the command
const command = new SlashCommandBuilder()
    .setName('purge')
    .setDescription('Purge messages based on a variety of options');

command.setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)

// setup subcommands
command.addSubcommand(
    subcommand => subcommand
    .setName('all')
    .setDescription('Purge purge a count of all message types in a channel or the current channel')
    .addNumberOption(option => option.setName('amount').setDescription('The number of messages to purge').setRequired(true))
    .addChannelOption(option => option.setName('channel').setDescription('The channel to purge messages from, defaults to the current channel'))
)

command.addSubcommand(
    subcommand => subcommand
    .setName('user')
    .setDescription('Purge messages from a specific user')
    .addUserOption(option => option.setName('user').setDescription('The user to purge messages from').setRequired(true))
    .addNumberOption(option => option.setName('amount').setDescription('The number of messages to purge').setRequired(true))
    .addChannelOption(option => option.setName('channel').setDescription('The channel to purge messages from, defaults to the current channel'))
)

command.addSubcommand(
    subcommand => subcommand
    .setName('seeds')
    .setDescription('Purge messages from Seeds')
    .addNumberOption(option => option.setName('amount').setDescription('The number of messages to purge').setRequired(true))
    .addChannelOption(option => option.setName('channel').setDescription('The channel to purge messages from, defaults to the current channel'))
)

command.addSubcommand(
    subcommand => subcommand
    .setName('emoji')
    .setDescription('Purge messages containing a specific emoji')
    .addStringOption(option => option.setName('emoji').setDescription('The emoji to search for').setRequired(true))
    .addNumberOption(option => option.setName('amount').setDescription('The number of messages to purge').setRequired(true))
    .addChannelOption(option => option.setName('channel').setDescription('The channel to purge messages from, defaults to the current channel'))
)

command.addSubcommand(
    subcommand => subcommand
    .setName('contains')
    .setDescription('Purge messages containing a specific string')
    .addStringOption(option => option.setName('string').setDescription('The string to search for').setRequired(true))
    .addNumberOption(option => option.setName('amount').setDescription('The number of messages to purge').setRequired(true))
    .addChannelOption(option => option.setName('channel').setDescription('The channel to purge messages from, defaults to the current channel'))
)

command.addSubcommand(
    subcommand => subcommand
    .setName('bots')
    .setDescription('Purge messages from bots')
    .addNumberOption(option => option.setName('amount').setDescription('The number of messages to purge').setRequired(true))
    .addChannelOption(option => option.setName('channel').setDescription('The channel to purge messages from, defaults to the current channel'))
)

command.addSubcommand(
    subcommand => subcommand
    .setName('embeds')
    .setDescription('Purge messages containing embeds')
    .addNumberOption(option => option.setName('amount').setDescription('The number of messages to purge').setRequired(true))
    .addChannelOption(option => option.setName('channel').setDescription('The channel to purge messages from, defaults to the current channel'))
)

command.addSubcommand(
    subcommand => subcommand
    .setName('attachments')
    .setDescription('Purge messages containing attachments')
    .addNumberOption(option => option.setName('amount').setDescription('The number of messages to purge').setRequired(true))
    .addChannelOption(option => option.setName('channel').setDescription('The channel to purge messages from, defaults to the current channel'))
)

// write the functions
async function execute(interaction: ChatInputCommandInteraction) {
    const subcommand = interaction.options.getSubcommand();
    
    if (subcommand === 'all') {
        await executeAll(interaction);
    } else if (subcommand === 'user') {
        await executeUser(interaction);
    } else if (subcommand === 'seeds') {
        await executeSeeds(interaction);
    } else if (subcommand === 'emoji') {
        await executeEmoji(interaction);
    } else if (subcommand === 'contains') {
        await executeContains(interaction);
    } else if (subcommand === 'bots') {
        await executeBots(interaction);
    } else if (subcommand === 'embeds') {
        await executeEmbeds(interaction);
    } else if (subcommand === 'attachments') {
        await executeAttachments(interaction); 
    } else {
        const embed = {
            description: 'Please select a valid subcommand',
            color: 'Red' as string
        }
        await interaction.reply({ embeds: [embedBuilder(embed as any)] });
    }
}

async function executeAll(interaction: ChatInputCommandInteraction) {

    const amount = interaction.options.getNumber('amount', true);
    const channel = interaction.options.getChannel('channel') ?? interaction.channel;

    // check if the amount is valid
    if (amount > 100) {
        const embed = {
            description: 'You can only purge 100 messages at a time',
            color: 'Red' as string
        }
        await interaction.reply({ embeds: [embedBuilder(embed as any)], ephemeral: true });
        return;
    }
    if (amount < 1) {
        const embed = {
            description: 'You must purge at least 1 message',
            color: 'Red' as string
        }
        await interaction.reply({ embeds: [embedBuilder(embed as any)], ephemeral: true });
        return;
    }
    
    // delete the messages
    const channelObj:any = await client.channels.fetch(channel?.id as string).catch((err: DiscordAPIError) => {
        logger.error("Error fetching channel", err);
        const embed = {
            description: 'There was an error fetching the channel',
            color: 'Red' as string
        }
        interaction.reply({ embeds: [embedBuilder(embed as any)], ephemeral: true });
    })
    await channelObj.bulkDelete(amount, true).catch(async (err: DiscordAPIError) => {
        logger.error("Error purging all messages", err);
        const embed = {
            description: 'There was an error purging messages',
            color: 'Red' as string
        }
        await interaction.reply({ embeds: [embedBuilder(embed as any)], ephemeral: true });
    })

    // send the response
    const embed = {
        description: `Successfully purged **${amount}** messages in <#${channel?.id}>`,
        color: client.mainColor as string
    }
    await interaction.reply({ embeds: [embedBuilder(embed as any)] });

}

async function executeUser(interaction: ChatInputCommandInteraction) {

    const amount = interaction.options.getNumber('amount', true);
    const user = interaction.options.getUser('user', true);
    const channel = interaction.options.getChannel('channel') ?? interaction.channel;

    // check if the amount is valid
    if (amount > 100) {
        const embed = {
            description: 'You can only purge 100 messages at a time',
            color: 'Red' as string
        }
        await interaction.reply({ embeds: [embedBuilder(embed as any)], ephemeral: true });
        return;
    }
    if (amount < 1) {
        const embed = {
            description: 'You must purge at least 1 message',
            color: 'Red' as string
        }
        await interaction.reply({ embeds: [embedBuilder(embed as any)], ephemeral: true });
        return;
    }

    // delete the messages
    const channelObj:any = await client.channels.fetch(channel?.id as string).catch((err: DiscordAPIError) => {
        logger.error("Error fetching channel", err);
        const embed = {
            description: 'There was an error fetching the channel',
            color: 'Red' as string
        }
        interaction.reply({ embeds: [embedBuilder(embed as any)], ephemeral: true });
    })
    const channelMessages = await channelObj.messages.fetch({ limit: 100 }).catch((err: DiscordAPIError) => {
        logger.error("Error fetching messages", err);
        const embed = {
            description: 'There was an error fetching messages',
            color: 'Red' as string
        }
        interaction.reply({ embeds: [embedBuilder(embed as any)], ephemeral: true });
    })

    const filteredMessages = channelMessages.filter((m: any) => m.author.id == user.id)
    const filteredMessagesArray = Array.from(filteredMessages.values()).slice(0, amount);
    
    await channelObj.bulkDelete(filteredMessagesArray, true).catch(async (err: DiscordAPIError) => {
        logger.error("Error purging all messages", err);
        const embed = {
            description: 'There was an error purging messages',
            color: 'Red' as string
        }
        await interaction.reply({ embeds: [embedBuilder(embed as any)], ephemeral: true });
    })

    // send the response
    const embed = {
        description: `Successfully purged **${amount}** messages from <@${user.id}> in <#${channel?.id}>`,
        color: client.mainColor as string
    }
    
    await interaction.reply({ embeds: [embedBuilder(embed as any)] });

}

async function executeSeeds(interaction: ChatInputCommandInteraction) {

    const amount = interaction.options.getNumber('amount', true);
    const channel = interaction.options.getChannel('channel') ?? interaction.channel;

    // check if the amount is valid
    if (amount > 100) {
        const embed = {
            description: 'You can only purge 100 messages at a time',
            color: 'Red' as string
        }
        await interaction.reply({ embeds: [embedBuilder(embed as any)], ephemeral: true });
        return;
    } 
    if (amount < 1) {
        const embed = {
            description: 'You must purge at least 1 message',
            color: 'Red' as string
        }
        await interaction.reply({ embeds: [embedBuilder(embed as any)], ephemeral: true });
        return;
    }

    // delete the messages
    const channelObj:any = await client.channels.fetch(channel?.id as string).catch((err: DiscordAPIError) => {
        logger.error("Error fetching channel", err);
        const embed = {
            description: 'There was an error fetching the channel',
            color: 'Red' as string
        }
        interaction.reply({ embeds: [embedBuilder(embed as any)], ephemeral: true });
    })
    const channelMessages = await channelObj.messages.fetch({ limit: 100 }).catch((err: DiscordAPIError) => {
        logger.error("Error fetching messages", err);
        const embed = {
            description: 'There was an error fetching messages',
            color: 'Red' as string
        }
        interaction.reply({ embeds: [embedBuilder(embed as any)], ephemeral: true });
    })

    const filteredMessages = channelMessages.filter((m: any) => m.author.id == client.user?.id)
    const filteredMessagesArray = Array.from(filteredMessages.values()).slice(0, amount);

    await channelObj.bulkDelete(filteredMessagesArray, true).catch(async (err: DiscordAPIError) => {
        logger.error("Error purging all messages", err);
        const embed = {
            description: 'There was an error purging messages',
            color: 'Red' as string
        }
        await interaction.reply({ embeds: [embedBuilder(embed as any)], ephemeral: true });
    })

    // send the response
    const embed = {
        description: `Successfully purged **${amount}** messages from <@${client.user?.id}> in <#${channel?.id}>`,
        color: client.mainColor as string
    }

    await interaction.reply({ embeds: [embedBuilder(embed as any)] });

}

async function executeEmoji(interaction: ChatInputCommandInteraction) {

    const amount = interaction.options.getNumber('amount', true);
    const emoji = interaction.options.getString('emoji', true);
    const channel = interaction.options.getChannel('channel') ?? interaction.channel;

    // check if the amount is valid
    if (amount > 100) {
        const embed = {
            description: 'You can only purge 100 messages at a time',
            color: 'Red' as string
        }
        await interaction.reply({ embeds: [embedBuilder(embed as any)], ephemeral: true });
        return;
    } 
    if (amount < 1) {
        const embed = {
            description: 'You must purge at least 1 message',
            color: 'Red' as string
        }
        await interaction.reply({ embeds: [embedBuilder(embed as any)], ephemeral: true });
        return;
    }

    // delete the messages
    const channelObj:any = await client.channels.fetch(channel?.id as string).catch((err: DiscordAPIError) => {
        logger.error("Error fetching channel", err);
        const embed = {
            description: 'There was an error fetching the channel',
            color: 'Red' as string
        }
        interaction.reply({ embeds: [embedBuilder(embed as any)], ephemeral: true });
    })
    const channelMessages = await channelObj.messages.fetch({ limit: 100 }).catch((err: DiscordAPIError) => {
        logger.error("Error fetching messages", err);
        const embed = {
            description: 'There was an error fetching messages',
            color: 'Red' as string
        }
        interaction.reply({ embeds: [embedBuilder(embed as any)], ephemeral: true });
    });

    const filteredMessages = channelMessages.filter((m: any) => m.content.includes(emoji))
    const filteredMessagesArray = Array.from(filteredMessages.values()).slice(0, amount);

    await channelObj.bulkDelete(filteredMessagesArray, true).catch(async (err: DiscordAPIError) => {
        logger.error("Error purging all messages", err);
        const embed = {
            description: 'There was an error purging messages',
            color: 'Red' as string
        }
        await interaction.reply({ embeds: [embedBuilder(embed as any)], ephemeral: true });
    })

    // send the response
    const embed = {
        description: `Successfully purged **${amount}** messages containing ${emoji} in <#${channel?.id}>`,
        color: client.mainColor as string
    }

    await interaction.reply({ embeds: [embedBuilder(embed as any)] });

}

async function executeContains(interaction: ChatInputCommandInteraction) {

    const amount = interaction.options.getNumber('amount', true);
    const string = interaction.options.getString('string', true);
    const channel = interaction.options.getChannel('channel') ?? interaction.channel;

    // check if the amount is valid
    if (amount > 100) {
        const embed = {
            description: 'You can only purge 100 messages at a time',
            color: 'Red' as string
        }
        await interaction.reply({ embeds: [embedBuilder(embed as any)], ephemeral: true });
        return;
    } 
    if (amount < 1) {
        const embed = {
            description: 'You must purge at least 1 message',
            color: 'Red' as string
        }
        await interaction.reply({ embeds: [embedBuilder(embed as any)], ephemeral: true });
        return;
    }

    // delete the messages
    const channelObj:any = await client.channels.fetch(channel?.id as string).catch((err: DiscordAPIError) => {
        logger.error("Error fetching channel", err);
        const embed = {
            description: 'There was an error fetching the channel',
            color: 'Red' as string
        }
        interaction.reply({ embeds: [embedBuilder(embed as any)], ephemeral: true });
    })
    const channelMessages = await channelObj.messages.fetch({ limit: 100 }).catch((err: DiscordAPIError) => {
        logger.error("Error fetching messages", err);
        const embed = {
            description: 'There was an error fetching messages',
            color: 'Red' as string
        }
        interaction.reply({ embeds: [embedBuilder(embed as any)], ephemeral: true });
    });

    const filteredMessages = channelMessages.filter((m: any) => m.content.includes(string))
    const filteredMessagesArray = Array.from(filteredMessages.values()).slice(0, amount);

    await channelObj.bulkDelete(filteredMessagesArray, true).catch(async (err: DiscordAPIError) => {
        logger.error("Error purging all messages", err);
        const embed = {
            description: 'There was an error purging messages',
            color: 'Red' as string
        }
        await interaction.reply({ embeds: [embedBuilder(embed as any)], ephemeral: true });
    })

    // send the response
    const embed = {
        description: `Successfully purged **${amount}** messages containing \`${string}\` in <#${channel?.id}>`,
        color: client.mainColor as string
    }

    await interaction.reply({ embeds: [embedBuilder(embed as any)] });

}

async function executeBots(interaction: ChatInputCommandInteraction) {

    const amount = interaction.options.getNumber('amount', true);
    const channel = interaction.options.getChannel('channel') ?? interaction.channel;

    // check if the amount is valid
    if (amount > 100) {
        const embed = {
            description: 'You can only purge 100 messages at a time',
            color: 'Red' as string
        }
        await interaction.reply({ embeds: [embedBuilder(embed as any)], ephemeral: true });
        return;
    } 
    if (amount < 1) {
        const embed = {
            description: 'You must purge at least 1 message',
            color: 'Red' as string
        }
        await interaction.reply({ embeds: [embedBuilder(embed as any)], ephemeral: true });
        return;
    }

    // delete the messages
    const channelObj:any = await client.channels.fetch(channel?.id as string).catch((err: DiscordAPIError) => {
        logger.error("Error fetching channel", err);
        const embed = {
            description: 'There was an error fetching the channel',
            color: 'Red' as string
        }
        interaction.reply({ embeds: [embedBuilder(embed as any)], ephemeral: true });
    })
    const channelMessages = await channelObj.messages.fetch({ limit: 100 }).catch((err: DiscordAPIError) => {
        logger.error("Error fetching messages", err);
        const embed = {
            description: 'There was an error fetching messages',
            color: 'Red' as string
        }
        interaction.reply({ embeds: [embedBuilder(embed as any)], ephemeral: true });
    });

    const filteredMessages = channelMessages.filter((m: any) => m.author.bot)
    const filteredMessagesArray = Array.from(filteredMessages.values()).slice(0, amount);

    await channelObj.bulkDelete(filteredMessagesArray, true).catch(async (err: DiscordAPIError) => {
        logger.error("Error purging all messages", err);
        const embed = {
            description: 'There was an error purging messages',
            color: 'Red' as string
        }
        await interaction.reply({ embeds: [embedBuilder(embed as any)], ephemeral: true });
    })

    // send the response
    const embed = {
        description: `Successfully purged **${amount}** messages from bots in <#${channel?.id}>`,
        color: client.mainColor as string
    }

    await interaction.reply({ embeds: [embedBuilder(embed as any)] });

}

async function executeEmbeds(interaction: ChatInputCommandInteraction) {

    const amount = interaction.options.getNumber('amount', true);
    const channel = interaction.options.getChannel('channel') ?? interaction.channel;

    // check if the amount is valid
    if (amount > 100) {
        const embed = {
            description: 'You can only purge 100 messages at a time',
            color: 'Red' as string
        }
        await interaction.reply({ embeds: [embedBuilder(embed as any)], ephemeral: true });
        return;
    } 
    if (amount < 1) {
        const embed = {
            description: 'You must purge at least 1 message',
            color: 'Red' as string
        }
        await interaction.reply({ embeds: [embedBuilder(embed as any)], ephemeral: true });
        return;
    }

    // delete the messages
    const channelObj:any = await client.channels.fetch(channel?.id as string).catch((err: DiscordAPIError) => {
        logger.error("Error fetching channel", err);
        const embed = {
            description: 'There was an error fetching the channel',
            color: 'Red' as string
        }
        interaction.reply({ embeds: [embedBuilder(embed as any)], ephemeral: true });
    })
    const channelMessages = await channelObj.messages.fetch({ limit: 100 }).catch((err: DiscordAPIError) => {
        logger.error("Error fetching messages", err);
        const embed = {
            description: 'There was an error fetching messages',
            color: 'Red' as string
        }
        interaction.reply({ embeds: [embedBuilder(embed as any)], ephemeral: true });
    });

    const filteredMessages = channelMessages.filter((m: any) => m.embeds.length > 0)
    const filteredMessagesArray = Array.from(filteredMessages.values()).slice(0, amount);

    await channelObj.bulkDelete(filteredMessagesArray, true).catch(async (err: DiscordAPIError) => {
        logger.error("Error purging all messages", err);
        const embed = {
            description: 'There was an error purging messages',
            color: 'Red' as string
        }
        await interaction.reply({ embeds: [embedBuilder(embed as any)], ephemeral: true });
    })

    // send the response
    const embed = {
        description: `Successfully purged **${amount}** messages containing embeds in <#${channel?.id}>`,
        color: client.mainColor as string
    }

    await interaction.reply({ embeds: [embedBuilder(embed as any)] });

}

async function executeAttachments(interaction: ChatInputCommandInteraction) {

    const amount = interaction.options.getNumber('amount', true);
    const channel = interaction.options.getChannel('channel') ?? interaction.channel;

    // check if the amount is valid
    if (amount > 100) {
        const embed = {
            description: 'You can only purge 100 messages at a time',
            color: 'Red' as string
        }
        await interaction.reply({ embeds: [embedBuilder(embed as any)], ephemeral: true });
        return;
    } 
    if (amount < 1) {
        const embed = {
            description: 'You must purge at least 1 message',
            color: 'Red' as string
        }
        await interaction.reply({ embeds: [embedBuilder(embed as any)], ephemeral: true });
        return;
    }

    // delete the messages
    const channelObj:any = await client.channels.fetch(channel?.id as string).catch((err: DiscordAPIError) => {
        logger.error("Error fetching channel", err);
        const embed = {
            description: 'There was an error fetching the channel',
            color: 'Red' as string
        }
        interaction.reply({ embeds: [embedBuilder(embed as any)], ephemeral: true });
    })
    const channelMessages = await channelObj.messages.fetch({ limit: 100 }).catch((err: DiscordAPIError) => {
        logger.error("Error fetching messages", err);
        const embed = {
            description: 'There was an error fetching messages',
            color: 'Red' as string
        }
        interaction.reply({ embeds: [embedBuilder(embed as any)], ephemeral: true });
    });

    const filteredMessages = channelMessages.filter((m: any) => m.attachments.size > 0)
    const filteredMessagesArray = Array.from(filteredMessages.values()).slice(0, amount);

    await channelObj.bulkDelete(filteredMessagesArray, true).catch(async (err: DiscordAPIError) => {
        logger.error("Error purging all messages", err);
        const embed = {
            description: 'There was an error purging messages',
            color: 'Red' as string
        }
        await interaction.reply({ embeds: [embedBuilder(embed as any)], ephemeral: true });
    })

    // send the response
    const embed = {
        description: `Successfully purged **${amount}** messages containing attachments in <#${channel?.id}>`,
        color: client.mainColor as string
    }

    await interaction.reply({ embeds: [embedBuilder(embed as any)] });

}

// export everything
const data = {
    data: command,
    execute: execute,
}

export {
    data
};
