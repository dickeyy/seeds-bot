import Head from 'next/head'
import { Inter } from '@next/font/google'
import { Box, Button, ChakraProvider, Heading, Hide, Image, Show, Text, useColorMode, useColorModeValue } from '@chakra-ui/react'
import { FaShieldAlt, FaStar } from 'react-icons/fa'
import { RiRadioButtonLine } from 'react-icons/ri'

const inter = Inter({ subsets: ['latin'] })
import theme from '../styles/theme.js'

import NavBar from '../comps/navbar'
import Hero from '../comps/homeHero'
import React from 'react'
import ImageFeature1 from '@/comps/imageFeature1/index.js'
import ImageFeature2 from '@/comps/imageFeature2/index.js'

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

      <Box>
        <NavBar active={page}/>
        <Box
          display={'flex'}
          flexDirection={'column'}
        >

          <Hero />

          <Box
            display={'flex'}
            flexDirection={'column'}
            justifyContent={'center'}
            w={'100vw'}
            p={['1rem', '2rem', '3rem', '5rem']}
            pt={'10rem'}
          >

            <Hide below='990px' >

              <ImageFeature1 
                title={'Advanced Economy'} 
                text={"Seeds has a fully featured economy system with a wide range of commands to help you manage your server's economy."} 
                image={'images/discord/shop-showcase.png'} 
              />
              
              <br></br>
              <br></br>
              <br></br>

              <ImageFeature2
                title={'Easy Moderation'} 
                text={"Seeds has a wide range of moderation commands to help you manage your server. From simple systems like kick and ban, to advanced features like full-fledged logging and report systems."} 
                image={'images/discord/moderation-showcase.png'} 
              />

              <br></br>
              <br></br>
              <br></br>

              <ImageFeature1 
                title={'Diverse Fun'} 
                text={"Seeds has a full suite of fun commands to help you and your server members have a good time, and keep users engaged."} 
                image={'images/discord/fun-showcase.png'} 
              />

              <br></br>
              <br></br>
              <br></br>

              <ImageFeature2
                title={'Engaging Games'} 
                text={"Seeds has a developing plethora of games to play with your server members, host tournaments, compete for rewards, and more."} 
                image={'images/discord/game-showcase.png'} 
              />
            </Hide>

            <Show below='990px' >
              <ImageFeature1 
                title={'Advanced Economy'} 
                text={"Seeds has a fully featured economy system with a wide range of commands to help you manage your server's economy."} 
                image={'images/discord/shop-showcase.png'} 
              />
              
              <br></br>
              <br></br>
              <br></br>

              <ImageFeature1
                title={'Easy Moderation'} 
                text={"Seeds has a wide range of moderation commands to help you manage your server. From simple systems like kick and ban, to advanced features like full-fledged logging and report systems."} 
                image={'images/discord/moderation-showcase.png'} 
              />

              <br></br>
              <br></br>
              <br></br>

              <ImageFeature1 
                title={'Diverse Fun'} 
                text={"Seeds has a full suite of fun commands to help you and your server members have a good time, and keep users engaged."} 
                image={'images/discord/fun-showcase.png'} 
              />

              <br></br>
              <br></br>
              <br></br>

              <ImageFeature1
                title={'Engaging Games'} 
                text={"Seeds has a developing plethora of games to play with your server members, host tournaments, compete for rewards, and more."} 
                image={'images/discord/game-showcase.png'} 
              />
            </Show>

            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>

            <Heading as={'h1'} size={'2xl'} textAlign={'center'}>And much much more...</Heading>
            <br></br>
            <Text textAlign={'center'} color={'brand.gray.200'} fontWeight={'medium'}>
              Seeds is constantly being updated, there's always something new to discover.
            </Text>
            <br></br>
            <br></br>
            <Box
              display={'flex'}
              justifyContent={'center'}
            >
              <Button
                as={'a'}
                href={'/invite'}
                size={'lg'}
                colorScheme={'brand.brown'}
                variant={'solid'}
                p={'2rem 5rem'}
                fontSize={'1.5rem'}
                fontWeight={'bold'}
                mb={'2rem'}
              >
                Add it Now!
              </Button>
            </Box>

          </Box>
          
        </Box>
      </Box>
        
    </ChakraProvider>
  )
}
