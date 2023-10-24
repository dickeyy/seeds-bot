import Head from 'next/head'
import { Inter } from '@next/font/google'
import { Box, Button, ChakraProvider, Grid, Heading, Hide, Image, Input, InputGroup, InputRightAddon, InputRightElement, Show, Spinner, Text, useColorMode, useColorModeValue, useToast } from '@chakra-ui/react'
import React from 'react'
import axios from 'axios'
import {signIn, signOut, useSession} from 'next-auth/react'
import { useRouter } from 'next/router';

const inter = Inter({ subsets: ['latin'] })
import theme from '../../../styles/theme.js'

import SidebarWithHeader from '../../../comps/dashboardSidbar/index.js'
import DashboardModule from '../../../comps/dashboardModule/index.js'

import { FaShieldAlt, FaStar } from 'react-icons/fa'
import { RiRadioButtonLine } from 'react-icons/ri'
import { FiSettings } from 'react-icons/fi'
import SEOHead from '@/comps/seoHead/index.js'

export default function DashSelectServer() {

    const router = useRouter()
    const toast = useToast()

    const page = 'dashboard'

    const { data: session } = useSession()

    const [loading, setLoading] = React.useState(true)

    const { toggleColorMode } = useColorMode();
    const text = useColorModeValue('dark', 'light');

    const [guild, setGuild] = React.useState(undefined)

    React.useEffect(() => {

        const { id } = router.query

        if (text === 'dark') {
            toggleColorMode()
        }

        // make a request to the api to get the guild data
        // set a timeout to make sure the guildId is set
        setTimeout(() => {
            if (!session) return
            if (id) {
                console.log(session)
                console.log('making request')
                axios.get(`${process.env.REDIRECT}/api/auth/guild-data`, {
                    params: {
                        guildId: id,
                        sessionId: session.jti    
                    }
                }).then((res) => {
                    setGuild(res.data.guild)
                    setLoading(false)
                }).catch((err) => {
                    console.log(err)
                })
            } else {
                console.log('guildId not set')
            }
        }, 3000)

        console.log(guild)
    }, [router, session])

    const newNicknameSubmit = (newNickname) => {
        axios.post(`${process.env.REDIRECT}/api/dashboard/change-bot-nickname`, {
            guildId: guild.id,
            sessionId: session.jti,
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
        <SEOHead title={'Dashboard Overview'} description={'The easiest bot to use on Discord'} />

        <Box
        >
            {loading ? 
                <Box
                    display={'flex'}
                    flexDirection={'column'}
                    alignItems={'center'}
                    justifyContent={'center'}
                    height={'100vh'}
                    width={'100%'}
                >
                    <Spinner
                    thickness="4px"
                    speed="0.65s"
                    color="brand.brown.500"
                    size="xl"
                    />
                </Box>
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
                        <DashboardModule
                            title={"Basic Settings"}
                            icon={<FiSettings
                                style={{
                                    marginRight: '0.5rem',
                                    fontSize: '1.2rem',
                                    color: "#9d9d9d",
                                    marginBottom: '0.9rem'
                                }}
                            />}

                            content={
                                <Box>
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
                                        
                                    <InputGroup size='lg'>
                                        <Input
                                            pr='4.5rem'
                                            type={'text'}
                                            placeholder='New Nickname'
                                        />
                                        <InputRightElement width='4.5rem'>
                                            <Button size='md' mr={1} colorScheme={'brand.brown'} onClick={() => {
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
                                    
                                    <a>
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
                            }

                        />
                    
                    </Box>
                    <Heading textAlign={'center'}>More Coming Soon...</Heading>
                </Box>
            }
        </Box>
            
        </ChakraProvider>
    )
}
