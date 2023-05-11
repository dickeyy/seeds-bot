import Head from "next/head";

export default function SEOHead(props) {

    return (
        <Head>
            
            <title>Seeds | {props.title}</title>
            <meta name="description" content={props.description} />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <link rel="icon" href="images/seeds-logo-removebg.png" />

            {/* //   <!-- Facebook Meta Tags --> */}
            <meta property="og:url" content="https://seedsbot.xyz" />
            <meta property="og:type" content="website" />
            <meta property="og:title" content="Seeds" />
            <meta property="og:description" content="The easiest bot to use on Discord" />
            <meta property="og:image" content="https://seedsbot.xyz/images/seeds-logo-removebg.png" />

            {/* <!-- Twitter Meta Tags --> */}
            <meta name="twitter:card" content="summary_small_image" />
            <meta property="twitter:domain" content="seedsbot.xyz" />
            <meta property="twitter:url" content="https://seedsbot.xyz" />
            <meta name="twitter:title" content="Seeds" />
            <meta name="twitter:description" content="The easiest bot to use on Discord" />
            <meta name="twitter:image" content="https://seedsbot.xyz/images/seeds-logo-removebg.png" />

            {/* <!-- Google / Search Engine Tags --> */}
            <meta itemprop="name" content="Seeds" />
            <meta itemprop="description" content="The easiest bot to use on Discord" />
            <meta itemprop="image" content="https://seedsbot.xyz/images/seeds-logo-removebg.png" />

            {/* Site keywords */}
            <meta name="keywords" content="Seeds, seedsbot, discord, bot, discord bot, moderation, server, levels, economy, website, dickey, seeds, music, levels, discordbot, dashboard, web, add to server, invite, support, help, discord support, bots for discord" />
            <meta name="robots" content="index, follow" />
            <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
            <meta name="language" content="English" />
            <meta name="revisit-after" content="5 days" />
            
        </Head>
    )

}