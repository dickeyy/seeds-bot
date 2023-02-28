import Head from 'next/head'
import { Inter } from '@next/font/google'
import { Box, Button, ChakraProvider, Grid, Heading, Hide, Image, Show, Spinner, Text, useColorMode, useColorModeValue } from '@chakra-ui/react'
import { FaShieldAlt, FaStar } from 'react-icons/fa'
import { RiRadioButtonLine } from 'react-icons/ri'
import Cookies from 'universal-cookie';
import { useRouter } from 'next/router';

const inter = Inter({ subsets: ['latin'] })
import theme from '../../styles/theme.js'

import NavBar from '../../comps/navbar'
import React from 'react'
import axios from 'axios'

export default function DashSelectServer() {

    const cookies = new Cookies();
    const router = useRouter()

    const page = 'dashboard'

    const [loading, setLoading] = React.useState(true)

    const { toggleColorMode } = useColorMode();
    const text = useColorModeValue('dark', 'light');

    const authUrl = 'https://discord.com/api/oauth2/authorize?client_id=968198214450831370&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fdashboard%2Fselect-server&response_type=code&scope=identify%20guilds%20email%20guilds.members.read'
    const [authCode , setAuthCode] = React.useState(undefined)

    const [user, setUser] = React.useState(undefined)
    const [sessionId, setSessionId] = React.useState(cookies.get('seeds-session-id'))

    const [guild, setGuild] = React.useState(undefined)

    React.useEffect(() => {

        console.log(router.query)

        if (text === 'dark') {
            toggleColorMode()
        }

        // make a request to the api to get the guild data
        // set a timeout to make sure the guildId is set
        setTimeout(() => {
            if (guildId) {
                console.log('making request')
                axios.get(`${process.env.REDIRECT}/api/discord-get-guild`, {
                    params: {
                        guildId: guildId,
                        sessionId: sessionId    
                    }
                }).then((res) => {
                    console.log(res.data)
                    setLoading(false)
                }).catch((err) => {
                    console.log(err)
                })
            } else {
                console.log('guildId not set')
            }
        }, 1000)
    }, [router])

    return (

        <ChakraProvider theme={theme}>
        <Head>
            <title>Dashboard</title>
            <meta name="description" content="Seeds is the easiest bot to use on Discord" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <link rel="icon" href="../images/seeds-logo-removebg.png" />

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
        display={'flex'}
        flexDirection={'column'}
        alignItems={'center'}
        justifyContent={'center'}
        height={'100vh'}
        >
            {loading ? 
                <Spinner
                thickness="4px"
                speed="0.65s"
                color="brand.brown.500"
                size="xl"
                />
            :
                <Box>
                    <NavBar active={page}/>
                    <Box
                    display={'flex'}
                    flexDirection={'column'}
                    alignItems={'center'}
                    justifyContent={'center'}
                    height={'fit-content'}
                    mt={'5rem'}
                    pt={'2rem'}
                    >
                    <Heading>
                        {guildId} 
                    </Heading>
                    
                    </Box>
                </Box>
            }
        </Box>
            
        </ChakraProvider>
    )
}
