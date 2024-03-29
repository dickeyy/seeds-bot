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
import SEOHead from '@/comps/seoHead/index.js'

export default function Home() {

  const page = 'donate'

  const [loading, setLoading] = React.useState(true)

  const { toggleColorMode } = useColorMode();
  const text = useColorModeValue('dark', 'light');

  return (

    <ChakraProvider theme={theme}>
      <SEOHead title={'Donate'} description={'The easiest bot to use on Discord'} />

      <Box
        h={'100vh'}
        w={'100vw'}
        bgPos={'static'}
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
                fontSize={['5xl', '6xl', '8xl', '8xl']}
                fontWeight={'bold'}
                color={'#fff'}
                mb={'2rem'}
            >
                Donate
            </Heading>
            <Text
                as={'p'}
                fontSize={['lg', 'lg', 'xl', 'xl']}
                w={['90%', '70%', '50%', '50%']}
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
                w={['70%', '70%', '20%', '20%']}
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
