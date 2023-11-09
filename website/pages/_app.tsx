import '@/styles/globals.css'
import { GoogleAnalytics } from "nextjs-google-analytics";
import type { AppProps } from 'next/app'
import { SessionProvider } from "next-auth/react";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider session={pageProps.session}>
      <GoogleAnalytics trackPageViews />
      <Component {...pageProps} />
    </SessionProvider>
  )
}
