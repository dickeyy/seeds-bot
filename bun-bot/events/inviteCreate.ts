import { AuditLogEvent, Events, WebhookClient, time } from "discord.js";
import { checkLogTypeEnabled } from "../lib/checkLogEnabled";
import embedBuilder from "../lib/embedBuilder";
import { logger } from "../lib/logger";
import config from "../config";

async function execute(invite:any) {

    let data = {
        invite,
        guild: invite.guild,
        inviter: invite.inviter,
        channel: invite.channel,
    }

    const req = await fetch(`${config.event_api_url}/invite/create`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            data
        }),
    })

    if (!req.ok) {
        logger.error("Error sending invite_create event to events-api")
        return
    }

    // let settings:any = await checkLogTypeEnabled("invite_create", invite.guild.id)
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
    //     logger.error("Error creating invite_create webhook", error)
    // }

    // const embed = {
    //     title: "Invite Created",
    //     description: `**Invite Code:** ${invite.code}\n**Invite URL:** [Click](${invite.url})\n**Invite Channel:** <#${invite.channel.id}> (${invite.channel.id})\n**Invite Creator:** <@${invite.inviter.id}> (${invite.inviter.id})`,
    //     thumbnail: `https://cdn.discordapp.com/emojis/1065111574471254118.webp`,
    //     color: "DarkButNotBlack",
    //     footer: {
    //         text: "Event ID: " + invite.id + " | invite_create event",
    //     },
    //     timestamp: new Date(),
    // }

    // try {
    //     await webhookClient.send({
    //         embeds: [embedBuilder(embed as any)],
    //     })
    // } catch (error) {
    //     logger.error("Error sending invite_create webhook", error)
    // }

    // // close the webhook client
    // webhookClient.destroy()

}

const data = {
    name: Events.InviteCreate,
    once: false,
    execute,
}

export { 
    data,
}