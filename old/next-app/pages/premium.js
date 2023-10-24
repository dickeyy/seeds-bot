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
import SEOHead from '@/comps/seoHead/index.js'

export default function Home() {

  const page = 'premium'

  const [loading, setLoading] = React.useState(true)

  const { toggleColorMode } = useColorMode();
  const text = useColorModeValue('dark', 'light');

  return (

    <ChakraProvider theme={theme}>
      <SEOHead title={'Premium'} description={'The easiest bot to use on Discord'} />

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
