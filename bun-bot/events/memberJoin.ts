import { AuditLogEvent, Events, WebhookClient, time } from "discord.js";
import { checkLogTypeEnabled } from "../lib/checkLogEnabled";
import embedBuilder from "../lib/embedBuilder";
import { logger } from "../lib/logger";
import config from "../config";

async function execute(event:any) {

    let data = {
        event,
        guild: event.guild,
        user: event.user,
    }

    const req = await fetch(`${config.event_api_url}/member/join`, {
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
        logger.error("Error sending member_join event to events-api")
        return
    }

    // let settings:any = await checkLogTypeEnabled("member_join", event.guild.id)
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
    //     logger.error("Error creating member_join webhook", error)
    // }

    // const newAccount = Date.now() - event.user.createdTimestamp < 1000 * 60 * 60 * 24 * 7

    // const embed = {
    //     title: "Member Joined",
    //     description: `**Member:** <@${event.user.id}> (${event.user.id}) - Member #${event.guild.memberCount.toLocaleString('en-US')}\n**Account Created:** ${time(event.user.createdAt, "F")} ${newAccount ? "⚠️ New Account ⚠️" : ""}`,
    //     thumbnail: "https://cdn.discordapp.com/emojis/1064442704936828968.webp",
    //     color: "Fuchsia",
    //     author: {
    //         name: event.user.username,
    //         iconURL: event.user.avatarURL(),
    //     },
    //     footer: {
    //         text: "Event ID: " + event.id + " | member_join event",
    //     },
    //     timestamp: new Date(),
    // }

    // try {
    //     await webhookClient.send({
    //         embeds: [embedBuilder(embed as any)],
    //     })
    // } catch (error) {
    //     logger.error("Error sending member_join webhook", error)
    // }

    // // close the webhook client
    // webhookClient.destroy()

}

const data = {
    name: Events.GuildMemberAdd,
    once: false,
    execute,
}

export { 
    data,
}