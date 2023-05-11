import '@/styles/globals.css'
import { ChakraProvider, useColorMode, useColorModeValue } from '@chakra-ui/react'
import { Analytics } from '@vercel/analytics/react';
import React from 'react';
import Mirky from 'mirky'
import { GoogleAnalytics } from "nextjs-google-analytics";
import { SessionProvider } from "next-auth/react"

import theme from '../styles/theme.js'

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {

  const { toggleColorMode } = useColorMode();
  const text = useColorModeValue('dark', 'light');

  const analytics = new Mirky()

  React.useEffect(() => {

    analytics.init('NYzjBfMq8SeknUScXtrgDi')

    analytics.pageView()

    if (text === 'dark') {
        toggleColorMode
    }
  }, [])

  return (
    <ChakraProvider theme={theme}>
      <SessionProvider session={session}>
        <GoogleAnalytics trackPageViews />
        <Component {...pageProps} />
        <Analytics />
        </SessionProvider>
    </ChakraProvider>
  )
}
