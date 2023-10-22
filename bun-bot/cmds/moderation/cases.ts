import { ChatInputCommandInteraction, DiscordAPIError, PermissionFlagsBits, SlashCommandBuilder, User } from "discord.js";
import embedBuilder from "../../lib/embedBuilder";
import { logger } from "../../lib/logger";
import { client, db } from "../../bot";
import Case from "../../interfaces/Case";
import { cases } from "../../schema/case";
import { and, desc, eq } from "drizzle-orm";

// create the command
const command = new SlashCommandBuilder()
    .setName('cases')
    .setDescription('Work with cases for moderation');

command.setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)

// add the subcommands
command.addSubcommand(
    subcommand => subcommand
    .setName('add')
    .setDescription('Add a case to a user')
    .addUserOption(option => option.setName('user').setDescription('The user you want to add a case to').setRequired(true))
    .addStringOption(option => option.setName('reason').setDescription('The reason for the case').setRequired(true))
);
command.addSubcommandGroup(
    group => group
    .setName('remove')
    .setDescription('Remove a case from a user')
    .addSubcommand(
        subcommand => subcommand
        .setName('id')
        .setDescription('Remove a case by ID')
        .addNumberOption(option => option.setName('id').setDescription('The ID of the case you want to remove').setRequired(true))
    )

    .addSubcommand(
        subcommand => subcommand
        .setName('latest')
        .setDescription('Remove the latest case in your server')
    )

    .addSubcommand(
        subcommand => subcommand
        .setName('user')
        .setDescription('Remove all cases for a user')
        .addUserOption(option => option.setName('user').setDescription('The user you want to remove all cases for').setRequired(true))
    )
);
command.addSubcommandGroup(
    group => group
    .setName("view")
    .setDescription("Work with viewing cases")
    .addSubcommand(
        subcommand => subcommand
        .setName('id')
        .setDescription('View a case by ID')
        .addNumberOption(option => option.setName('id').setDescription('The ID of the case you want to view').setRequired(true))
    )
    .addSubcommand(
        subcommand => subcommand
        .setName('latest')
        .setDescription('View the latest case in your server')
    )
    .addSubcommand(
        subcommand => subcommand
        .setName('user')
        .setDescription('View all cases for a user')
        .addUserOption(option => option.setName('user').setDescription('The user you want to view all cases for').setRequired(true))
    )
)

// write the functions for each subcommand
async function execute(interaction: ChatInputCommandInteraction) {
    const subcommand = interaction.options.getSubcommand();
    const subcommandGroup = interaction.options.getSubcommandGroup();

    if (subcommand == "add") {
        executeCasesAdd(interaction);
    } else if (subcommandGroup == "remove") {
        const subcommand = interaction.options.getSubcommand();

        if (subcommand == "id") {
            executeCasesRemoveId(interaction);
        } else if (subcommand == "latest") {
            executeCasesRemoveLatest(interaction);
        } else if (subcommand == "user") {
            executeCasesRemoveUser(interaction);
        }
    } else if (subcommandGroup == "view") {
        const subcommand = interaction.options.getSubcommand();

        if (subcommand == "id") {
            executeCasesViewId(interaction);
        } else if (subcommand == "latest") {
            executeCasesViewLatest(interaction);
        } else if (subcommand == "user") {
            executeCasesViewUser(interaction);
        }
    } else {
        const embedData = {
            title: "Error: Subcommand not found.",
            color: "Red",
        }
        return await interaction.reply({ embeds: [embedBuilder(embedData as any)], ephemeral: true });
    }
}

