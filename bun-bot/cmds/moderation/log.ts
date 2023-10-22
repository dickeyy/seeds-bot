import { ChannelType, ChatInputCommandInteraction, PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import embedBuilder from "../../lib/embedBuilder";
import { logger } from "../../lib/logger";
import { client, db, redis } from "../../bot";
import { logsettings } from "../../schema/logsettings";
import { eq } from "drizzle-orm";

// create the command
const command = new SlashCommandBuilder()
    .setName('log')
    .setDescription('Work with the logging system');

command.setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)

command.addSubcommandGroup(
    group => group
    .setName("set")
    .setDescription("Set the settings for the logging system")
    .addSubcommand(
        subcommand => subcommand
        .setName("channel")
        .setDescription("Set the logging channel for a given type")
        .addStringOption(
            option => option
            .setName("type")
            .setDescription("The type of logging to set the channel for")
            .setRequired(true)
            .addChoices(
                {
                    name: "messages",
                    value: "messages"
                }, 
                {
                    name: "members",
                    value: "members"
                },
                {
                    name: "server",
                    value: "server"
                }
            )
        )
        .addChannelOption(
            option => option
            .setName("channel")
            .setDescription("The channel to set the logging channel to")
            .setRequired(true)
        )
    )
)

command.addSubcommand(
    subcommand => subcommand
    .setName("toggle")
    .setDescription("Toggle the types of logs")
    .addStringOption(
        option => option
        .setName("server")
        .setDescription("Toggle server event types")
        .setRequired(false)
        .addChoices(
            { name: "Server Update", value: "server_update" },
            { name: "Channel Create", value: "channel_create" }, 
            { name: "Channel Delete", value: "channel_delete" },
            { name: "Channel Pins Update", value: "channel_pins_update"},
            { name: "Channel Update", value: "channel_update"},
            { name: "Emoji Create", value: "emoji_create" },
            { name: "Emoji Delete", value: "emoji_delete" },
            { name: "Emoji Update", value: "emoji_update" },
            { name: "Server Event Create", value: "event_create" },
            { name: "Server Event Delete", value: "event_delete" },
            { name: "Server Event Update", value: "event_update" },
            { name: "Invite Create", value: "invite_create" },
            { name: "Invite Delete", value: "invite_delete" },
            { name: "Role Create", value: "role_create" },
            { name: "Role Delete", value: "role_delete" },
            { name: "Role Update", value: "role_update" },
            { name: "Sticker Create", value: "sticker_create" },
            { name: "Sticker Delete", value: "sticker_delete" },
            { name: "Sticker Update", value: "sticker_update" },
            { name: "Thread Create", value: "thread_create" },
            { name: "Thread Delete", value: "thread_delete" },
            { name: "Thread Update", value: "thread_update" }
        )
    )
    .addStringOption(
        option => option
        .setName("members")
        .setDescription("Toggle member event types")
        .setRequired(false)
        .addChoices(
            { name: "Member Banned", value: "member_banned" },
            { name: "Member Unbanned", value: "member_unbanned" },
            { name: "Member Join", value: "member_join" },
            { name: "Member Leave", value: "member_leave" },
            { name: "Member Update", value: "member_update" },
        )
    )
    .addStringOption(
        option => option
        .setName("messages")
        .setDescription("Toggle message event types")
        .setRequired(false)
        .addChoices(
            { name: "Message Delete", value: "message_delete" },
            { name: "Message Update", value: "message_update" },
            { name: "Message Bulk Delete", value: "message_bulk_delete" },
        )
    )
)

// write the function
async function execute(interaction: ChatInputCommandInteraction) {
    const subcommand = interaction.options.getSubcommand();
    const subcommandGroup = interaction.options.getSubcommandGroup();

    if (subcommandGroup == "set") {
        if (subcommand == "channel") {
            await executeSetChannel(interaction);
        }
    } else if (subcommand == "toggle") {
        await executeToggle(interaction);
    } else {
        await interaction.reply({
            embeds: [
                embedBuilder({
                    description: "This command is not yet implemented"
                } as any)
            ]
        })
    }
}

