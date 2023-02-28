import Head from 'next/head'
import { Inter } from '@next/font/google'
import { Box, Button, ChakraProvider, Grid, Heading, Hide, Image, Input, InputGroup, InputRightAddon, InputRightElement, Show, Spinner, Text, useColorMode, useColorModeValue, useToast } from '@chakra-ui/react'
import { FaShieldAlt, FaStar } from 'react-icons/fa'
import { RiRadioButtonLine } from 'react-icons/ri'
import Cookies from 'universal-cookie';
import { useRouter } from 'next/router';

const inter = Inter({ subsets: ['latin'] })
import theme from '../../../styles/theme.js'

import SidebarWithHeader from '../../../comps/dashboardSidbar/index.js'

import React from 'react'
import axios from 'axios'
import { FiSettings } from 'react-icons/fi'

export default function DashSelectServer() {

    const cookies = new Cookies();
    const router = useRouter()
    const toast = useToast()

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

    const newNicknameSubmit = (newNickname) => {
        axios.post(`${process.env.REDIRECT}/api/dashboard/change-bot-nickname`, {
            guildId: guild.id,
            sessionId: sessionId,
            newNickname: newNickname
        }).then((res) => {
            console.log(res)

            if (res.data.message != 'Nickname changed successfully') {
                toast({
                    title: "Error",
                    description: "There was an error changing the nickname",
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                })
            } else {
                toast({
                    title: "Success",
                    description: "Nickname changed successfully",
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                })
            }
        }).catch((err) => {
            console.log(err)
        })
    }

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
                        flexDirection={'row'}
                        alignItems={'center'}
                        justifyContent={'center'}
                        height={'fit-content'}
                        width={'100%'}
                        mt={'5rem'}
                        pt={'2rem'}
                        flexWrap={'wrap'}
                    >
                        <Box 
                            display={'flex'}
                            flexDirection={'column'}
                            bgColor={'#161515'}
                            borderRadius={'10px'}
                            width={'100%'}
                            maxWidth={'800px'}
                            p={'1.5rem'}
                            mb={'2rem'}
                            mr={'1rem'}
                            borderColor={'#2f2f2f'}
                            borderWidth={'2px'}
                        >
                            
                            <Box
                                borderBottom={'2px solid #2f2f2f'}
                                mb={'1rem'}
                                flexDir={'row'}
                                display={'flex'}
                                alignItems={'center'}
                                justifyContent={'flex-start'}
                                width={'100%'}

                            >
                                <FiSettings style={{
                                    marginRight: '0.5rem',
                                    fontSize: '1.2rem',
                                    color: "#9d9d9d",
                                    marginBottom: '0.9rem'
                                }} />
                                <Heading
                                    as={'h1'}
                                    fontSize={'1.2rem'}
                                    mb={'1rem'}
                                    color={'brand.gray.100'}
                                >
                                    Basic Settings
                                </Heading>
                            </Box>  

                            <Heading
                                as={'h1'}
                                fontSize={'1.7rem'}
                                mb={'0rem'}
                            >
                                Nickname
                            </Heading>
                            <Text
                                fontSize={'md'}
                                mb={'0.5rem'}
                                color={'brand.gray.100'}
                                fontWeight={'medium'}
                            >
                                Change the nickname of the bot in your server
                            </Text>
                                
                            <InputGroup size='md'>
                                <Input
                                    pr='4.5rem'
                                    type={'text'}
                                    placeholder='New Nickname'
                                />
                                <InputRightElement width='4.5rem'>
                                    <Button h='1.8rem' size='sm' colorScheme={'brand.brown'} onClick={() => {
                                        let nick = document.querySelector('input').value
                                        newNicknameSubmit(nick)
                                    }}>
                                        Apply
                                    </Button>
                                </InputRightElement>
                            </InputGroup>
                                    
                            <br />
                            <br />
                            <Heading
                                as={'h1'}
                                fontSize={'1.7rem'}
                                mb={'0rem'}
                            >
                                Premium Status
                            </Heading>
                            <Text
                                fontSize={'md'}
                                mb={'0.5rem'}
                                color={'brand.gray.100'}
                                fontWeight={'medium'}
                            >
                                Check the Seeds+ status of your server
                            </Text>
                            
                            <a href={'https://seedsbot.xyz/premium'}>
                                <Box
                                    bgColor={'red.900'}
                                    width={'100%'}
                                    height={'2rem'}
                                    borderRadius={'10px'}
                                    display={'flex'}
                                    textAlign={'center'}
                                    alignItems={'center'}
                                    justifyContent={'center'}
                                    borderColor={'red.500'}
                                    borderWidth={'2px'}
                                    p={'1.8rem'}
                                    transition={'all 0.2s ease-in-out'}
                                    _hover={{
                                        borderColor: 'red.400',
                                        bgColor: 'red.800',
                                        cursor: 'pointer'
                                    }}
                                >
                                    <Text
                                        fontSize={'2xl'}
                                        fontWeight={'bold'}
                                        color={"red.200"}
                                    >
                                        Inactive - Upgrade Now!
                                    </Text>
                                </Box>
                            </a>


                        </Box>
                        
                        <Box 
                            display={'flex'}
                            flexDirection={'column'}
                            bgColor={'#161515'}
                            borderRadius={'10px'}
                            width={'100%'}
                            maxWidth={'800px'}
                            p={'1rem'}
                            mb={'2rem'}
                            borderColor={'#2f2f2f'}
                            borderWidth={'2px'}
                        >

                            

                        </Box>
                    
                    </Box>
                </Box>
            }
        </Box>
            
        </ChakraProvider>
    )
}
