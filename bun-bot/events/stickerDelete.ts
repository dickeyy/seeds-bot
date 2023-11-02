import { AuditLogEvent, Events, WebhookClient, time } from "discord.js";
import { checkLogTypeEnabled } from "../lib/checkLogEnabled";
import embedBuilder from "../lib/embedBuilder";
import { logger } from "../lib/logger";

async function execute(sticker:any) {

    // let settings:any = await checkLogTypeEnabled("sticker_delete", sticker.guild.id)
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
    //     logger.error("Error creating sticker_delete webhook", error)
    // }

    // const embed = {
    //     title: "Sticker Deleted",
    //     description: `**Sticker Name:** ${sticker.name}\n**Sticker ID:** ${sticker.id}\n**Sticker URL:** [Click](${sticker.url})`,
    //     thumbnail: `https://cdn.discordapp.com/emojis/1064444214819164191.webp`,
    //     footer: {
    //         text: "Event ID: " + sticker.id + " | sticker_delete event",
    //     },
    //     timestamp: new Date(),
    // }

    // try {
    //     await webhookClient.send({
    //         embeds: [embedBuilder(embed as any)],
    //     })
    // } catch (error) {
    //     logger.error("Error sending sticker_delete webhook", error)
    // }

    // // close the webhook client
    // webhookClient.destroy()

}

const data = {
    name: Events.GuildStickerDelete,
    once: false,
    execute,
}

export { 
    data,
}