async function executeSetChannel(interaction: ChatInputCommandInteraction) {

    const channel:any = interaction.options.getChannel("channel")
    const type:any = interaction.options.getString("type");

    interaction.deferReply();

    if (channel.type !== ChannelType.GuildText) {
        const embedData = {
            description: "You can only set log channels to text channels.",
            color: "Red",
        }
        return await interaction.editReply({ embeds: [embedBuilder(embedData as any)]});
    }

    // make sure the bot has permissions to send messages in the channel
    if (!channel.permissionsFor(client?.user?.id).has(PermissionFlagsBits.SendMessages)) {
        const embedData = {
            description: "I don't have permission to send messages in that channel.",
            color: "Red",
        }
        return await interaction.editReply({ embeds: [embedBuilder(embedData as any)] });
    }

    // create a webhook
    let webhook;
    try {
        webhook = await channel.createWebhook({
            name: "Seeds Logging",
            avatar: client?.user?.avatarURL() as string
        })
    } catch (error) {
        logger.error(error);
        const embedData = {
            description: "Something went wrong while creating the webhook.",
            color: "Red",
        }
        return interaction.editReply({ embeds: [embedBuilder(embedData as any)] });
    }

    // data is saved in the db and in redis. we need to first see if data exists for this guild in redis or db. If either of them exist, we need to upadte the data. If neither exist, we need to create the data. However, db will error if we try and update data that isnt there (if for some reason data is in redis but not db) so if we update we need to be sure that it is in both

    // check redis
    const redisData = await redis.hGet("seeds:logsettings", interaction.guild?.id as string);
    // check db
    const dbData = await db.select().from(logsettings).where(eq(logsettings.guild_id, interaction.guild?.id as string)).limit(1).execute();

    // set some booleans to determine if data was saved properly
    let redisSaved = false;
    let dbSaved = false;

    // fresh data if nothing exists
    const newData = {
        guild_id: interaction.guild?.id as string,
        types: {
            [type]: {
                channel_id: channel.id,
                webhook_url: webhook.url
            }
        },
        enabled_types: [
            "server_update",
            "channel_create",
            "channel_delete",
            "channel_pins_update",
            "channel_update",
            "emoji_create",
            "emoji_delete",
            "emoji_update",
            "event_create",
            "event_delete",
            "event_update",
            "invite_create",
            "invite_delete",
            "role_create",
            "role_delete",
            "role_update",
            "sticker_create",
            "sticker_delete",
            "sticker_update",
            "thread_create",
            "thread_delete",
            "thread_update",
            "member_banned",
            "member_unbanned",
            "member_join",
            "member_leave",
            "member_update",
            "message_delete",
            "message_update",
            "message_bulk_delete"
        ]
    }
    
    // if data exists in redis, update it
    if (redisData) {
        const parsedData = JSON.parse(redisData);
        parsedData.types[type] = {
            channel_id: channel.id,
            webhook_url: webhook.url
        }
        try {
            await redis.hSet("seeds:logsettings", interaction.guild?.id as string, JSON.stringify(parsedData)).then(() => {
                redisSaved = true;
            })
        } catch (error) {
            logger.error("Error saving data to redis", {
                error
            });
            return await interaction.editReply({
                embeds: [embedBuilder({
                    description: "Something went wrong while saving the data to redis.",
                    color: "Red"
                } as any)]
            })
        }
    } else { // data doesnt exist in redis, create it
        try {
            await redis.hSet("seeds:logsettings", interaction.guild?.id as string, JSON.stringify(newData)).then(() => {
                redisSaved = true;
            })
        } catch (error) {
            logger.error("Error saving data to redis", {
                error
            });
            return await interaction.editReply({
                embeds: [embedBuilder({
                    description: "Something went wrong while saving the data to redis.",
                    color: "Red"
                } as any)]
            })
        }
    }

    // if data exists in db, update it
    if (dbData.length > 0) {
        (dbData[0] as any).types[type] = {
            channel_id: channel.id,
            webhook_url: webhook.url
        }
        try {
            await db.update(logsettings).set(dbData[0]).where(eq(logsettings.guild_id, interaction.guild?.id as string)).execute().then(() => {
                dbSaved = true;
            })
        } catch (error) {
            logger.error("Error saving data to db", {
                error
            });
            return await interaction.editReply({
                embeds: [embedBuilder({
                    description: "Something went wrong while saving the data to the database.",
                    color: "Red"
                } as any)]
            })
        }
    } else {
        try {
            await db.insert(logsettings).values(newData).execute().then(() => {
                dbSaved = true;
            })
        } catch (error) {
            logger.error("Error saving data to db", {
                error
            });
            return await interaction.editReply({
                embeds: [embedBuilder({
                    description: "Something went wrong while saving the data to the database.",
                    color: "Red"
                } as any)]
            })
        }
    }

    if (!redisSaved || !dbSaved) {
        return await interaction.editReply({
            embeds: [embedBuilder({
                description: "Something went wrong while saving the data.",
                color: "Red"
            } as any)]
        })
    }

    const embedData = { 
        description: `Successfully set the logging channel for \`${type}\` events to <#${channel.id}>.`,
        color: "Green", 
    }
    const channelEmbed = {
        description: `This channel has been set to the log channel for \`${type}\` events`,
        color: client.mainColor
    }

    await interaction.editReply({ embeds: [embedBuilder(embedData as any)] });
    await channel.send({ embeds: [embedBuilder(channelEmbed as any)] });

}

