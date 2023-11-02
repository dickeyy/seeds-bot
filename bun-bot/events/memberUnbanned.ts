import { AuditLogEvent, Events, WebhookClient } from "discord.js";
import { checkLogTypeEnabled } from "../lib/checkLogEnabled";
import embedBuilder from "../lib/embedBuilder";
import { logger } from "../lib/logger";
import config from "../config";

async function execute(event:any) {

    // try to get the audit log entry for this event
    let auditLogEntry:any = undefined
    try {
        auditLogEntry = await event.guild.fetchAuditLogs({
            type: AuditLogEvent.MemberBanAdd,
            limit: 1,
        })
    } catch (error) {
        logger.error("Error fetching audit log entry for member_unbanned event", error)
    }

    let banReason = "No reason provided"
    let modID = event.client.user.id
    if (auditLogEntry) {
        const { executor, reason } = auditLogEntry.entries.first()
        banReason = reason
        modID = executor.id
    }

    let data = {
        event,
        guild: event.guild,
        user: event.user,
        reason: banReason,
        moderator: modID,
    }

    const req = await fetch(`${config.event_api_url}/member/unban`, {
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
        logger.error("Error sending member_unbanned event to events-api")
        return
    }

    // let settings:any = await checkLogTypeEnabled("member_unbanned", event.guild.id)
    // if (!settings) {
    //     return
    // }
    // settings = settings.settings

    // if (!settings.types.members) {
    //     return
    // }

    // let webhookClient:any = undefined
    // try {
    //     webhookClient = new WebhookClient({ url: settings.types.members.webhook_url });
    // } catch (error) {
    //     logger.error("Error creating member_unbanned webhook", error)
    // }

    // // try to get the audit log entry for this event
    // let auditLogEntry:any = undefined
    // try {
    //     auditLogEntry = await event.guild.fetchAuditLogs({
    //         type: AuditLogEvent.MemberBanAdd,
    //         limit: 1,
    //     })
    // } catch (error) {
    //     logger.error("Error fetching audit log entry for member_banned event", error)
    // }

    // let banReason = "No reason provided"
    // let modID = event.client.user.id
    // if (auditLogEntry) {
    //     const { executor, reason } = auditLogEntry.entries.first()
    //     banReason = reason
    //     modID = executor.id
    // }

    // const embed = {
    //     title: "Member Unbanned",
    //     description: `**Member:** <@${event.user.id}> (${event.user.id})\n**Reason:** \`${banReason}\`\nModerator: <@${modID}> (${modID})`,
    //     thumbnail: "https://cdn.discordapp.com/emojis/1064442704936828968.webp",
    //     color: "DarkButNotBlack",
    //     author: {
    //         name: event.user.username,
    //         iconURL: event.user.avatarURL(),
    //     },
    //     footer: {
    //         text: "Event ID: " + event.id + " | member_unbanned event",
    //     },
    //     timestamp: new Date(),
    // }

    // try {
    //     await webhookClient.send({
    //         embeds: [embedBuilder(embed as any)],
    //     })
    // } catch (error) {
    //     logger.error("Error sending member_unbanned webhook", error)
    // }

    // // close the webhook client
    // webhookClient.destroy()

}

const data = {
    name: Events.GuildBanRemove,
    once: false,
    execute,
}

export { 
    data,
}