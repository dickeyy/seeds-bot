import { AuditLogEvent, Events, WebhookClient, time } from "discord.js";
import { checkLogTypeEnabled } from "../lib/checkLogEnabled";
import embedBuilder from "../lib/embedBuilder";
import { logger } from "../lib/logger";
import config from "../config";

async function execute(emoji:any) {

    let data = {
        emoji,
        guild: emoji.guild,
    }

    const req = await fetch(`${config.event_api_url}/emoji/delete`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${config.event_api_token}`
        },
        body: JSON.stringify({
            data
        }),
    })

    if (!req.ok) {
        logger.error("Error sending emoji_delete event to events-api")
        return
    }

    // let settings:any = await checkLogTypeEnabled("emoji_delete", emoji.guild.id)
    // if (!settings) {
    //     return
    // }
    // settings = settings.settings

    // if (!settings.types.server) {
    //     return
    // }

    // let webhookClient:any = undefined
    // try {
    //     webhookClient = new WebhookClient({ url: settings.types.server.webhook_url });
    // } catch (error) {
    //     logger.error("Error creating emoji_delete webhook", error)
    // }

    // const embed = {
    //     title: "Emoji Deleted",
    //     description: `**Emoji Name:** ${emoji.name}\n**Emoji ID:** ${emoji.id}\n**Animated:** ${emoji.animated}\n**Emoji URL:** [Click](${emoji.url})`,
    //     thumbnail: `https://cdn.discordapp.com/emojis/1065110914128416818.webp`,
    //     color: "DarkButNotBlack",
    //     footer: {
    //         text: "Event ID: " + emoji.id + " | emoji_delete event",
    //     },
    //     timestamp: new Date(),
    // }

    // try {
    //     await webhookClient.send({
    //         embeds: [embedBuilder(embed as any)],
    //     })
    // } catch (error) {
    //     logger.error("Error sending emoji_delete webhook", error)
    // }

    // // close the webhook client
    // webhookClient.destroy()

}

const data = {
    name: Events.GuildEmojiDelete,
    once: false,
    execute,
}

export { 
    data,
}