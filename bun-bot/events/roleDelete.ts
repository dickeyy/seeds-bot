import { AuditLogEvent, Events, WebhookClient, time } from "discord.js";
import { checkLogTypeEnabled } from "../lib/checkLogEnabled";
import embedBuilder from "../lib/embedBuilder";
import { logger } from "../lib/logger";
import config from "../config";

async function execute(role:any) {

    let data = {
        guild: role.guild,
        role,
    }

    const req = await fetch(`${config.event_api_url}/role/delete`, {
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
        logger.error("Error sending role_delete event to events-api")
        return
    }

    // let settings:any = await checkLogTypeEnabled("role_delete", role.guild.id)
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
    //     logger.error("Error creating role_delete webhook", error)
    // }

    // const embed = {
    //     title: "Role Deleted",
    //     description: `**Role Name:** ${role.name}\n**Role ID:** ${role.id}`,
    //     thumbnail: `https://cdn.discordapp.com/emojis/1064442708069990411.webp`,
    //     color: "#FA8A87",
    //     footer: {
    //         text: "Event ID: " + role.id + " | role_delete event",
    //     },
    //     timestamp: new Date(),
    // }

    // try {
    //     await webhookClient.send({
    //         embeds: [embedBuilder(embed as any)],
    //     })
    // } catch (error) {
    //     logger.error("Error sending role_delete webhook", error)
    // }

    // // close the webhook client
    // webhookClient.destroy()

}

const data = {
    name: Events.GuildRoleDelete,
    once: false,
    execute,
}

export { 
    data,
}