async function executeToggle(interaction: ChatInputCommandInteraction) {

    const server = interaction.options.getString("server");
    const members = interaction.options.getString("members");
    const messages = interaction.options.getString("messages");

    // get data from redis only, for this we don't care about the db toggles
    let data = null;
    const redisData = await redis.hGet("seeds:logsettings", interaction.guild?.id as string);

    // if no data exists, then check the db
    if (!redisData) {
        try {
            const dbData = await db.select().from(logsettings).where(
                eq(logsettings.guild_id, interaction.guild?.id as string)
            )
            if (dbData.length > 0) {
                data = JSON.stringify(dbData[0]);
            }
        } catch (error) {
            logger.error(error);
            return await interaction.reply({
                embeds: [embedBuilder({
                    description: "Something went wrong while getting the data.",
                    color: "Red"
                } as any)]
            })
        }
    } else {
        data = redisData;
    }

    // if there is no data, tell the user
    if (!data) {
        return await interaction.reply({
            embeds: [embedBuilder({
                description: "This server has not set up logging. Use `/log set channel`",
                color: "Red"
            } as any)]
        })
    }

    // parse the data
    data = JSON.parse(redisData as string);

    if (!server && !members && !messages) {
        const embedData = {
            title: "Enabled Log Types",
            description: "```" + data.enabled_types.join(", ") + "```",
            color: client.mainColor
        }

        return await interaction.reply({
            embeds: [embedBuilder(embedData as any)]
        })
    }

    // check if the toggle provided is in the data.types array
    if (data.enabled_types.includes(server) && server) {
        data.enabled_types.splice(data.enabled_types.indexOf(server), 1);
    } else if (server) {
        data.enabled_types.push(server);
    }

    if (data.enabled_types.includes(members) && members) {
        data.enabled_types.splice(data.enabled_types.indexOf(members), 1);
    } else if (members) {
        data.enabled_types.push(members);
    } 

    if (data.enabled_types.includes(messages) && messages) {
        data.enabled_types.splice(data.enabled_types.indexOf(messages), 1);
    } else if (messages) {
        data.enabled_types.push(messages);
    }

    // update redis
    try {
        await redis.hSet("seeds:logsettings", interaction.guild?.id as string, JSON.stringify(data));
    } catch (error) {
        logger.error(error);
        return await interaction.reply({
            embeds: [embedBuilder({
                description: "Something went wrong while saving the data.",
                color: "Red"
            } as any)]
        })
    }

    // reply to the user
    const embedData = {
        description: `Successfully toggled`,
        color: client.mainColor
    }

    await interaction.reply({
        embeds: [embedBuilder(embedData as any)]
    })
}

// export the command
const data = {
    data: command,
    execute: execute
}

export {
    data
};