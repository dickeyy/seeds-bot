import { AuditLogEvent, Events, WebhookClient, time } from "discord.js";
import { checkLogTypeEnabled } from "../lib/checkLogEnabled";
import embedBuilder from "../lib/embedBuilder";
import { logger } from "../lib/logger";

async function execute(oldEmoji:any, newEmoji:any) {

    let settings:any = await checkLogTypeEnabled("emoji_update", oldEmoji.guild.id)
    if (!settings) {
        return
    }
    settings = settings.settings

    if (!settings.types.server) {
        return
    }

    let webhookClient:any = undefined
    try {
        webhookClient = new WebhookClient({ url: settings.types.server.webhook_url });
    } catch (error) {
        logger.error("Error creating emoji_update webhook", error)
    }

    const embed = {
        title: "Emoji Updated",
        description: "```diff\n",
        thumbnail: `https://cdn.discordapp.com/emojis/${newEmoji.id}.webp`,
        color: "DarkButNotBlack",
        footer: {
            text: "Event ID: " + newEmoji.id + " | emoji_update event",
        },
        timestamp: new Date(),
    }

    if (oldEmoji.name !== newEmoji.name) {
        embed.description += `Name Changed:\n- ${oldEmoji.name}\n+ ${newEmoji.name}\n\`\`\``
    }

    try {
        await webhookClient.send({
            embeds: [embedBuilder(embed as any)],
        })
    } catch (error) {
        logger.error("Error sending emoji_update webhook", error)
    }

    // close the webhook client
    webhookClient.destroy()

}

const data = {
    name: Events.GuildEmojiUpdate,
    once: false,
    execute,
}

export { 
    data,
}