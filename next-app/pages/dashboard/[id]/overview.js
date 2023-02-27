import Head from 'next/head'
import { Inter } from '@next/font/google'
import { Box, Button, ChakraProvider, Grid, Heading, Hide, Image, Show, Spinner, Text, useColorMode, useColorModeValue } from '@chakra-ui/react'
import { FaShieldAlt, FaStar } from 'react-icons/fa'
import { RiRadioButtonLine } from 'react-icons/ri'
import Cookies from 'universal-cookie';
import { useRouter } from 'next/router';

const inter = Inter({ subsets: ['latin'] })
import theme from '../../../styles/theme.js'

import SidebarWithHeader from '../../../comps/dashboardSidbar/index.js'

import React from 'react'
import axios from 'axios'

export default function DashSelectServer() {

    const cookies = new Cookies();
    const router = useRouter()

    const page = 'dashboard'

    const [loading, setLoading] = React.useState(true)

    const { toggleColorMode } = useColorMode();
    const text = useColorModeValue('dark', 'light');

    const [user, setUser] = React.useState(undefined)
    const [sessionId, setSessionId] = React.useState(cookies.get('seeds-session-id'))

    const [guild, setGuild] = React.useState(undefined)

    React.useEffect(() => {

        const { id } = router.query

        if (text === 'dark') {
            toggleColorMode()
        }

        // make a request to the api to get the guild data
        // set a timeout to make sure the guildId is set
        setTimeout(() => {
            if (!sessionId) {
                // user is not logged in
                window.location.href = `${process.env.REDIRECT}/login`
            }
            if (id) {
                console.log('making request')
                axios.get(`${process.env.REDIRECT}/api/discord-get-guild`, {
                    params: {
                        guildId: id,
                        sessionId: sessionId    
                    }
                }).then((res) => {
                    setGuild(res.data.guildData)
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
            <link rel="icon" href="../../images/seeds-logo-removebg.png" />

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
                    <SidebarWithHeader page={page} guild={guild} />
                    <Box
                        display={'flex'}
                        flexDirection={'column'}
                        alignItems={'center'}
                        justifyContent={'center'}
                        height={'fit-content'}
                        mt={'5rem'}
                        pt={'2rem'}
                    >
                    
                    </Box>
                </Box>
            }
        </Box>
            
        </ChakraProvider>
    )
}
