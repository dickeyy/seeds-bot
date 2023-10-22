import { ChatInputCommandInteraction, DiscordAPIError, PermissionFlagsBits, SlashCommandBuilder, User } from "discord.js";
import embedBuilder from "../../lib/embedBuilder";
import { logger } from "../../lib/logger";
import { client, db } from "../../bot";
import { cases } from "../../schema/case";
import Case from "../../interfaces/Case";

// create the command
const command = new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Ban a user from the server');

command.setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)

command.addUserOption(option => option.setName('user').setDescription('The user you want to ban').setRequired(true));
command.addStringOption(option => option.setName('reason').setDescription('The reason for the ban').setRequired(false));
command.addNumberOption(option => option.setName('delete_hours').setDescription('The number of hours of messages to delete, sent by the the banned user').setRequired(false));

// write the function
async function execute(interaction: ChatInputCommandInteraction) {

    // get the options
    const banUser: User | null = interaction.options.getUser('user');
    const reason = interaction.options.getString('reason');
    const deleteHours = interaction.options.getNumber('delete_hours');

    let banReason = reason;
    let banHours = deleteHours;

    // handle optional arguments
    if (!deleteHours) {
        banHours = 1;
    }

    if (!reason) {
        banReason = "No reason provided";
    }

    if (!banUser) {
        const embedData = {
            title: "Error: User not found.",
            color: "Red",
        }
        return await interaction.reply({ embeds: [embedBuilder(embedData as any)], ephemeral: true });
    }

    // make sure the user isnt trying to ban themselves
    if (banUser?.id === interaction.user.id) {
        const embedData = {
            title: "Error: You can't ban yourself.",
            color: "Red",
        }
        return await interaction.reply({ embeds: [embedBuilder(embedData as any)], ephemeral: true });
    }

    // make sure the user isnt trying to ban the bot
    if (banUser?.id === interaction.client.user?.id) {
        const embedData = {
            title: "Error: You can't ban me with this command.",
            description: "If you want to ban me, you will have to do it manually.",
            color: "Red",
        }
        return await interaction.reply({ embeds: [embedBuilder(embedData as any)], ephemeral: true });
    }

    // ban the user
    try {
        await interaction.guild?.members.ban(banUser, 
            { 
                reason: banReason as string, 
                deleteMessageSeconds: ((banHours as any) * 3600) 
            }
        );
        
        // form our data
        const caseId = Math.floor(Math.random() * 90000000) + 10000000
        const embedData = {
            description: `<:ban:1165590688554033183> <@${banUser?.id}> has been banned with reason \`${reason}\``,
            footer: {
                text: `Case ID: ${caseId} | User ID: ${banUser?.id}`,
            },
            color: client.mainColor as string,
            timestamp: new Date(),
        }

        const dmEmbedData = {
            title: `🚨 You have been banned from ${interaction.guild?.name}`,
            description: `**Reason:**\n\`${reason}\``,
            footer: {
                text: `Case ID: ${caseId}`,
            },
            author: {
                name: interaction.guild?.name || "Unknown",
                iconURL: interaction.guild?.iconURL() || undefined,
            },
            color: "Red",
            timestamp: new Date(),
        }

        const caseData:Case = {
            id: caseId.toString(),
            user_id: banUser.id,
            moderator_id: interaction.user.id,
            guild_id: interaction.guild?.id || "0",
            reason: banReason as string,
            type: 1,
            created_at: new Date(),
        }

        // enter the case into the database`
        const enterCase = await db?.insert(cases).values(caseData).execute();
        if (!enterCase) {
            logger.error("An error occurred when trying to enter a case into the database", {
                caseData: caseData,
            });
        }

        // send the embeds
        await interaction.reply({ embeds: [embedBuilder(embedData as any)] });
        await banUser.send({ embeds: [embedBuilder(dmEmbedData as any)] }).catch((error: DiscordAPIError) => {
            if (error.code == 50007) {
                // couldn't send the DM
                embedData.description += "\n\n<:warn:1165590684837875782> I was unable to DM the user.";

                interaction.editReply({ embeds: [embedBuilder(embedData as any)] });
            } else {
                logger.error("An error occurred when trying to DM a user after a ban", error);
            }
        })

    } catch (error:any) {

        // Permission error
        if (error.code == 50013) {
            const embedData = {
                title: "Error: Permission Hierarchy Error.",
                description: `I am not high up enough in the role hierarchy to ban <@${banUser.id}>. To fix this, move me to the top of the hierarchy`,
                color: "Red",
            }
            return await interaction.reply({ embeds: [embedBuilder(embedData as any)], ephemeral: true });
        } else {
            const embedData = {
                title: "Error: Unknown Error.",
                description: `An unknown error has occurred. Please report this to the developers.`,
                color: "Red",
            }

            logger.error("An error occurred when trying to ban a user", error);
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