import { Html, Head, Main, NextScript } from 'next/document'
import { ColorModeScript, useColorMode, useColorModeValue } from '@chakra-ui/react'
import React from 'react';

import theme from '../styles/theme.js'

export default function Document() {

  return (
    <Html lang="en">
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
