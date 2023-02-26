import Head from 'next/head'
import { Inter } from '@next/font/google'
import { Box, Button, ChakraProvider, Heading, Spinner, Text, useColorMode, useColorModeValue } from '@chakra-ui/react'

const inter = Inter({ subsets: ['latin'] })
import theme from '../styles/theme.js'

import NavBar from '../comps/navbar'
import React from 'react'

export default function InvitePage() {

  const page = 'login'

  //const authUrl = 'https://discord.com/api/oauth2/authorize?client_id=968198214450831370&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fdashboard%2Fselect-server&response_type=code&scope=identify%20guilds%20email%20guilds.members.read'
  const authUrl = 'https://discord.com/api/oauth2/authorize?client_id=968198214450831370&redirect_uri=https%3A%2F%2Fseedsbot.xyz%2Fdashboard%2Fselect-server&response_type=code&scope=identify%20guilds%20email'
  const { toggleColorMode } = useColorMode();
  const text = useColorModeValue('dark', 'light');

  React.useEffect(() => {
    if (text === 'dark') {
        toggleColorMode()
    }
  }, [])

  // Redirect to the invite link on page load
    if (typeof window !== 'undefined') {
        window.location.href = authUrl;
    }


  return (
    <ChakraProvider theme={theme}>
        <Head>
            <title>Seeds | Login</title>
            <meta name="description" content="Seeds is the easiest bot to use on Discord" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <link rel="icon" href="images/seeds-logo-removebg.png" />
        </Head>

        <Box>
            <NavBar active={page}/>
            <Box
            display={'flex'}
            flexDirection={'column'}
                alignItems={'center'}
                justifyContent={'center'}
                w={'100vw'}
                h={'100vh'}

            >
            
            <Heading as={'h1'}>Redirecting...</Heading>
            <br></br>
            <Spinner colorScheme={'white'} size={'xl'} />
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <Text
                fontSize={'xl'}
                fontWeight={'bold'}
                color={'brand.gray.500'}
            >
                If you are not redirected...
            </Text>
            <br></br>
            <a href={authUrl}>
                <Button size={'lg'} colorScheme={'brand.brown'}>Click Here</Button>
            </a>

            </Box>
        </Box>
        
    </ChakraProvider>
  )
}
