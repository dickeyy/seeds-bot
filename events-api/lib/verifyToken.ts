import config from "../config"

export default function verifyToken(context: any) {
    const authHeader = context.request.headers.get("Authorization")
    const token = authHeader?.split(" ")[1]

    if (token !== config.token) {
        context.set.status = 401
        context.set.body = {
            error: "Unauthorized"
        }
        return false
    }
}