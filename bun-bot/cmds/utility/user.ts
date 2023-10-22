import { ChatInputCommandInteraction, SlashCommandBuilder, time } from "discord.js";
import embedBuilder from "../../lib/embedBuilder";

// create the command
const command = new SlashCommandBuilder()
    .setName('user')
    .setDescription('Get some info about a user.');

command.addUserOption(option => option.setName('user').setDescription('The user to get info about.').setRequired(false));
    
// write the function
async function execute(interaction: ChatInputCommandInteraction) {

    const user = interaction.options.getUser('user') || interaction.user;

    let badges = "";
    user.flags?.toArray().forEach(flag => {
       if (flag === "ActiveDeveloper") badges += "<:activedev:1165580988676575232> "
       if (flag === "BugHunterLevel2") badges += "<:bughunter2:1165580992120107040> "
       if (flag === "HypeSquadOnlineHouse2") badges += "<:hypehouse2:1165582552128552990> "
       if (flag === "CertifiedModerator") badges += "<:certifiedmod:1165580993458090085> "
       if (flag === "HypeSquadOnlineHouse3") badges += "<:hypehouse3:1165582554557059082> "
       if (flag === "Partner") badges += "<:partner:1165580996700291102> "
       if (flag === "Staff") badges += "<:staff:1165580999871176814> "
       if (flag === "VerifiedDeveloper") badges += "<:verifieddev:1165581001267875860> "
       if (flag === "BugHunterLevel1") badges += "<:bughunter1:1165580990291378216>  "
       if (flag === "HypeSquadOnlineHouse1") badges += "<:hypehouse1:1165580995228078130> "
       if (flag === "PremiumEarlySupporter") badges += "<:premiumearlysupporter:1165580998491254795> "
    })

    const roles = interaction.guild?.members.cache.get(user.id)?.roles.cache.filter(role => role.id !== interaction.guild?.id).map(role => `<@&${role.id}>`).join(", ") || "None";
    // remove the @everyone role from the list
    roles.replace(`<@${interaction.guild?.id}>`, "");

    const embedData = {
        title: "User Information",
        thumbnail: user.avatarURL() || "https://beebom.com/wp-content/uploads/2022/03/discord-cover-banner.jpg?w=1920",
        color: user.hexAccentColor || null,
        author: {
            name: user.tag,
            iconURL: user.avatarURL() || "https://beebom.com/wp-content/uploads/2022/03/discord-cover-banner.jpg?w=1920",
        },
        fields: [
            {
                name: "Badges",
                value: badges || "None",
            }, 
            {
                name: "Account Created",
                value: `${time(user.createdAt, "F")}\n(${time(user.createdAt, "R")})`,
            },
            {
                name: "Joined Server",
                value: `${time(interaction.guild?.members.cache.get(user.id)?.joinedAt || new Date(), "F") || "Unknown"}\n(${time(interaction?.guild?.members?.cache?.get(user.id)?.joinedAt || new Date(), "R") || "Unknown"})`,
            },
            {
                name: "Roles",
                value: roles,
            }
        ],
        footer: {
            text: `ID: ${user.id}`,
        },
        timestamp: new Date(),
    }

    const embed = embedBuilder(embedData as any);

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