import { AuditLogEvent, Events, GuildMember, WebhookClient, time } from "discord.js";
import { checkLogTypeEnabled } from "../lib/checkLogEnabled";
import embedBuilder from "../lib/embedBuilder";
import { logger } from "../lib/logger";
import config from "../config";

async function execute(oldMember:any, newMember:any) {

    let data = {
        guild: newMember.guild,
        oldMember,
        newMember,
        newRoles: newMember.roles.cache.map((role:any) => { return role.id } ),
        oldRoles: oldMember.roles.cache.map((role:any) => { return role.id } ),
    }

    const req = await fetch(`${config.event_api_url}/member/update`, {
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
        logger.error("Error sending member_update event to events-api")
        return
    }

    // let settings:any = await checkLogTypeEnabled("member_update", oldMember.guild.id)
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
    //     logger.error("Error creating member_update webhook", error)
    // }

    // let description = `**Member:** <@${newMember.user.id}> (${newMember.user.id})\n\`\`\`diff\n`

    // const embed = {
    //     title: "Member Updated",
    //     description: description,
    //     thumbnail: "https://cdn.discordapp.com/emojis/1064444245588578385.webp",
    //     color: "#4CA99D",
    //     author: {
    //         name: newMember.user.username,
    //         iconURL: newMember.user.avatarURL(),
    //     },
    //     footer: {
    //         text: "Event ID: " + newMember.id + " | member_update event",
    //     },
    //     timestamp: new Date(),
    // }

    // if (oldMember.nickname !== newMember.nickname) {
    //     embed.description += `\nNickname Changed:\n- ${oldMember.nickname ? oldMember.nickname : "None"}\n+ ${newMember.nickname ? newMember.nickname : "None"}\n`
    // } if (oldMember.user.avatar !== newMember.user.avatar) {
    //     embed.description += `\nAvatar Changed:\n- ${oldMember.user.avatarURL()}\n+ ${newMember.user.avatarURL()}\n`
    // } if (oldMember.user.username !== newMember.user.username) {
    //     embed.description += `\nUsername Changed:\n- ${oldMember.user.username}\n+ ${newMember.user.username}\n`
    // }

    // embed.description += "```"

    // if (oldMember.roles.cache.size !== newMember.roles.cache.size) {
    //     const addedRoles = newMember.roles.cache.filter((role:any) => !oldMember.roles.cache.has(role.id)).map((role:any) => `<@&${role.id}>`).join(", ")
    //     const removedRoles = oldMember.roles.cache.filter((role:any) => !newMember.roles.cache.has(role.id)).map((role:any) => `<@&${role.id}>`).join(", ")
    //     embed.description += `\n**Roles Changed:**`
    //     if (addedRoles) {
    //         embed.description += `\n**Added:** ${addedRoles}`
    //     }
    //     if (removedRoles) {
    //         embed.description += `\n**Removed:** ${removedRoles}`
    //     }
    // }

    // try {
    //     await webhookClient.send({
    //         embeds: [embedBuilder(embed as any)],
    //     })
    // } catch (error) {
    //     logger.error("Error sending member_update webhook", error)
    // }

    // // close the webhook client
    // webhookClient.destroy()

}

const data = {
    name: Events.GuildMemberUpdate,
    once: false,
    execute,
}

export { 
    data,
}