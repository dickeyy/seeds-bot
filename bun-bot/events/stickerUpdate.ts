import { AuditLogEvent, Events, WebhookClient, time } from "discord.js";
import { checkLogTypeEnabled } from "../lib/checkLogEnabled";
import embedBuilder from "../lib/embedBuilder";
import { logger } from "../lib/logger";

async function execute(oldSticker:any, newSticker:any) {

    // let settings:any = await checkLogTypeEnabled("sticker_update", newSticker.guild.id)
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
    //     logger.error("Error creating sticker_update webhook", error)
    // }

    // const embed = {
    //     title: "Sticker Updated",
    //     description: "```diff\n",
    //     thumbnail: `https://cdn.discordapp.com/emojis/1064444283790307349.webp`,
    //     footer: {
    //         text: "Event ID: " + newSticker.id + " | sticker_update event",
    //     },
    //     timestamp: new Date(),
    // }

    // if (oldSticker.name !== newSticker.name) {
    //     embed.description += `Name Changed\n- ${oldSticker.name}\n+ ${newSticker.name}\n`
    // } if (oldSticker.description !== newSticker.description) {
    //     embed.description += `Description Changed\n- ${oldSticker.description}\n+ ${newSticker.description}\n`
    // } if (oldSticker.tags !== newSticker.tags) {
    //     embed.description += `Tags Changed\n- ${oldSticker.tags}\n+ ${newSticker.tags}\n`
    // } if (oldSticker.format !== newSticker.format) {
    //     embed.description += `Format Changed\n- ${oldSticker.format}\n+ ${newSticker.format}\n`
    // }

    // embed.description += "```"

    // try {
    //     await webhookClient.send({
    //         embeds: [embedBuilder(embed as any)],
    //     })
    // } catch (error) {
    //     logger.error("Error sending sticker_update webhook", error)
    // }

    // // close the webhook client
    // webhookClient.destroy()

}

const data = {
    name: Events.GuildStickerUpdate,
    once: false,
    execute,
}

export { 
    data,
}