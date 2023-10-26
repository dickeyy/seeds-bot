import logger from "./logger"

export default async function sendMessage(data:any, webhookUrl:string) {
 
    await fetch(webhookUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data),
    }).catch((err:any) => {
        logger.error("Error sending message to webhook", err)
    }) 

    return true
}