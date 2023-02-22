import Head from 'next/head'
import { Inter } from '@next/font/google'
import { Box, Button, ChakraProvider, Heading, Spinner, Text, useColorMode, useColorModeValue } from '@chakra-ui/react'

const inter = Inter({ subsets: ['latin'] })
import theme from '../styles/theme.js'

import NavBar from '../comps/navbar'
import React from 'react'

export default function UpgradePage() {

    const page = 'upgrade'

    const { toggleColorMode } = useColorMode();
    const text = useColorModeValue('dark', 'light');
    const [statusMessage, setStatusMessage] = React.useState('')

    const messageList = ['Defrosting pizza', 'Preheating oven', 'Feeding the dogs', 'Going to the bathroom', 'Im bored', 'Posting a fit check', 'Finding motivation to live', 'Getting a haircut', 'Getting a job', 'Getting a girlfriend (failed)', 'Taking a nap', 'Fighting my demons', 'Touching grass', 'Punching the wall', 'Becoming god', 'Stealing data (jk)']

    React.useEffect(() => {
        if (text === 'dark') {
            toggleColorMode()
        }

        if (statusMessage === '') setStatusMessage(messageList[Math.floor(Math.random() * messageList.length)])

        const interval = setInterval(() => {
            setStatusMessage(messageList[Math.floor(Math.random() * messageList.length)])
        }, 3000);

        return () => clearInterval(interval);

    }, [])


    return (
        <ChakraProvider theme={theme}>
            <Head>
                <title>Seeds | Upgrade</title>
                <meta name="description" content="Seeds is the easiest bot to use on Discord" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="images/seeds-logo-removebg.png" />
            </Head>

            <Box>
                <Box
                display={'flex'}
                flexDirection={'column'}
                    alignItems={'center'}
                    justifyContent={'center'}
                    w={'100vw'}
                    h={'100vh'}

                >
                
                <Heading as={'h1'}>Upgrading your account</Heading>
                
                <Text
                    fontSize={'xl'}
                    fontWeight={'bold'}
                    color={'brand.gray.500'}
                    mt={4}
                >
                    {statusMessage}
                </Text>
                <br></br>
                <Spinner color='brand.brown.500' thickness='thick' size={'xl'} />

                </Box>
            </Box>
            
        </ChakraProvider>
    ) 
}