// for cases add
async function executeCasesAdd(interaction: ChatInputCommandInteraction) {
    
    const user = interaction.options.getUser('user');
    const reason = interaction.options.getString('reason');

    // form the case data
    // generate a case id - numbers only - 8 digits
    const caseId = Math.floor(Math.random() * 90000000) + 10000000;
    const caseData:Case = {
        id: caseId.toString(),
        user_id: user?.id || "0",
        moderator_id: interaction.user.id,
        guild_id: interaction.guild?.id || "0",
        reason: reason as string,
        type: 0,
        created_at: new Date(),
    }

    // add the case to the database
    try {
        await db?.insert(cases).values(caseData).execute();
    } catch (error) {
        logger.error(error);
        const embedData = {
            title: "Error: An error occured when trying to add this case.",
            description: "Please try again later.",
            color: "Red",
        }
        return await interaction.reply({ embeds: [ embedBuilder(embedData as any) ], ephemeral: true });
    }

    // form embeds
    const embedData = {
        description: `<:warn:1165590684837875782> <@${user?.id}> has been warned with reason \`${reason}\``,
        footer: {
            text: `Case ID: ${caseId} | User ID: ${user?.id}`,
        },
        color: client.mainColor as string,
        timestamp: new Date(),
    }

    const dmEmbedData = {
        title: `⚠️ You have been warned in ${interaction.guild?.name}`,
        description: `**Reason:**\n\`${reason}\``,
        footer: {
            text: `Case ID: ${caseId}`,
        },
        author: {
            name: interaction.guild?.name || "Unknown",
            iconURL: interaction.guild?.iconURL() || undefined,
        },
        color: "Yellow",
        timestamp: new Date(),
    }

    // send embeds
    await interaction.reply({ embeds: [embedBuilder(embedData as any)] });
    await user?.send({ embeds: [embedBuilder(dmEmbedData as any)] }).catch((error: DiscordAPIError) => {
        if (error.code == 50007) {
            embedData.description += `\n\nI was unable to DM the user.`;

            interaction.editReply({ embeds: [embedBuilder(embedData as any)] });
        } else {
            logger.error("An error occurred when trying to DM a user after a warn", error);
        }
    });

}

// for cases remove id
async function executeCasesRemoveId(interaction: ChatInputCommandInteraction) {

    const id = interaction.options.getNumber('id');

    // remove the case from the database
    try {
        // remove the case from the database, where id = id and guild_id = guild_id
        await db?.delete(cases).where(and(
            eq(cases.id, id?.toString() || "0"),
            eq(cases.guild_id, interaction.guild?.id || "0"),
        )).execute();
    } catch (error) {
        logger.error(error);
        const embedData = {
            title: "Error: An error occured when trying to remove this case.",
            description: "Please try again later.",
            color: "Red",
        }
        return await interaction.reply({ embeds: [ embedBuilder(embedData as any) ], ephemeral: true });
    }

    // form embeds
    const embedData = {
        description: `Removed case \`${id}\``,
        color: client.mainColor as string,
    }

    // send embeds
    await interaction.reply({ embeds: [embedBuilder(embedData as any)] });

}

// for cases remove latest
async function executeCasesRemoveLatest(interaction: ChatInputCommandInteraction) {
    
    // get the latest case
    const latestCase = await db?.select().from(cases).where(
        eq(cases.guild_id, interaction.guild?.id || "0"),
    ).orderBy(desc(cases.created_at)).limit(1).execute();

    // remove the case from the database
    try {
        await db?.delete(cases).where(and(
            eq(cases.id, latestCase?.[0].id || "0"),
            eq(cases.guild_id, interaction.guild?.id || "0"),
        )).execute();
    } catch (error) {
        logger.error(error);
        const embedData = {
            title: "Error: An error occured when trying to remove this case.",
            description: "Please try again later.",
            color: "Red",
        }
        return await interaction.reply({ embeds: [ embedBuilder(embedData as any) ], ephemeral: true });
    }

    // form embeds
    const embedData = {
        description: `Removed case \`${latestCase?.[0].id}\``,
        color: client.mainColor as string,
    }

    // send embeds
    await interaction.reply({ embeds: [embedBuilder(embedData as any)] });

}

// for cases remove user
async function executeCasesRemoveUser(interaction: ChatInputCommandInteraction) {
    
    const user = interaction.options.getUser('user');

    // remove the case from the database
    try {
        await db?.delete(cases).where(and(
            eq(cases.user_id, user?.id || "0"),
            eq(cases.guild_id, interaction.guild?.id || "0"),
        )).execute();
    } catch (error) {
        logger.error(error);
        const embedData = {
            title: "Error: An error occured when trying to remove this case.",
            description: "Please try again later.",
            color: "Red",
        }
        return await interaction.reply({ embeds: [ embedBuilder(embedData as any) ], ephemeral: true });
    }  

    // form embeds
    const embedData = {
        description: `Removed all cases for <@${user?.id}>`,
        color: client.mainColor as string,
    }

    // send embeds
    await interaction.reply({ embeds: [embedBuilder(embedData as any)] });

}

