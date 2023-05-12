import Head from 'next/head'
import { Inter } from '@next/font/google'
import { Box, Button, ChakraProvider, Grid, Heading, Hide, Image, Show, Spinner, Text, useColorMode, useColorModeValue } from '@chakra-ui/react'
import { FaShieldAlt, FaStar } from 'react-icons/fa'
import { RiRadioButtonLine } from 'react-icons/ri'
import {signIn, signOut, useSession} from 'next-auth/react'
import Cookies from 'universal-cookie';

const inter = Inter({ subsets: ['latin'] })
import theme from '../../styles/theme.js'

import NavBar from '../../comps/navbar'
import React from 'react'
import axios from 'axios'
import SEOHead from '@/comps/seoHead/index.js'

export default function DashSelectServer() {
  const cookies = new Cookies();

  const page = 'dashboard'

  const [loading, setLoading] = React.useState(true)

  const { data: session } = useSession()

  const { toggleColorMode } = useColorMode();
  const text = useColorModeValue('dark', 'light');

  const [user, setUser] = React.useState(undefined)
  const [guildsJoined, setGuildsJoined] = React.useState(undefined)

  React.useEffect(() => {
    if (text === 'dark') {
        toggleColorMode()
    }
    setTimeout(() => {
      if (!session) return
      setUser(session.user)
      setGuildsJoined(session.guilds)
      setLoading(false)
    }, 2000)

  }, [session])

  return (

    <ChakraProvider theme={theme}>
      <SEOHead title={'Select Server'} description={'The easiest bot to use on Discord'} />

    <Box
      display={'flex'}
      flexDirection={'column'}
      alignItems={'center'}
      justifyContent={'center'}
      height={'fit-content'}
      mt={'5rem'}
    >
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
              Select a server
          </Heading>
          <br></br>
          <Text 
            color={'brand.gray.300'}
            fontWeight={'medium'}
            textAlign={'center'}
          >
            These are all the servers you can manage, that also have Seeds added
          </Text>
          <Box
            display={'flex'}
            flexDirection={'row'}
            justifyContent={'center'}
            alignContent={'center'}
            pr={['0', '0', '1rem', '5rem']}
            pl={['0', '0', '1rem', '5rem']}
            w={'80vw'}
            // break the flexbox when the screen is too small
            flexWrap={'wrap'}
            // make it so the top of the items are set at the top of the flexbox
            alignItems={'flex-start'}
            pt={'2rem'}

          >
            
                {loading ? (
                  <Spinner />
                ) : 
                guildsJoined.length > 0 ? guildsJoined.map((guild) => {
                  return (
                    <a
                      href={`/dashboard/${guild.id}/overview`}
                      key={guild.id}
                    >
                      <Box
                        display={'flex'}
                        flexDirection={'column'}
                        alignItems={'center'}
                        justifyContent={'center'}
                        p={5}
                        mr={5}
                        mb={5}  
                        backgroundColor={'#161515'}
                        borderRadius={'10px'}
                        textAlign={'center'}
                        w={'200px'}
                        h={'250px'}
                        transition={'all 0.2s ease-in-out'}
                        _hover={{
                            transform: 'scale(1.05)',
                            cursor: 'pointer'
                        }}
                      >
                        {guild.icon ? (
                          <Image
                            src={`https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`}
                            alt="Guild Icon"
                            width={100}
                            height={100}
                            borderRadius={'full'}
                            _hover={{
                              cursor: 'pointer'
                            }}
                          />
                        ) : (
                          <Image
                            src={`/images/no-icon.png`}
                            alt="Guild Icon"
                            width={100}
                            height={100}
                            borderRadius={'full'}
                            _hover={{
                              cursor: 'pointer'
                            }}
                          />
                        )}
                        <br></br>
                        <Text>{guild.name}</Text>
                      </Box>
                    </a>
                  )
                }) : null
                }

                <Button
                  onClick={() => {
                    signOut()
                  }}
                  colorScheme={'brand.brown'}
                  variant={'solid'}
                  size={'xl'}
                >
                  Log Out
                </Button>
                      
          </Box>
          
        </Box>
    </Box>
        
    </ChakraProvider>
  )
}
