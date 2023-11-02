import { AuditLogEvent, Events, WebhookClient, time } from "discord.js";
import { checkLogTypeEnabled } from "../lib/checkLogEnabled";
import embedBuilder from "../lib/embedBuilder";
import { logger } from "../lib/logger";
import { client } from "../bot";
import config from "../config";

async function execute(oldServer:any, newServer:any) {

    let data = {
        oldServer,
        newServer,
    }

    const req = await fetch(`${config.event_api_url}/server/update`, {
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
        logger.error("Error sending server_update event to events-api")
        return
    }

    // let settings:any = await checkLogTypeEnabled("server_update", newServer.id)
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
    //     logger.error("Error creating server_update webhook", error)
    // }

    // const embed = {
    //     title: "Server Updated",
    //     description: "```diff\n",
    //     thumbnail: `https://cdn.discordapp.com/emojis/1064444101870759958.webp`,
    //     color: client.mainColor,
    //     footer: {
    //         text: "Event ID: " + newServer.id + " | server_update event",
    //     },
    //     timestamp: new Date(),
    // }

    // if (oldServer.name !== newServer.name) {
    //     embed.description += `Name Changed\n- ${oldServer.name}\n+ ${newServer.name}\n`
    // } if (oldServer.description !== newServer.description) {
    //     embed.description += `Description Changed\n- ${oldServer.description}\n+ ${newServer.description}\n`
    // } if (oldServer.icon !== newServer.icon) {
    //     embed.description += `Icon Changed\n- ${oldServer.icon}\n+ ${newServer.icon}\n`
    // } if (oldServer.banner !== newServer.banner) {
    //     embed.description += `Banner Changed\n- ${oldServer.banner}\n+ ${newServer.banner}\n`
    // } if (oldServer.splash !== newServer.splash) {
    //     embed.description += `Splash Changed\n- ${oldServer.splash}\n+ ${newServer.splash}\n`
    // } if (oldServer.afkChannelId !== newServer.afkChannelId) {
    //     embed.description += `AFK Channel Changed\n- ${oldServer.afkChannelId}\n+ ${newServer.afkChannelId}\n`
    // } if (oldServer.afkTimeout !== newServer.afkTimeout) {
    //     embed.description += `AFK Timeout Changed\n- ${oldServer.afkTimeout}\n+ ${newServer.afkTimeout}\n`
    // } if (oldServer.systemChannelId !== newServer.systemChannelId) {
    //     embed.description += `System Channel Changed\n- ${oldServer.systemChannelId}\n+ ${newServer.systemChannelId}\n`
    // } if (oldServer.rulesChannelId !== newServer.rulesChannelId) {
    //     embed.description += `Rules Channel Changed\n- ${oldServer.rulesChannelId}\n+ ${newServer.rulesChannelId}\n`
    // } if (oldServer.publicUpdatesChannelId !== newServer.publicUpdatesChannelId) {
    //     embed.description += `Public Updates Channel Changed\n- ${oldServer.publicUpdatesChannelId}\n+ ${newServer.publicUpdatesChannelId}\n`
    // } if (oldServer.preferredLocale !== newServer.preferredLocale) {
    //     embed.description += `Preferred Locale Changed\n- ${oldServer.preferredLocale}\n+ ${newServer.preferredLocale}\n`
    // } if (oldServer.verificationLevel !== newServer.verificationLevel) {
    //     embed.description += `Verification Level Changed\n- ${oldServer.verificationLevel}\n+ ${newServer.verificationLevel}\n`
    // } if (oldServer.explicitContentFilter !== newServer.explicitContentFilter) {
    //     embed.description += `Explicit Content Filter Changed\n- ${oldServer.explicitContentFilter}\n+ ${newServer.explicitContentFilter}\n`
    // } if (oldServer.mfaLevel !== newServer.mfaLevel) {
    //     embed.description += `MFA Level Changed\n- ${oldServer.mfaLevel}\n+ ${newServer.mfaLevel}\n`
    // } if (oldServer.defaultMessageNotifications !== newServer.defaultMessageNotifications) {
    //     embed.description += `Default Message Notifications Changed\n- ${oldServer.defaultMessageNotifications}\n+ ${newServer.defaultMessageNotifications}\n`
    // } if (oldServer.premiumTier !== newServer.premiumTier) {
    //     embed.description += `Premium Tier Changed\n- ${oldServer.premiumTier}\n+ ${newServer.premiumTier}\n`
    // } if (oldServer.premiumSubscriptionCount !== newServer.premiumSubscriptionCount) {
    //     embed.description += `Premium Subscription Count Changed\n- ${oldServer.premiumSubscriptionCount}\n+ ${newServer.premiumSubscriptionCount}\n`
    // } if (oldServer.vanityURLCode !== newServer.vanityURLCode) {
    //     embed.description += `Vanity URL Code Changed\n- ${oldServer.vanityURLCode}\n+ ${newServer.vanityURLCode}\n`
    // } if (oldServer.ownerId !== newServer.ownerId) {
    //     embed.description += `Owner ID Changed\n- ${oldServer.ownerId}\n+ ${newServer.ownerId}\n`
    // }
     
    // embed.description += "```"

    // // make sure the embed isn't too long
    // if (embed.description.length > 4096) {
    //     embed.description = embed.description.slice(0, 4098) + "..."
    // }

    // try {
    //     await webhookClient.send({
    //         embeds: [embedBuilder(embed as any)],
    //     })
    // } catch (error) {
    //     logger.error("Error sending server_update webhook", error)
    // }

    // // close the webhook client
    // webhookClient.destroy()

}

const data = {
    name: Events.GuildUpdate,
    once: false,
    execute,
}

export { 
    data,
}