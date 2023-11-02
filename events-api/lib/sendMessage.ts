import logger from "./logger"

export default async function sendMessage(data:any, webhookUrl:string) {
    const req = await fetch("https://discord.com/api/webhooks/1167238448676081674/LPioAcAmqDcHfy7qTc6TktQvNnpasFbR0Bg9_bhjF2KIywN-kD3cJPWRy_Sm1Jc32piY", {
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