import Head from "next/head";

export default function SEOHead(props:any) {
    return (
        <Head>
            <title>{props.title || "Seeds Discord Bot"}</title>
            {/* icon */}
            <link rel="icon" href="/images/webp/logo.webp" />
        </Head>
    )
}