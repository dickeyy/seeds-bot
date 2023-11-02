import { AuditLogEvent, Events, WebhookClient, time } from "discord.js";
import { checkLogTypeEnabled } from "../lib/checkLogEnabled";
import embedBuilder from "../lib/embedBuilder";
import { logger } from "../lib/logger";

async function execute(oldThread:any, newThread:any) {

    // let settings:any = await checkLogTypeEnabled("thread_update", oldThread.guild.id)
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
    //     logger.error("Error creating thread_update webhook", error)
    // }

    // const embed = {
    //     title: "Thread Updated",
    //     description: "```diff\n",
    //     thumbnail: `https://cdn.discordapp.com/emojis/1065110917962022922.webp`,
    //     color: "#4CA99D",
    //     footer: {
    //         text: "Event ID: " + oldThread.id + " | thread_update event",
    //     },
    //     timestamp: new Date(),
    // }

    // if (oldThread.name !== newThread.name) {
    //     embed.description += `Name Changed\n- ${oldThread.name}\n+ ${newThread.name}\n`
    // } if (oldThread.archived !== newThread.archived) {
    //     embed.description += `Archived Changed\n- ${oldThread.archived}\n+ ${newThread.archived}\n`
    // } if (oldThread.locked !== newThread.locked) {
    //     embed.description += `Locked Changed\n- ${oldThread.locked}\n+ ${newThread.locked}\n`
    // } if (oldThread.rateLimitPerUser !== newThread.rateLimitPerUser) {
    //     embed.description += `Rate Limit Changed\n- ${oldThread.rateLimitPerUser}\n+ ${newThread.rateLimitPerUser}\n`
    // } if (oldThread.autoArchiveDuration !== newThread.autoArchiveDuration) {
    //     embed.description += `Auto Archive Duration Changed\n- ${oldThread.autoArchiveDuration}\n+ ${newThread.autoArchiveDuration}\n`
    // } if (oldThread.type !== newThread.type) {
    //     embed.description += `Type Changed\n- ${oldThread.type}\n+ ${newThread.type}\n`
    // }
     
    // embed.description += "```"

    // try {
    //     await webhookClient.send({
    //         embeds: [embedBuilder(embed as any)],
    //     })
    // } catch (error) {
    //     logger.error("Error sending thread_update webhook", error)
    // }

    // // close the webhook client
    // webhookClient.destroy()

}

const data = {
    name: Events.ThreadUpdate,
    once: false,
    execute,
}

export { 
    data,
}