import Head from 'next/head'
import { Inter } from '@next/font/google'
import { Box, Button, ChakraProvider, Heading, Hide, Image, List, ListIcon, ListItem, Show, Spinner, Tag, Text, useColorMode, useColorModeValue } from '@chakra-ui/react'
import axios from 'axios'

const inter = Inter({ subsets: ['latin'] })
import theme from '../styles/theme.js'

import NavBar from '../comps/navbar'
import React from 'react'
import HeroPremium from '@/comps/heroPremium/index.js'
import PremiumFeatureList from '@/comps/premiumFeatureList/index.js'

export default function Home() {

  const page = 'premium'

  const [loading, setLoading] = React.useState(true)

  const { toggleColorMode } = useColorMode();
  const text = useColorModeValue('dark', 'light');

  return (

    <ChakraProvider theme={theme}>
      <Head>
        <title>Seeds | Premium</title>
        <meta name="description" content="Seeds is the easiest bot to use on Discord" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="images/seeds-logo-removebg.png" />

        {/* //   <!-- Facebook Meta Tags --> */}
        <meta property="og:url" content="https://seedsbot.xyz" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Seeds" />
        <meta property="og:description" content="The easiest bot to use on Discord" />
        <meta property="og:image" content="https://seedsbot/images/seeds-logo-removedbg.png" />

        {/* <!-- Twitter Meta Tags --> */}
        <meta name="twitter:card" content="summary_small_image" />
        <meta property="twitter:domain" content="seedsbot.xyz" />
        <meta property="twitter:url" content="https://seedsbot.xyz" />
        <meta name="twitter:title" content="Seeds" />
        <meta name="twitter:description" content="The easiest bot to use on Discord" />
        <meta name="twitter:image" content="https://seedsbot/images/seeds-logo-removedbg.png" />
      </Head>

      <Box
        h={'100vh'}
        w={'100vw'}
        flexDirection={'column'}

      >
        <NavBar active={page}/>
        <Box
            display={'flex'}
            flexDirection={'column'}
            justifyContent={'center'}
            w={'100vw'}
            textAlign={'center'}
        >

            <HeroPremium />

            <PremiumFeatureList />

        </Box>
    </Box>
        
    </ChakraProvider>
  )
}
