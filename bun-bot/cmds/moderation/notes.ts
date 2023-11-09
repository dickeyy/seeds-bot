import { ChatInputCommandInteraction, DiscordAPIError, PermissionFlagsBits, SlashCommandBuilder, User } from "discord.js";
import embedBuilder from "../../lib/embedBuilder";
import { logger } from "../../lib/logger";
import { client, db } from "../../bot";
import { notes } from "../../schema/note";
import Note from "../../interfaces/Note";
import crypto from "crypto";
import { and, desc, eq, ne } from "drizzle-orm";

// create the command
const command = new SlashCommandBuilder()
    .setName('notes')
    .setDescription('Work with the notes system.');

command.setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)

// add the subcommands
command.addSubcommand(
    subcommand => subcommand
    .setName('add')
    .setDescription('Add a note to a user')
    .addUserOption(option => option.setName('user').setDescription('The user you want to add a note to').setRequired(true))
    .addStringOption(option => option.setName('content').setDescription('The content of the note').setRequired(true))
);
command.addSubcommandGroup(
    group => group
    .setName('remove')
    .setDescription('Remove a note from a user')
    .addSubcommand(
        subcommand => subcommand
        .setName('id')
        .setDescription('Remove a note by ID')
        .addStringOption(option => option.setName('id').setDescription('The ID of the note you want to remove').setRequired(true))
    )

    .addSubcommand(
        subcommand => subcommand
        .setName('latest')
        .setDescription('Remove the latest note in your server')
    )

    .addSubcommand(
        subcommand => subcommand
        .setName('user')
        .setDescription('Remove all notes for a user')
        .addUserOption(option => option.setName('user').setDescription('The user you want to remove all notes for').setRequired(true))
    )
);
command.addSubcommandGroup(
    group => group
    .setName("view")
    .setDescription("Work with viewing notes")
    .addSubcommand(
        subcommand => subcommand
        .setName('id')
        .setDescription('View a note by ID')
        .addStringOption(option => option.setName('id').setDescription('The ID of the note you want to view').setRequired(true))
    )
    .addSubcommand(
        subcommand => subcommand
        .setName('latest')
        .setDescription('View the latest note in your server')
    )
    .addSubcommand(
        subcommand => subcommand
        .setName('user')
        .setDescription('View all notes for a user')
        .addUserOption(option => option.setName('user').setDescription('The user you want to view all notes for').setRequired(true))
    )
)

// write the functions for each subcommand
async function execute(interaction: ChatInputCommandInteraction) {
    const subcommand = interaction.options.getSubcommand();
    const subcommandGroup = interaction.options.getSubcommandGroup();

    if (subcommand === "add") {
        await executeNoteAdd(interaction);
    } else if (subcommandGroup === "remove") {
        if (subcommand === "id") {
            await executeNoteRemoveId(interaction);
        } else if (subcommand === "latest") {
            await executeNoteRemoveLatest(interaction);
        } else if (subcommand === "user") {
            await executeNoteRemoveUser(interaction);
        }
    } else if (subcommandGroup === "view") {
        if (subcommand === "id") {
            await executeNoteViewId(interaction);
        } else if (subcommand === "latest") {
            await executeNoteViewLatest(interaction);
        } else if (subcommand === "user") {
            await executeNoteViewUser(interaction);
        }
    } else {
        const embedData = {
            description: "Error: Subcommand not found.",
            color: "Red",
        }
        return await interaction.reply({ embeds: [embedBuilder(embedData as any)], ephemeral: true });
    }
}

// notes add
async function executeNoteAdd(interaction: ChatInputCommandInteraction) {
    
    const user = interaction.options.getUser('user');
    const content = interaction.options.getString('content');

    // form the note object
    const noteId = crypto.randomBytes(16).toString("hex");
    const note: Note = {
        id: noteId,
        user_id: user?.id as string,
        moderator_id: interaction.user.id as string,
        guild_id: interaction.guildId as string,
        content: content as string,
        created_at: new Date(),
    }

    // add the note to the database
    try {
        await db.insert(notes).values(note).execute();
    } catch (error) {
        logger.error(error);
        const embedData = {
            description: "Error: Failed to add note.",
            color: "Red",
        }
        return await interaction.reply({ embeds: [embedBuilder(embedData as any)], ephemeral: true });
    }

    // send a success message
    const embedData = {
        description: "<:PepoG:1172051306026905620> **Note taken for** <@" + user?.id + "> \n\n```" + content + "```",
        color: "DarkButNotBlack",
        footer: {
            text: "Note ID: " + noteId,
        },
        timestamp: new Date(),
    }

    return await interaction.reply({ embeds: [embedBuilder(embedData as any)], ephemeral: false });

}

// notes remove by id
async function executeNoteRemoveId(interaction: ChatInputCommandInteraction) {
    
    const id = interaction.options.getString('id');

    // delete the note
    try {
        await db?.delete(notes).where(and(
            eq(notes.id, id || "0"),
            eq(notes.guild_id, interaction.guild?.id || "0"),
        )).execute();
    } catch (error) {
        logger.error(error);
        const embedData = {
            description: "Error: Failed to remove note.",
            color: "Red",
        }
        return await interaction.reply({ embeds: [embedBuilder(embedData as any)], ephemeral: true });
    }

    // send a success message
    const embedData = {
        description: "<:PepoG:1172051306026905620> **Note removed.**\n\nNote ID: `" + id + "`",
        color: "DarkButNotBlack",
        timestamp: new Date(),
    }

    return await interaction.reply({ embeds: [embedBuilder(embedData as any)], ephemeral: false });

}

