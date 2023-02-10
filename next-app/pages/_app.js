import '@/styles/globals.css'
import { ChakraProvider, useColorMode, useColorModeValue } from '@chakra-ui/react'
import { Analytics } from '@vercel/analytics/react';
import React from 'react';
import Mirky from 'mirky'

import theme from '../styles/theme.js'

export default function App({ Component, pageProps }) {

  const { toggleColorMode } = useColorMode();
  const text = useColorModeValue('dark', 'light');

  const analytics = new Mirky()

  React.useEffect(() => {

    analytics.init('6yYFCaXt7HX9mMDJL8Cp8D')

    analytics.pageView()

    if (text === 'dark') {
        toggleColorMode
    }
  }, [])

  return (
    <ChakraProvider theme={theme}>
      <Component {...pageProps} />
      <Analytics />
    </ChakraProvider>
  )
}
