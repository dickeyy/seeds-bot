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
        roles: event.roles.cache.map((role:any) => { return role.id } ),
    }

    const req = await fetch(`${config.event_api_url}/member/leave`, {
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
        logger.error("Error sending member_leave event to events-api")
        return
    }

    // let settings:any = await checkLogTypeEnabled("member_leave", event.guild.id)
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
    //     logger.error("Error creating member_leave webhook", error)
    // }

    // // get the users roles
    // const roles = event.roles.cache.map((role:any) => {
    //     return `<@&${role.id}>`
    // }).join(", ")
    // // remove the @everyone role
    // .replace(`<@&${event.guild.id}>`, "")

    // const embed = {
    //     title: "Member Left",
    //     description: `**Member:** <@${event.user.id}> (${event.user.id}) \n**Joined:** ${time(event.user.joinedAt, "F")} - ${time(event.user.joinedAt, "R")}\n**Roles:** ${roles ? roles : "None"}`,
    //     thumbnail: "https://cdn.discordapp.com/emojis/1064442673806704672.webp",
    //     color: "Blurple",
    //     author: {
    //         name: event.user.username,
    //         iconURL: event.user.avatarURL(),
    //     },
    //     footer: {
    //         text: "Event ID: " + event.id + " | member_leave event",
    //     },
    //     timestamp: new Date(),
    // }

    // try {
    //     await webhookClient.send({
    //         embeds: [embedBuilder(embed as any)],
    //     })
    // } catch (error) {
    //     logger.error("Error sending member_leave webhook", error)
    // }

    // // close the webhook client
    // webhookClient.destroy()

}

const data = {
    name: Events.GuildMemberRemove,
    once: false,
    execute,
}

export { 
    data,
}