/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    DISCORD_CLIENT_ID: process.env.DISCORD_CLIENT_ID,
    DISCORD_CLIENT_SECRET: process.env.DISCORD_CLIENT_SECRET,
    REDIRECT: process.env.REDIRECT,
    DISCORD_AUTH_URL: process.env.DISCORD_AUTH_URL,
  }
}

module.exports = nextConfig
