import { ChatInputCommandInteraction, DiscordAPIError, PermissionFlagsBits, SlashCommandBuilder, User } from "discord.js";
import embedBuilder from "../../lib/embedBuilder";
import { logger } from "../../lib/logger";
import { client, db } from "../../bot";
import { cases } from "../../schema/case";
import Case from "../../interfaces/Case";

// create the command
const command = new SlashCommandBuilder()
    .setName('kick')
    .setDescription('Kick a user from the server');

command.setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)

command.addUserOption(option => option.setName('user').setDescription('The user you want to kick').setRequired(true));
command.addStringOption(option => option.setName('reason').setDescription('The reason for the kick').setRequired(false));

// write the function
async function execute(interaction: ChatInputCommandInteraction) {

    const user = interaction.options.getUser('user');
    const reason = interaction.options.getString('reason') ?? "No reason provided";

    // make sure the user isnt trying to kick themselves
    if (user == interaction.user) {
        const embedData = {
            description: "Error: You can't kick yourself.",
            color: "Red",
        }
        return await interaction.reply({ embeds: [embedBuilder(embedData as any)], ephemeral: true });
    }

    // make sure the user isnt trying to kick the bot
    if (user == interaction.client.user) {
        const embedData = {
            description: "Error: You can't kick me with this command.",
            color: "Red",
        }
        return await interaction.reply({ embeds: [embedBuilder(embedData as any)], ephemeral: true });
    }

    // form the data
    const caseId = Math.floor(Math.random() * 90000000) + 10000000
    const embedData = {
        description: `<:warn:1165590684837875782> <@${user?.id}> has been kicked with reason \`${reason}\``,
        footer: {
            text: `Case ID: ${caseId} | User ID: ${user?.id}`,
        },
        color: client.mainColor as string,
        timestamp: new Date(),
    }

    const dmEmbed = {
        title: `🦵 You have been kicked from ${interaction.guild?.name}`,
        description: `**Reason:**\n\`${reason}\``,
        footer: {
            text: `Case ID: ${caseId}`,
        },
        author: {
            name: interaction.guild?.name || "Unknown",
            iconURL: interaction.guild?.iconURL() || undefined,
        },
        color: "Orange",
        timestamp: new Date(),
    }

    // kick the user
    await interaction.guild?.members.kick(user as User, reason).catch(async (error: DiscordAPIError) => {

        // Permission error
        if (error.code == 50013) {
            const embedData = {
                title: "Error: Permission Hierarchy Error.",
                description: `I am not high up enough in the role hierarchy to kick <@${user?.id}>. To fix this, move me to the top of the hierarchy`,
                color: "Red",
            }
            return await interaction.reply({ embeds: [embedBuilder(embedData as any)], ephemeral: true });
        } else {
            const embedData = {
                title: "Error: Unknown Error.",
                description: `An unknown error has occurred. Please report this to the developers.`,
                color: "Red",
            }

            logger.error("An error occurred when trying to kick a user", error);
            return await interaction.reply({ embeds: [embedBuilder(embedData as any)], ephemeral: true });
        }

    })

    // form and save the case data
    const caseData:Case = {
        id: caseId.toString(),
        user_id: user?.id || "0",
        moderator_id: interaction.user.id,
        guild_id: interaction.guild?.id || "0",
        reason: reason as string,
        type: 0,
        created_at: new Date(),
    }

    await db?.insert(cases).values(caseData).execute().catch((error: Error) => {
        logger.error("An error occurred when trying to save a case to the database", error);

        embedData.description = `Kicked <@${user?.id}> with reason \`"${reason}"\`\n\n*An error occurred when trying to save the case to the database, the user has still been kicked*`
    })

    // send the embeds
    const embed = embedBuilder(embedData as any);
    const dm = embedBuilder(dmEmbed as any);

    await interaction.reply({ embeds: [embed] });
    await user?.send({ embeds: [dm] }).catch((error: DiscordAPIError) => {
        if (error.code == 50007) {
            // couldn't send the DM
            embedData.description += "\n\nI was unable to DM the user."

            interaction.editReply({ embeds: [embedBuilder(embedData as any)] });
        } else {
            logger.error("An error occurred when trying to DM a user after a ban", error);
        }
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