import NextAuth from "next-auth"
import Discord from "next-auth/providers/discord"
import DiscordProvider from "next-auth/providers/discord"

export const authOptions = {
    // Configure one or more authentication providers
    providers: [
        DiscordProvider({
            clientId: process.env.DISCORD_CLIENT_ID as string,
            clientSecret: process.env.DISCORD_CLIENT_SECRET as string,
        })
    // ...add more providers here
    ],
}

export default NextAuth(authOptions)