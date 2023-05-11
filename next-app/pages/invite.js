import Head from 'next/head'
import { Inter } from '@next/font/google'
import { Box, Button, ChakraProvider, Heading, Spinner, Text, useColorMode, useColorModeValue } from '@chakra-ui/react'

const inter = Inter({ subsets: ['latin'] })
import theme from '../styles/theme.js'

import NavBar from '../comps/navbar'
import React from 'react'
import SEOHead from '@/comps/seoHead/index.js'

export default function InvitePage() {

  const page = 'invite'

  const { toggleColorMode } = useColorMode();
  const text = useColorModeValue('dark', 'light');

  React.useEffect(() => {
    if (text === 'dark') {
        toggleColorMode()
    }
  }, [])

  // Redirect to the invite link on page load
    if (typeof window !== 'undefined') {
        window.location.href = 'https://discord.com/oauth2/authorize?client_id=968198214450831370&permissions=1617004133494&scope=bot%20applications.commands';
    }


  return (
    <ChakraProvider theme={theme}>
        <SEOHead title={'Invite'} description={'The easiest bot to use on Discord'} />

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
            <a href={'https://discord.com/oauth2/authorize?client_id=968198214450831370&permissions=1617004133494&scope=bot%20applications.commands'}>
                <Button size={'lg'} colorScheme={'brand.brown'}>Click Here</Button>
            </a>

            </Box>
        </Box>
        
    </ChakraProvider>
  )
}