// for cases view id
async function executeCasesViewId(interaction: ChatInputCommandInteraction) {
    
    const id = interaction.options.getNumber('id');

    // get the case from the database
    const caseData = await db?.select().from(cases).where(and(
        eq(cases.id, id?.toString() || "0", ),
        eq(cases.guild_id, interaction.guild?.id || "0"),
    )).limit(1).execute()

    if (!caseData[0]) {
        const embedData = {
            title: "Error: Case not found.",
            color: "Red",
        }
        return await interaction.reply({ embeds: [embedBuilder(embedData as any)], ephemeral: true });
    }

    let type = "Unknown";
    if (caseData[0].type === 0) {
        type = "Warn"
    } else if (caseData[0].type === 1) {
        type = "Ban"
    } else if (caseData[0].type === 2) {
        type = "Kick"
    } else if (caseData[0].type === 3) {
        type = "Unban"
    } else {
        type = "Unknown"
    }

    // form embeds
    const embedData: {
        title: string;
        description: string;
        color: string;
        timestamp?: Date;
    } = {
        title: `Case ID: ${caseData[0].id}`,
        description: `User: <@${caseData[0].user_id}>\nModerator: <@${caseData[0].moderator_id}>\nReason: \`${caseData[0].reason}\`\nType: \`${type}\``,
        color: client.mainColor as string,
    }

    if (caseData[0].created_at) {
        // add a timestamp to the embed
        embedData.timestamp = caseData[0].created_at;
    }

    // send embeds
    await interaction.reply({ embeds: [embedBuilder(embedData as any)] });

}

// for cases view latest
async function executeCasesViewLatest(interaction: ChatInputCommandInteraction) {
    
    // get the latest case
    const latestCase = await db?.select().from(cases).where(
        eq(cases.guild_id, interaction.guild?.id || "0"),
    ).orderBy(desc(cases.created_at)).limit(1).execute();

    if (!latestCase) {
        const embedData = {
            title: "No cases found.",
            color: "Red",
        }
        return await interaction.reply({ embeds: [embedBuilder(embedData as any)], ephemeral: true });
    }

    let type = "Unknown";
    if (latestCase[0].type === 0) {
        type = "Warn"
    } else if (latestCase[0].type === 1) {
        type = "Ban"
    } else if (latestCase[0].type === 2) {
        type = "Kick"
    } else if (latestCase[0].type === 3) {
        type = "Unban"
    } else {
        type = "Unknown"
    }

    // form embeds
    const embedData: {
        title: string;
        description: string;
        color: string;
        timestamp?: Date;
    } = {
        title: `Case ID: ${latestCase[0].id}`,
        description: `User: <@${latestCase[0].user_id}>\nModerator: <@${latestCase[0].moderator_id}>\nReason: \`${latestCase[0].reason}\`\nType: \`${type}\``,
        color: client.mainColor as string,
    }

    if (latestCase[0].created_at) {
        // add a timestamp to the embed
        embedData.timestamp = latestCase[0].created_at;
    }

    // send embeds
    await interaction.reply({ embeds: [embedBuilder(embedData as any)] });

}

// for cases view user
async function executeCasesViewUser(interaction: ChatInputCommandInteraction) {
    
    const user = interaction.options.getUser('user');

    // get the case from the database
    const caseData = await db?.select().from(cases).where(and(
        eq(cases.user_id, user?.id || "0"),
        eq(cases.guild_id, interaction.guild?.id || "0"),
    )).execute()
    
    // form embeds
    const embedData: {
        title: string;
        description: string;
        color: string;
        timestamp?: Date;
    } = {
        title: `Cases for ${user?.tag}`,
        description: "",
        color: client.mainColor as string,
    }

    if (caseData && caseData.length > 0) {
        // add a timestamp to the embed
        let count = 0;
        caseData.forEach((c) => {
            if (count == 15) {
                embedData.description += `\n*Only showing the first 15 cases.*`;
                return;
            }

            let type = "Unknown";
            if (c.type === 0) {
                type = "Warn"
            } else if (c.type === 1) {
                type = "Ban"
            } else if (c.type === 2) {
                type = "Kick"
            } else if (c.type === 3) {
                type = "Unban"
            } else {
                type = "Unknown"
            }

            embedData.description += `\nCase ID: \`${c.id}\`\nReason: \`${c.reason}\`\nModerator: <@${c.moderator_id}>\nType: \`${type}\`\n`;
            count++;
        });
    } else {
        embedData.description = "No cases found.";
    }

    // send embeds
    await interaction.reply({ embeds: [embedBuilder(embedData as any)] }); 

}

// export the command
const data = {
    data: command,
    execute: execute,
}

export {
    data
};