// notes remove latest
async function executeNoteRemoveLatest(interaction: ChatInputCommandInteraction) {
    
    // get the latest note
    const latestNote = await db?.select().from(notes).where(
        eq(notes.guild_id, interaction.guild?.id || "0"),
    ).orderBy(desc(notes.created_at)).limit(1).execute();

    // delete the note
    try {
        await db?.delete(notes).where(and(
            eq(notes.id, latestNote?.[0].id || "0"),
            eq(notes.guild_id, interaction.guild?.id || "0"),
        )).execute();
    } catch (error) {
        logger.error(error);
        const embedData = {
            description: "Error: Failed to remove note.",
            color: "Red",
        }
        return await interaction.reply({ embeds: [embedBuilder(embedData as any)], ephemeral: true });
    }

    // send a success message
    const embedData = {
        description: "<:PepoG:1172051306026905620> **Note removed.**\n\nNote ID: `" + latestNote?.[0].id + "`",
        color: "DarkButNotBlack",
        timestamp: new Date(),
    }

    return await interaction.reply({ embeds: [embedBuilder(embedData as any)], ephemeral: false });

}

// notes remove user
async function executeNoteRemoveUser(interaction: ChatInputCommandInteraction) {
    
    const user = interaction.options.getUser('user');

    // delete the notes
    try {
        await db?.delete(notes).where(and(
            eq(notes.user_id, user?.id || "0"),
            eq(notes.guild_id, interaction.guild?.id || "0"),
        )).execute();
    } catch (error) {
        logger.error(error);
        const embedData = {
            description: "Error: Failed to remove note.",
            color: "Red",
        }
        return await interaction.reply({ embeds: [embedBuilder(embedData as any)], ephemeral: true });
    }

    // send a success message
    const embedData = {
        description: "<:PepoG:1172051306026905620> **Notes removed for** <@" + user?.id + ">",
        color: "DarkButNotBlack",
        timestamp: new Date(),
    }

    return await interaction.reply({ embeds: [embedBuilder(embedData as any)], ephemeral: false });

}

// notes view by id
async function executeNoteViewId(interaction: ChatInputCommandInteraction) {
    
    const id = interaction.options.getString('id');

    // get the note
    const note = await db?.select().from(notes).where(and(
        eq(notes.id, id || "0"),
        eq(notes.guild_id, interaction.guild?.id || "0"),
    )).execute();

    if (!note[0]) {
        const embedData = {
            description: "Error: Note not found.",
            color: "Red",
        }
        return await interaction.reply({ embeds: [embedBuilder(embedData as any)], ephemeral: true });
    }

    // send a success message
    const embedData = {
        description: "<:PepoG:1172051306026905620> **Note for** <@" + note?.[0].user_id + "> \n\nWritten by: <@" + note?.[0].moderator_id + ">\n```" + note?.[0].content + "```",
        color: "DarkButNotBlack",
        footer: {
            text: "Note ID: " + id,
        },
        timestamp: note?.[0].created_at,
    }

    return await interaction.reply({ embeds: [embedBuilder(embedData as any)], ephemeral: false });

}

// notes view latest
async function executeNoteViewLatest(interaction: ChatInputCommandInteraction) {
    
    // get the latest note
    const note = await db?.select().from(notes).where(
        eq(notes.guild_id, interaction.guild?.id || "0"),
    ).orderBy(desc(notes.created_at)).limit(1).execute();

    if (!note[0]) {
        const embedData = {
            description: "Error: Note not found.",
            color: "Red",
        }
        return await interaction.reply({ embeds: [embedBuilder(embedData as any)], ephemeral: true });
    }

    // send a success message
    const embedData = {
        description: "<:PepoG:1172051306026905620> **Note for** <@" + note?.[0].user_id + "> \n\nWritten by: <@" + note?.[0].moderator_id + ">\n```" + note?.[0].content + "```",
        color: "DarkButNotBlack",
        footer: {
            text: "Note ID: " + note?.[0].id,
        },
        timestamp: note?.[0].created_at,
    }

    return await interaction.reply({ embeds: [embedBuilder(embedData as any)], ephemeral: false });

}

// notes view user
async function executeNoteViewUser(interaction: ChatInputCommandInteraction) {
    
    const user = interaction.options.getUser('user');

    // get the notes
    const notesData = await db?.select().from(notes).where(and(
        eq(notes.user_id, user?.id || "0"),
        eq(notes.guild_id, interaction.guild?.id || "0"),
    )).execute();

    if (!notesData[0]) {
        const embedData = {
            description: "Error: Notes not found.",
            color: "Red",
        }
        return await interaction.reply({ embeds: [embedBuilder(embedData as any)], ephemeral: true });
    }

    // send a success message
    let notesString = "";
    let count = 0;
    for (const note of notesData) {
        if (count >= 30) {
            notesString += "Only showing first 30 notes. There are " + (notesData.length - 30) + " more...";
            break;
        }
        notesString += "Note ID: `" + note.id + "`\nWritten by: <@" + note.moderator_id + ">\n```" + note.content + "```\n\n";
        count++;
    }

    const embedData = {
        description: "<:PepoG:1172051306026905620> **" + notesData.length + " Notes for** <@" + user?.id + ">\n\n" + notesString,
        color: "DarkButNotBlack",
        timestamp: new Date(),
    }

    // make sure the embed.description is not over 4050 characters
    if (embedData.description.length > 4050) {
        embedData.description = embedData.description.slice(0, 4050);
        embedData.description += "\n\nThere are too many notes to display all of them."
    }

    return await interaction.reply({ embeds: [embedBuilder(embedData as any)], ephemeral: false });

}

// export the command
const data = {
    data: command,
    execute: execute,
}

export {
    data
};