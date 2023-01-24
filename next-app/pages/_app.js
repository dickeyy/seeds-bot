import '@/styles/globals.css'
import { ChakraProvider, useColorMode, useColorModeValue } from '@chakra-ui/react'
import React from 'react';

import theme from '../styles/theme.js'

export default function App({ Component, pageProps }) {

  const { toggleColorMode } = useColorMode();
  const text = useColorModeValue('dark', 'light');

  React.useEffect(() => {
    if (text === 'dark') {
        toggleColorMode
    }
  }, [])
  return (
    <ChakraProvider theme={theme}>
      <Component {...pageProps} />
    </ChakraProvider>
  )
}
