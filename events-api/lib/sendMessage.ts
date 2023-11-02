import logger from "./logger"

export default async function sendMessage(data:any, webhookUrl:string) {
    const req = await fetch(webhookUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            embeds: data.embeds,
            username: "Seeds Logging",
            avatar_url: "https://seedsbot.xyz/images/webp/logo.webp",
        }),
    })

    if (!req.ok) {
        logger.error("Error sending message to webhook")
        return false
    }

    return true
}