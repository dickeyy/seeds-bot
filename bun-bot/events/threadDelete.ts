import { AuditLogEvent, Events, WebhookClient, time } from "discord.js";
import { checkLogTypeEnabled } from "../lib/checkLogEnabled";
import embedBuilder from "../lib/embedBuilder";
import { logger } from "../lib/logger";

async function execute(thread:any) {

    // let settings:any = await checkLogTypeEnabled("thread_delete", thread.guild.id)
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
    //     logger.error("Error creating thread_delete webhook", error)
    // }

    // const embed = {
    //     title: "Thread Deleted",
    //     description: `**Thread:** #${thread.name} (${thread.id})`,
    //     thumbnail: `https://cdn.discordapp.com/emojis/1064444110334861373.webp`,
    //     color: "#006154",
    //     footer: {
    //         text: "Event ID: " + thread.id + " | thread_delete event",
    //     },
    //     timestamp: new Date(),
    // }

    // try {
    //     await webhookClient.send({
    //         embeds: [embedBuilder(embed as any)],
    //     })
    // } catch (error) {
    //     logger.error("Error sending thread_delete webhook", error)
    // }

    // // close the webhook client
    // webhookClient.destroy()

}

const data = {
    name: Events.ThreadDelete,
    once: false,
    execute,
}

export { 
    data,
}