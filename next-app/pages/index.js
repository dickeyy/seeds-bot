import Head from 'next/head'
import { Inter } from '@next/font/google'
import { Box, ChakraProvider, Heading, Text, useColorMode, useColorModeValue } from '@chakra-ui/react'

const inter = Inter({ subsets: ['latin'] })
import theme from '../styles/theme.js'

import NavBar from '../comps/navbar'
import Hero from '../comps/homeHero'
import React from 'react'

export default function Home() {

  const page = 'home'

  const { toggleColorMode } = useColorMode();
  const text = useColorModeValue('dark', 'light');

  React.useEffect(() => {
    if (text === 'dark') {
        toggleColorMode()
    }
  }, [])

  return (
    <ChakraProvider theme={theme}>
      <Head>
        <title>Seeds | Home</title>
        <meta name="description" content="Seeds is the easiest bot to use on Discord" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="images/seeds-logo-removebg.png" />
      </Head>

      <Box>
        <NavBar active={page}/>
        <Box
          display={'flex'}
          flexDirection={'column'}
        >

          <Hero />
          
        </Box>
      </Box>
        
    </ChakraProvider>
  )
}
