export default async function sendMessage(data:any, webhookUrl:string) {
    const req = await fetch(webhookUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data),
    })

    if (!req.ok) {
        throw new Error("Error sending webhook")
    }

    return true
}