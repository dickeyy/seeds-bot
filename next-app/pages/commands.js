import Head from 'next/head'
import { Inter } from '@next/font/google'
import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Box, ChakraProvider, Code, Heading, Tab, TabList, TabPanel, TabPanels, Tabs, Text, useColorMode, useColorModeValue } from '@chakra-ui/react'

const inter = Inter({ subsets: ['latin'] })
import theme from '../styles/theme.js'

import NavBar from '../comps/navbar'
import React from 'react'

export default function CommandsPage() {

  const page = 'commands'

  const { toggleColorMode } = useColorMode();
  const text = useColorModeValue('dark', 'light');
  const modCmds = [
    {
      name: 'ban',
      description: 'Bans a user from the server',
      usage: '/ban <user> [reason] [delete hours]',
      perms: 'BAN_MEMBERS',
    },
    {
      name: 'unban',
      description: 'Unbans a user from the server',
      usage: '/unban <user> [reason]',
      perms: 'BAN_MEMBERS',
    }, 
    {
      name: 'kick',
      description: 'Kicks a user from the server',
      usage: '/kick <user> [reason]',
      perms: 'KICK_MEMBERS',
    },
    {
      name: 'warn',
      description: 'Warns a user in the server',
      usage: '/warn <user> [reason]',
      perms: 'MODERATE_MEMBERS',
    },
    {
      name: 'cases',
      description: 'Shows the cases of a user',
      usage: '/cases <user>',
      perms: 'MODERATE_MEMBERS',
    }, 
    {
      name: 'deletecase',
      description: 'Deletes a specific case for a user',
      usage: '/deletecase <user> <case number>',
      perms: 'MODERATE_MEMBERS',
    }, 
    {
      name: 'setreportchannel',
      description: 'Sets the report channel for the server',
      usage: '/setreportchannel <channel>',
      perms: 'MODERATE_MEMBERS',
    }, 
    {
      name: 'report',
      description: 'Reports a user to the server',
      usage: '/report <reason> [user]',
      perms: 'None',
    },
    {
      name: 'log set_channel',
      description: 'Set a log type to a channel',
      usage: '/log set_channel <type> <channel>',
      perms: 'MODERATE_MEMBERS',
    },
    {
      name: 'log toggle',
      description: 'Toggle a log type',
      usage: '/log toggle <category> <event>',
      perms: 'MODERATE_MEMBERS',
    }, 
    {
      name: 'purge all',
      description: 'Purge all messages in the current channel',
      usage: '/purge all <amount>',
      perms: 'MODERATE_MEMBERS',
    },
    {
      name: 'purge user',
      description: 'Purge all messages from a specific user in the current channel',
      usage: '/purge user <user> <amount>',
      perms: 'MODERATE_MEMBERS',
    },
    {
      name: 'purge contains',
      description: 'Purge all messages that contain a specific string in the current channel',
      usage: '/purge contains <string> <amount>',
      perms: 'MODERATE_MEMBERS',
    },
    {
      name: 'purge bot',
      description: 'Purge all messages from bots in the current channel',
      usage: '/purge bot <amount>',
      perms: 'MODERATE_MEMBERS',
    },
    {
      name: 'purge embeds',
      description: 'Purge all messages with embeds in the current channel',
      usage: '/purge embeds <amount>',
      perms: 'MODERATE_MEMBERS',
    }, 
    {
      name: 'purge emoji',
      description: 'Purge all messages with a specific emoji in the current channel',
      usage: '/purge emoji <emoji> <amount>',
      perms: 'MODERATE_MEMBERS',
    },
    {
      name: 'purge attachments',
      description: 'Purge all messages with attachments in the current channel',
      usage: '/purge attachments <amount>',
      perms: 'MODERATE_MEMBERS',
    },
    {
      name: 'purge seeds',
      description: 'Purge all messages from Seeds in the current channel',
      usage: '/purge seeds <amount>',
      perms: 'MODERATE_MEMBERS',
    },
    {
      name: 'lockdown',
      description: 'Lockdown the current channel or a specified channel',
      usage: '/lockdown [channel]',
      perms: 'MODERATE_MEMBERS', 
    },
    {
      name: 'unlock',
      description: 'Unlock the current channel or a specified channel',
      usage: '/unlock [channel]',
      perms: 'MODERATE_MEMBERS',
    }
  ]
  const econCmds = [
    {
      name: 'balance',
      description: 'Check you SeedCoin balance',
      usage: '/balance',
      perms: 'None',
    },
    { 
      name: 'beg', 
      description: 'Beg Seeds for some coins (has varrying results)',
      usage: '/beg',
      perms: 'None',
    },
    { 
      name: 'daily', 
      description: 'Claim your daily SeedsCoin',
      usage: '/daily',
      perms: 'None',
    },
    { 
      name: 'highlow', 
      description: 'Guess if a secret number is higher or lower than another, guess right and get some SeedCoin',
      usage: '/highlow',
      perms: 'None',
    },
    { 
      name: 'slots', 
      description: 'Bet some coins in the slot machine', 
      usage: '/slots <bet >= 100>',
      perms: 'None',
      
    },
    { 
      name: 'rps', 
      description: 'Play Seeds in a game of rock paper scissors', 
      usage: '/rps <bet> <move>',
      perms: 'None',
    },
    { 
      name: 'shop', 
      description: 'See items that are avaliable for purchase',
      usage: '/shop',
      perms: 'None',
    },
    { 
      name: 'buy', 
      description: 'Buy something from the shop', 
      usage: '/buy <item id>',
      perms: 'None',
    },
    { 
      name: 'fish', 
      description: 'Cast your pole out and hope for a bite',
      usage: '/fish',
      perms: 'None',
    },
    { 
      name: 'vote', 
      description: 'Vote for Seeds on top.gg and get 1000 SeedCoins',
      usage: '/vote',
      perms: 'None',
    },
    { 
      name: 'mine', 
      description: 'Use your pickaxe to find some ore and get some coins. (Watch for lava)',
      usage: '/mine',
      perms: 'None',
    },
  ]
  const gamesCmds = [
    {
      name: 'tictactoe',
      description: 'Play a game of tictactoe with a friend',
      usage: '/tictactoe <user>',
      perms: 'None',
    }
  ]
  const funCmds = [
    { 
      name: 'friend', 
      description: 'Talk to an AI friend', 
      usage: '/friend <message>',
      perms: 'None',
    },
    { 
      name: 'tsh', 
      description: 'Make a 2 sentence horror story based on a given topic', 
      usage: '/tsh <topic>',
      perms: 'None',
    },
    { 
      name: 'poll', 
      description: 'Send a poll for 2 options in the server', 
      usage: '/poll <option 1> <option 2>',
      perms: 'None',
    },
    { 
      name: 'coinflip', 
      description: 'Flip a coin',
      usage: '/coinflip',
      perms: 'None',
    },
    {
      name: 'lovetest',
      description: 'Test the love between you and another user',
      usage: '/lovetest <user>',
      perms: 'None',
    },
    {
      name: 'todayinhistory',
      description: 'Get a random event that happened on this day in history',
      usage: '/todayinhistory',
      perms: 'None',
    },
    {
      name: 'weather',
      description: 'Get the weather for a given location',
      usage: '/weather <location>',
      perms: 'None',
    },
  ]
  const utilCmds = [
    { 
      name: 'stats', 
      description: 'Get some cool stats about the bot',
      usage: '/stats',
      perms: 'None',
    },
    { 
      name: 'rcolor', 
      description: 'Generate a random color (with hex code)',
      usage: '/rcolor',
      perms: 'None',
    },
    { 
      name: 'botidea', 
      description: 'Suggest an idea to the devs (Your idea is publicly viewed and voted on in the support server)', 
      usage: '/botidea <idea>',
      perms: 'None',
    },
    {
      name: 'qr',
      description: 'Generate a QR code for a given URL',
      usage: '/qr <url>',
      perms: 'None',
    },
    {
      name: 'alert',
      description: 'View active alerts from the developers',
      usage: '/alert',
      perms: 'None',
    },
  ]

  React.useEffect(() => {
    if (text === 'dark') {
        toggleColorMode()
    }
  }, [])

  return (
    <ChakraProvider theme={theme}>
      <Head>
      <title>Seeds | Commands</title>
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
            justifyContent={'center'}
            w={'100vw'}
            textAlign={'center'}
            pt={'20vh'}
        >
            <Heading as={'h1'}
                fontSize={'5xl'}
            >
                Commands
            </Heading>
            <Text color={'brand.gray.300'}>
              {"[parameter] = optional, <parameter> = required"}
            </Text>
            <br></br>
            <br></br>
            <br></br>

            <Box
                display={'flex'}
                flexDirection={'column'}
                justifyContent={'center'}
                alignItems={'center'}
                w={'100vw'}
                pr={5}
                pl={5}
                
            >
              <Tabs  isFitted colorScheme={'brand.brown'} w={['120%', '120%', '70%', '70%']}>
                  <TabList overflowX={'scroll'} overflowY={'hidden'} pr={'1rem'} pl={'1rem'}>
                      <Tab>All</Tab>
                      <Tab>Moderation</Tab>
                      <Tab>Economy</Tab>
                      <Tab>Fun</Tab>
                      <Tab>Games</Tab>
                      <Tab>Utility</Tab>
                  </TabList>

                  <TabPanels>
                      <TabPanel>  
                        
                        <Accordion allowToggle>
                          {modCmds.map((cmd) => {
                            return (
                              <AccordionItem
                                border={'1px'}
                                borderColor={'transparent'}
                                bgColor={'#161515'}
                                borderRadius={'md'}
                                mb={'5'}
                                pb={'2'}
                              >
                                <h2>
                                  <AccordionButton>
                                    <Box flex="1" textAlign="left">
                                      <Text  fontSize={'3xl'} fontWeight={'medium'}>{cmd.name}</Text>
                                      <Text color={'brand.gray.200'}>{cmd.description}</Text>
                                    </Box>
                                    <AccordionIcon w={8} h={8} />
                                  </AccordionButton>
                                </h2>
                                <AccordionPanel textAlign={'left'} pb={4} pt={0}>
                                  
                                  <br></br>
                                  <Text fontWeight={'medium'} mb={'2'}>Usage: <Code>{cmd.usage}</Code></Text>
                                  <Text fontWeight={'medium'}>Required Permission: <Code>{cmd.perms}</Code></Text>
                                </AccordionPanel>
                              </AccordionItem>
                            )
                          }
                          )}
                          {econCmds.map((cmd) => {
                            return (
                              <AccordionItem
                                border={'1px'}
                                borderColor={'transparent'}
                                bgColor={'#161515'}
                                borderRadius={'md'}
                                mb={'5'}
                                pb={'2'}
                              >
                                <h2>
                                  <AccordionButton>
                                    <Box flex="1" textAlign="left">
                                      <Text  fontSize={'3xl'} fontWeight={'medium'}>{cmd.name}</Text>
                                      <Text color={'brand.gray.200'}>{cmd.description}</Text>
                                    </Box>
                                    <AccordionIcon w={8} h={8} />
                                  </AccordionButton>
                                </h2>
                                <AccordionPanel textAlign={'left'} pb={4} pt={0}>
                                  
                                  <br></br>
                                  <Text fontWeight={'medium'} mb={'2'}>Usage: <Code>{cmd.usage}</Code></Text>
                                  <Text fontWeight={'medium'}>Required Permission: <Code>{cmd.perms}</Code></Text>
                                </AccordionPanel>
                              </AccordionItem>
                            )
                          }
                          )}
                          {funCmds.map((cmd) => {
                            return (
                              <AccordionItem
                                border={'1px'}
                                borderColor={'transparent'}
                                bgColor={'#161515'}
                                borderRadius={'md'}
                                mb={'5'}
                                pb={'2'}
                              >
                                <h2>
                                  <AccordionButton>
                                    <Box flex="1" textAlign="left">
                                      <Text  fontSize={'3xl'} fontWeight={'medium'}>{cmd.name}</Text>
                                      <Text color={'brand.gray.200'}>{cmd.description}</Text>
                                    </Box>
                                    <AccordionIcon w={8} h={8} />
                                  </AccordionButton>
                                </h2>
                                <AccordionPanel textAlign={'left'} pb={4} pt={0}>
                                  
                                  <br></br>
                                  <Text fontWeight={'medium'} mb={'2'}>Usage: <Code>{cmd.usage}</Code></Text>
                                  <Text fontWeight={'medium'}>Required Permission: <Code>{cmd.perms}</Code></Text>
                                </AccordionPanel>
                              </AccordionItem>
                            )
                          }
                          )}
                          {gamesCmds.map((cmd) => {
                            return (
                              <AccordionItem
                                border={'1px'}
                                borderColor={'transparent'}
                                bgColor={'#161515'}
                                borderRadius={'md'}
                                mb={'5'}
                                pb={'2'}
                              >
                                <h2>
                                  <AccordionButton>
                                    <Box flex="1" textAlign="left">
                                      <Text  fontSize={'3xl'} fontWeight={'medium'}>{cmd.name}</Text>
                                      <Text color={'brand.gray.200'}>{cmd.description}</Text>
                                    </Box>
                                    <AccordionIcon w={8} h={8} />
                                  </AccordionButton>
                                </h2>
                                <AccordionPanel textAlign={'left'} pb={4} pt={0}>
                                  
                                  <br></br>
                                  <Text fontWeight={'medium'} mb={'2'}>Usage: <Code>{cmd.usage}</Code></Text>
                                  <Text fontWeight={'medium'}>Required Permission: <Code>{cmd.perms}</Code></Text>
                                </AccordionPanel>
                              </AccordionItem>
                            )
                          }
                          )}
                          {utilCmds.map((cmd) => {
                            return (
                              <AccordionItem
                                border={'1px'}
                                borderColor={'transparent'}
                                bgColor={'#161515'}
                                borderRadius={'md'}
                                mb={'5'}
                                pb={'2'}
                              >
                                <h2>
                                  <AccordionButton>
                                    <Box flex="1" textAlign="left">
                                      <Text  fontSize={'3xl'} fontWeight={'medium'}>{cmd.name}</Text>
                                      <Text color={'brand.gray.200'}>{cmd.description}</Text>
                                    </Box>
                                    <AccordionIcon w={8} h={8} />
                                  </AccordionButton>
                                </h2>
                                <AccordionPanel textAlign={'left'} pb={4} pt={0}>
                                  
                                  <br></br>
                                  <Text fontWeight={'medium'} mb={'2'}>Usage: <Code>{cmd.usage}</Code></Text>
                                  <Text fontWeight={'medium'}>Required Permission: <Code>{cmd.perms}</Code></Text>
                                </AccordionPanel>
                              </AccordionItem>
                            )
                          }
                          )}
                        </Accordion>

                      </TabPanel>
                      <TabPanel>
                          
                        <Accordion allowToggle>
                          {modCmds.map((cmd) => {
                            return (
                              <AccordionItem
                                border={'1px'}
                                borderColor={'transparent'}
                                bgColor={'#161515'}
                                borderRadius={'md'}
                                mb={'5'}
                                pb={'2'}
                              >
                                <h2>
                                  <AccordionButton>
                                    <Box flex="1" textAlign="left">
                                      <Text  fontSize={'3xl'} fontWeight={'medium'}>{cmd.name}</Text>
                                      <Text color={'brand.gray.200'}>{cmd.description}</Text>
                                    </Box>
                                    <AccordionIcon w={8} h={8} />
                                  </AccordionButton>
                                </h2>
                                <AccordionPanel textAlign={'left'} pb={4} pt={0}>
                                  
                                  <br></br>
                                  <Text fontWeight={'medium'} mb={'2'}>Usage: <Code>{cmd.usage}</Code></Text>
                                  <Text fontWeight={'medium'}>Required Permission: <Code>{cmd.perms}</Code></Text>
                                </AccordionPanel>
                              </AccordionItem>
                            )
                          }
                          )}
                        </Accordion>

                      </TabPanel>
                      <TabPanel>

                          <Accordion allowToggle>
                              {econCmds.map((cmd) => {
                                return (
                                  <AccordionItem
                                    border={'1px'}
                                    borderColor={'transparent'}
                                    bgColor={'#161515'}
                                    borderRadius={'md'}
                                    mb={'5'}
                                    pb={'2'}
                                  >
                                    <h2>
                                      <AccordionButton>
                                        <Box flex="1" textAlign="left">
                                          <Text  fontSize={'3xl'} fontWeight={'medium'}>{cmd.name}</Text>
                                          <Text color={'brand.gray.200'}>{cmd.description}</Text>
                                        </Box>
                                        <AccordionIcon w={8} h={8} />
                                      </AccordionButton>
                                    </h2>
                                    <AccordionPanel textAlign={'left'} pb={4} pt={0}>
                                      
                                      <br></br>
                                      <Text fontWeight={'medium'} mb={'2'}>Usage: <Code>{cmd.usage}</Code></Text>
                                      <Text fontWeight={'medium'}>Required Permission: <Code>{cmd.perms}</Code></Text>
                                    </AccordionPanel>
                                  </AccordionItem>
                                )
                              }
                              )}
                            </Accordion>

                      </TabPanel>
                      <TabPanel>
                      
                        <Accordion allowToggle>
                          {funCmds.map((cmd) => {
                            return (
                              <AccordionItem
                                border={'1px'}
                                borderColor={'transparent'}
                                bgColor={'#161515'}
                                borderRadius={'md'}
                                mb={'5'}
                                pb={'2'}
                              >
                                <h2>
                                  <AccordionButton>
                                    <Box flex="1" textAlign="left">
                                      <Text  fontSize={'3xl'} fontWeight={'medium'}>{cmd.name}</Text>
                                      <Text color={'brand.gray.200'}>{cmd.description}</Text>
                                    </Box>
                                    <AccordionIcon w={8} h={8} />
                                  </AccordionButton>
                                </h2>
                                <AccordionPanel textAlign={'left'} pb={4} pt={0}>
                                  
                                  <br></br>
                                  <Text fontWeight={'medium'} mb={'2'}>Usage: <Code>{cmd.usage}</Code></Text>
                                  <Text fontWeight={'medium'}>Required Permission: <Code>{cmd.perms}</Code></Text>
                                </AccordionPanel>
                              </AccordionItem>
                            )
                          }
                          )}
                        </Accordion>

                      </TabPanel>
                      <TabPanel>
                      
                        <Accordion allowToggle>
                          {gamesCmds.map((cmd) => {
                            return (
                              <AccordionItem
                                border={'1px'}
                                borderColor={'transparent'}
                                bgColor={'#161515'}
                                borderRadius={'md'}
                                mb={'5'}
                                pb={'2'}
                              >
                                <h2>
                                  <AccordionButton>
                                    <Box flex="1" textAlign="left">
                                      <Text  fontSize={'3xl'} fontWeight={'medium'}>{cmd.name}</Text>
                                      <Text color={'brand.gray.200'}>{cmd.description}</Text>
                                    </Box>
                                    <AccordionIcon w={8} h={8} />
                                  </AccordionButton>
                                </h2>
                                <AccordionPanel textAlign={'left'} pb={4} pt={0}>
                                  
                                  <br></br>
                                  <Text fontWeight={'medium'} mb={'2'}>Usage: <Code>{cmd.usage}</Code></Text>
                                  <Text fontWeight={'medium'}>Required Permission: <Code>{cmd.perms}</Code></Text>
                                </AccordionPanel>
                              </AccordionItem>
                            )
                          }
                          )}
                        </Accordion>

                      </TabPanel>
                      <TabPanel>
                      
                        <Accordion allowToggle>
                          {utilCmds.map((cmd) => {
                            return (
                              <AccordionItem
                                border={'1px'}
                                borderColor={'transparent'}
                                bgColor={'#161515'}
                                borderRadius={'md'}
                                mb={'5'}
                                pb={'2'}
                              >
                                <h2>
                                  <AccordionButton>
                                    <Box flex="1" textAlign="left">
                                      <Text  fontSize={'3xl'} fontWeight={'medium'}>{cmd.name}</Text>
                                      <Text color={'brand.gray.200'}>{cmd.description}</Text>
                                    </Box>
                                    <AccordionIcon w={8} h={8} />
                                  </AccordionButton>
                                </h2>
                                <AccordionPanel textAlign={'left'} pb={4} pt={0}>
                                  
                                  <br></br>
                                  <Text fontWeight={'medium'} mb={'2'}>Usage: <Code>{cmd.usage}</Code></Text>
                                  <Text fontWeight={'medium'}>Required Permission: <Code>{cmd.perms}</Code></Text>
                                </AccordionPanel>
                              </AccordionItem>
                            )
                          }
                          )}
                        </Accordion>

                      </TabPanel>
                  </TabPanels>
              </Tabs>
            </Box>
            
          
        </Box>
      </Box>
        
    </ChakraProvider>
  )
}
