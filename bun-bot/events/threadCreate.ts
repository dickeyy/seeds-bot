import { AuditLogEvent, Events, WebhookClient, time } from "discord.js";
import { checkLogTypeEnabled } from "../lib/checkLogEnabled";
import embedBuilder from "../lib/embedBuilder";
import { logger } from "../lib/logger";

async function execute(thread:any) {

    // let settings:any = await checkLogTypeEnabled("thread_create", thread.guild.id)
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
    //     logger.error("Error creating thread_create webhook", error)
    // }

    // const embed = {
    //     title: "Thread Created",
    //     description: `**Thread:** <#${thread.id}> (${thread.id})`,
    //     thumbnail: `https://cdn.discordapp.com/emojis/1065110721752477768.webp`,
    //     color: "#00BBA1",
    //     footer: {
    //         text: "Event ID: " + thread.id + " | thread_create event",
    //     },
    //     timestamp: new Date(),
    // }

    // try {
    //     await webhookClient.send({
    //         embeds: [embedBuilder(embed as any)],
    //     })
    // } catch (error) {
    //     logger.error("Error sending thread_create webhook", error)
    // }

    // // close the webhook client
    // webhookClient.destroy()

}

const data = {
    name: Events.ThreadCreate,
    once: false,
    execute,
}

export { 
    data,
}