import { ChatInputCommandInteraction, DiscordAPIError, PermissionFlagsBits, SlashCommandBuilder, User } from "discord.js";
import embedBuilder from "../../lib/embedBuilder";
import { logger } from "../../lib/logger";
import { client, db } from "../../bot";
import { cases } from "../../schema/case";

// create the command
const command = new SlashCommandBuilder()
    .setName('unban')
    .setDescription('Unban a previously banned user');

command.setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)

command.addUserOption(option => option.setName('user').setDescription('The user you want to unban').setRequired(true));
command.addStringOption(option => option.setName('reason').setDescription('The reason for the unban').setRequired(false));

// write the function
async function execute(interaction: ChatInputCommandInteraction) {

    const user = interaction.options.getUser('user');
    const reason = interaction.options.getString('reason') ?? "No reason provided";

    // make sure the user isnt trying to unban themselves
    if (user == interaction.user) {
        const embedData = {
            description: "Error: You can't unban yourself.",
            color: "Red",
        }
        return await interaction.reply({ embeds: [embedBuilder(embedData as any)], ephemeral: true });
    }

    // make sure the user isnt trying to unban the bot ???
    if (user == interaction.client.user) {
        const embedData = {
            description: "Error: You can't unban me with this command.",
            color: "Red",
        }
        return await interaction.reply({ embeds: [embedBuilder(embedData as any)], ephemeral: true });
    }

    // form the data
    const caseId = Math.floor(Math.random() * 90000000) + 10000000
    const embedData = {
        title: "User Unbanned | Case ID: " + caseId,
        description: `Unbanned <@${user?.id}> with reason \`${reason}\``,
        color: client.mainColor,
        timestamp: new Date()
    }

    const caseData = {
        id: caseId.toString(),
        user_id: user?.id || "0",
        moderator_id: interaction.user.id,
        guild_id: interaction.guild?.id || "0",
        reason: reason as string,
        type: 3,
        created_at: new Date(),
    }

    try {
        // unban the user
        await interaction.guild?.members.unban(user as User, reason)

        // save the case data
        await db?.insert(cases).values(caseData).execute().catch((error: Error) => {
            logger.error("An error occurred when trying to save a case to the database", error);

            embedData.description = `Unbanned <@${user?.id}> with reason \`"${reason}"\`\n\n*An error occurred when trying to save the case to the database, the user has still been unbanned*`
        })

        // send the embed
        const embed = embedBuilder(embedData as any);
        await interaction.reply({ embeds: [embed] });   


    } catch (error:any) {
        // Permission error
        if (error.code == 50013) {
            const embedData = {
                title: "Error: Permission Hierarchy Error.",
                description: `I am not high up enough in the role hierarchy to unban <@${user?.id}>. To fix this, move me to the top of the hierarchy`,
                color: "Red",
            }
            return await interaction.reply({ embeds: [embedBuilder(embedData as any)], ephemeral: true });
        }

        // User not found error
        else if (error.code == 10013) {
            const embedData = {
                title: "Error: User not found.",
                description: `I could not find a user with the ID \`${user?.id}\``,
                color: "Red",
            }
            return await interaction.reply({ embeds: [embedBuilder(embedData as any)], ephemeral: true });
        }

        else if (error.code == 10026) {
            const embedData = {
                title: "Error: User not banned.",
                description: `The user <@${user?.id}> is not banned.`,
                color: "Red",
            }
            return await interaction.reply({ embeds: [embedBuilder(embedData as any)], ephemeral: true });
        }

        else {
            // Unknown error
            logger.error(error);
            const embedData = {
                title: "Error: Unknown Error.",
                description: `An unknown error occured. Please try again later.`,
                color: "Red",
            }
            return await interaction.reply({ embeds: [embedBuilder(embedData as any)], ephemeral: true });
        }
    }

}

// export the command
const data = {
    data: command,
    execute: execute
}

export {
    data
};