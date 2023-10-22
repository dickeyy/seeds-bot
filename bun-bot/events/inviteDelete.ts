import { AuditLogEvent, Events, WebhookClient, time } from "discord.js";
import { checkLogTypeEnabled } from "../lib/checkLogEnabled";
import embedBuilder from "../lib/embedBuilder";
import { logger } from "../lib/logger";

async function execute(invite:any) {

    let settings:any = await checkLogTypeEnabled("invite_delete", invite.guild.id)
    if (!settings) {
        return
    }
    settings = settings.settings

    if (!settings.types.server) {
        return
    }

    let webhookClient:any = undefined
    try {
        webhookClient = new WebhookClient({ url: settings.types.server.webhook_url });
    } catch (error) {
        logger.error("Error creating invite_delete webhook", error)
    }

    const embed = {
        title: "Invite Created",
        description: `**Invite Code:** ${invite.code}\n**Invite URL:** [Click](${invite.url})\n**Invite Channel:** <#${invite.channel.id}> (${invite.channel.id})\n**Invite Creator:** <@${invite.inviter.id}> (${invite.inviter.id})`,
        thumbnail: `https://cdn.discordapp.com/emojis/1065110916401729626.webp`,
        color: "DarkButNotBlack",
        footer: {
            text: "Event ID: " + invite.id + " | invite_delete event",
        },
        timestamp: new Date(),
    }

    try {
        await webhookClient.send({
            embeds: [embedBuilder(embed as any)],
        })
    } catch (error) {
        logger.error("Error sending invite_delete webhook", error)
    }

    // close the webhook client
    webhookClient.destroy()

}

const data = {
    name: Events.InviteDelete,
    once: false,
    execute,
}

export { 
    data,
}