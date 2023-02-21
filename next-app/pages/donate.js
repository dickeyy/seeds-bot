import Head from 'next/head'
import { Inter } from '@next/font/google'
import { Box, Button, ChakraProvider, Heading, Hide, Image, Show, Spinner, Text, useColorMode, useColorModeValue } from '@chakra-ui/react'
import { FaCcStripe, FaShieldAlt, FaStar, FaStripe } from 'react-icons/fa'
import { RiRadioButtonLine } from 'react-icons/ri'
import axios from 'axios'

const inter = Inter({ subsets: ['latin'] })
import theme from '../styles/theme.js'

import NavBar from '../comps/navbar'
import Hero from '../comps/homeHero'
import React from 'react'
import ImageFeature1 from '@/comps/imageFeature1/index.js'
import ImageFeature2 from '@/comps/imageFeature2/index.js'

export default function Home() {

  const page = 'donate'

  const [loading, setLoading] = React.useState(true)

  const { toggleColorMode } = useColorMode();
  const text = useColorModeValue('dark', 'light');

  return (

    <ChakraProvider theme={theme}>
      <Head>
        <title>Seeds | Donate</title>
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
        bgImage={'url(images/contour-lines.png)'}
        h={'100vh'}
        w={'100vw'}
        bgPos={'static'}
        bgBlendMode={'overlay'}
        bgColor={'rgba(0,0,0,0.8)'}
        bgAttachment={'fixed'}
        flexDirection={'column'}

      >
        <NavBar active={page}/>
        <Box
            display={'flex'}
            flexDirection={'column'}
            justifyContent={'center'}
            w={'100vw'}
            textAlign={'center'}
            pt={'20vh'}
        >
            <Heading
                as={'h1'}
                fontSize={'8xl'}
                fontWeight={'bold'}
                color={'#fff'}
                mb={'2rem'}
            >
                Donate
            </Heading>
            <Text
                as={'p'}
                fontSize={'xl'}
                w={'50%'}
                mx={'auto'}
                fontWeight={'normal'}
                color={'brand.gray.100'}
                mb={'2rem'}
            >
                Donations to Seeds are 100% optional, but they are greatly appreciated. Donations help us pay for our server costs, and help us keep Seeds running. If you would like to donate, you can do so by clicking the button below.
            </Text>
            <Text
                as={'p'}
                fontSize={'xl'}
                fontWeight={'normal'}
                color={'brand.gray.500'}
                mb={'2rem'}
            >
                p.s. i love you 💖
            </Text>

            <Button
                as={'a'}
                href={'https://donate.stripe.com/4gwg0c0po0bf70QbII'}
                target={'_blank'}
                rel={'noopener noreferrer'}
                colorScheme={'brand.brown'}
                w={'20%'}
                mt={'2rem'}
                mx={'auto'}
                mb={'2rem'}
                fontSize={'2xl'}
                p={'1.5rem'}
                fontWeight={'bold'}
                leftIcon={<FaCcStripe />}
            >
                Donate
            </Button>

        </Box>
    </Box>
        
    </ChakraProvider>
  )
}
