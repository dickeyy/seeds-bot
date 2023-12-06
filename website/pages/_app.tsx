import '@/styles/globals.css'
import { GoogleAnalytics } from "nextjs-google-analytics";
import type { AppProps } from 'next/app'
import { hog } from '../lib/posthog'
import { SessionProvider } from "next-auth/react";
import { useEffect } from 'react';

export default function App({ Component, pageProps }: AppProps) {

  if (hog) hog

  return (
    <SessionProvider session={pageProps.session}>
      {/* <GoogleAnalytics trackPageViews /> */}
      <Component {...pageProps} />
    </SessionProvider>
  )
}
