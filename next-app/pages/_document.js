import { Html, Head, Main, NextScript } from 'next/document'
import { ColorModeScript, useColorMode, useColorModeValue } from '@chakra-ui/react'
import React from 'react';

export default function Document() {

  const { toggleColorMode } = useColorMode();
  const text = useColorModeValue('dark', 'light');

  React.useEffect(() => {
    if (text === 'dark') {
        toggleColorMode()
    }
  }, [])

  return (
    <Html lang="en">
      <Head />
      <body>
        <ColorModeScript initialColorMode={'dark'} />
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
