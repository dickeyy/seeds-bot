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

    const req = await fetch(`${config.event_api_url}/emoji/create`, {
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
        logger.error("Error sending emoji_create event to events-api")
        return
    }

    // let settings:any = await checkLogTypeEnabled("emoji_create", emoji.guild.id)
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
    //     logger.error("Error creating emoji_create webhook", error)
    // }

    // const embed = {
    //     title: "Emoji Created",
    //     description: `**Emoji Name:** ${emoji.name}\n**Emoji ID:** ${emoji.id}\n**Animated:** ${emoji.animated}\n**Emoji URL:** [Click](${emoji.url})`,
    //     thumbnail: `https://cdn.discordapp.com/emojis/${emoji.id}.webp`,
    //     color: "DarkButNotBlack",
    //     footer: {
    //         text: "Event ID: " + emoji.id + " | emoji_create event",
    //     },
    //     timestamp: new Date(),
    // }

    // try {
    //     await webhookClient.send({
    //         embeds: [embedBuilder(embed as any)],
    //     })
    // } catch (error) {
    //     logger.error("Error sending emoji_create webhook", error)
    // }

    // // close the webhook client
    // webhookClient.destroy()

}

const data = {
    name: Events.GuildEmojiCreate,
    once: false,
    execute,
}

export { 
    data,
}