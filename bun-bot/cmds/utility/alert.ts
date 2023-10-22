import { ChatInputCommandInteraction, Guild, SlashCommandBuilder } from "discord.js";
import embedBuilder from "../../lib/embedBuilder";
import { client, redis } from "../../bot";

// create the command
const command = new SlashCommandBuilder()
    .setName('alert')
    .setDescription('Read the latest message from the developers');

// execute the command
async function execute(interaction: ChatInputCommandInteraction) {
    
    // get the alert from redis 
    let alert:any = await redis.hGet("seeds:alerts", "active")

    // if there is no alert, send an error message
    if (!alert) {
        return await interaction.reply({
            embeds: [
                embedBuilder({
                    description: "There are no alerts out right now"
                } as any)
            ],
            ephemeral: true
        })
    }

    alert = JSON.parse(alert)

    // add the user id to the viewers array
    if (!alert.viewers.includes(interaction.user.id)) {
        alert.viewers.push(interaction.user.id)
    }

    // update the alert in redis
    await redis.hSet("seeds:alerts", "active", JSON.stringify(alert))

    // create the embed data
    const embedData = {
        title: "Message from the developers",
        description: "```" + alert?.message + "```",
        color: client.mainColor,
        timestamp: new Date(alert?.created_at),
        footer: {
            text: `👀 by ${alert?.viewers.length.toLocaleString("en-US")} users`
        }
    }

    // build the embed
    const embed = embedBuilder(embedData as any);

    // send the embed
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