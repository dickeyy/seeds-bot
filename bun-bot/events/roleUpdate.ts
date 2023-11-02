import { AuditLogEvent, Events, WebhookClient, time } from "discord.js";
import { checkLogTypeEnabled } from "../lib/checkLogEnabled";
import embedBuilder from "../lib/embedBuilder";
import { logger } from "../lib/logger";
import config from "../config";

async function execute(oldRole:any, newRole:any) {

    let data = {
        guild: oldRole.guild,
        oldRole,
        newRole,
        oldPerms: oldRole.permissions,
        newPerms: newRole.permissions
    }

    const req = await fetch(`${config.event_api_url}/role/update`, {
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
        logger.error("Error sending role_update event to events-api")
        return
    }

    // let settings:any = await checkLogTypeEnabled("role_update", newRole.guild.id)
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
    //     logger.error("Error creating role_update webhook", error)
    // }

    // const embed = {
    //     title: "Role Updated",
    //     description: "```diff\n",
    //     thumbnail: `https://cdn.discordapp.com/emojis/1064444287774904400.webp`,
    //     footer: {
    //         text: "Event ID: " + newRole.id + " | role_update event",
    //     },
    //     timestamp: new Date(),
    // }

    // if (oldRole.name !== newRole.name) {
    //     embed.description += `Name Changed\n- ${oldRole.name}\n+ ${newRole.name}\n`
    // } if (oldRole.hexColor !== newRole.hexColor) {
    //     embed.description += `Color Changed\n- ${oldRole.hexColor}\n+ ${newRole.hexColor}\n`
    // } if (oldRole.position !== newRole.position) {
    //     embed.description += `Position Changed\n- ${oldRole.position}\n+ ${newRole.position}\n`
    // } if (oldRole.hoist !== newRole.hoist) {
    //     embed.description += `Hoisted Changed\n- ${oldRole.hoist}\n+ ${newRole.hoist}\n`
    // } if (oldRole.mentionable !== newRole.mentionable) {
    //     embed.description += `Mentionable Changed\n- ${oldRole.mentionable}\n+ ${newRole.mentionable}\n`
    // } if (oldRole.permissions.bitfield !== newRole.permissions.bitfield) {
    //     embed.description += `Permissions Changed\n- ${oldRole.permissions.bitfield}\n+ ${newRole.permissions.bitfield}\n`
    // } 

    // embed.description += "```"

    // try {
    //     await webhookClient.send({
    //         embeds: [embedBuilder(embed as any)],
    //     })
    // } catch (error) {
    //     logger.error("Error sending role_update webhook", error)
    // }

    // // close the webhook client
    // webhookClient.destroy()

}

const data = {
    name: Events.GuildRoleUpdate,
    once: false,
    execute,
}

export { 
    data,
}