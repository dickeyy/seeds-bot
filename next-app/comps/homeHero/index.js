import { Inter } from '@next/font/google'
import { background, Box, Button, ButtonGroup, ChakraProvider, Heading, Hide, Image, Spinner, Stat, StatGroup, StatLabel, StatNumber, Text } from '@chakra-ui/react'
import dynamic from 'next/dynamic.js'
import axios from 'axios'

const inter = Inter({ subsets: ['latin'] })
import theme from '../../styles/theme.js'

import Discord from '../heroDiscord/index.js'
import React from 'react'

const Messages = dynamic(() => import('../heroDiscord'), { ssr: false });

export default function Hero() {

    const [bgPos, setBgPos] = React.useState({ x: 0, y: 0 });
    const [botStats, setBotStats] = React.useState({});
    const [users, setUsers] = React.useState(0);
    const [servers, setServers] = React.useState(0);

    React.useEffect(() => {

        axios.get('https://seedsbot.xyz/api/bot-stats').then((res) => {
            setBotStats(res.data);
            setUsers(res.data.users.toLocaleString());
            setServers(res.data.guilds.toLocaleString());
        })

        const handleMouseMove = (e) => {
            setBgPos({
                x: e.clientX / window.innerWidth * 5,
                y: e.clientY / window.innerHeight * 5,
            });

        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);



  return (
    <ChakraProvider theme={theme}>
      
        <Box
            display={'flex'}
            w={'100vw'}
            h={'100vh'}
            bgImage={'url(images/Sprinkle.png)'}
            bgPos={'static'}
            bgBlendMode={'overlay'}
            bgColor={'rgba(0,0,0,0.6)'}
            // make the background parralax
            bgAttachment={'fixed'}
            flexDirection={'column'}
            bgPosition={`${bgPos.x}% ${bgPos.y}%`}
        >  

            <Box
                display={'flex'}
                flexDirection={'row'}
            >

                <Box
                    display={'flex'}
                    alignItems={'center'}
                    justifyContent={'center'}
                    textAlign={['center', 'center', 'center', 'left']}
                    w={['100vw', '100vw', '100vw', '50vw']}
                    h={'75vh'}
                    pl={['1', '1', '10vw', '10vw']}
                    mt={['2rem', '5rem', '10vh', '15vh']}
                    pt={['10rem', '8rem', '0', '0']}
                    flexDirection={'column'}
                >

                    <Heading as={'h1'} fontSize={['5xl','7xl','7xl','7xl']} pr={['5','5','5','0']} pl={['5','5','5','0']} >
                        The <Heading as={'span'} fontSize={['5xl','7xl','7xl','7xl']} color={'brand.brown.500'}>easiest</Heading> bot to use on Discord
                    </Heading>

                    <Text fontSize={'xl'} pr={['10','10','10','0']} pl={['10','10','10','0']} w={['100vw', '100vw', '100vw', '40vw']}  mt={'8'} fontWeight={'medium'} color={'brand.gray.300'}>
                        Moderation, fun, utility, and economy. <Text as={'span'} color={'brand.brown.700'} fontWeight={'bold'}>Seeds</Text> has it all!
                    </Text>

                    <ButtonGroup flexDir={['column', 'column', 'column', 'row']} w={['100vw', '100vw', '40vw', '40vw']} justifyContent={['center','center','left','left']} mt={'8'} spacing={'4'}>
                        <a href='/invite' target={'_blank'}>
                            <Button colorScheme={'brand.brown'} ml={['1rem', '1rem','0','0']} mb={'1rem'} variant={'solid'} size={'lg'} fontSize={'3xl'} fontWeight={'bold'} p={'2rem 4rem'}>Invite</Button>
                        </a>
                        <a href='/support' target={'_blank'}>
                            <Button colorScheme={'brand.brown'} variant={'outline'} size={'lg'} fontSize={'3xl'} fontWeight={'bold'} p={'2rem 4rem'}>Support</Button>
                        </a>
                    </ButtonGroup>

                    <Box zIndex={'5'} display={'flex'} flexDir={['column', 'column', 'column', 'column']} w={['100vw', '100vw', '40vw', '40vw']} justifyContent={['center','center','left','left']} mt={3} >
                        
                        {users == 0 ? <Spinner /> : 

                            <Box>
                                <Text>
                                    <Text as={'span'} fontSize={'2xl'} fontWeight={'medium'} color={'brand.gray.300'}>Helping </Text>
                                    <Text as={'span'} fontSize={'2xl'} fontWeight={'bold'} color={'brand.gray.100'}>{users}</Text>
                                    <Text as={'span'} fontSize={'2xl'} fontWeight={'medium'} color={'brand.gray.300'}> users,</Text>
                                </Text>
                                <Text>
                                    <Text as={'span'} fontSize={'2xl'} fontWeight={'medium'} color={'brand.gray.300'}>in </Text>
                                    <Text as={'span'} fontSize={'2xl'} fontWeight={'bold'} color={'brand.gray.100'}>{servers}</Text>
                                    <Text as={'span'} fontSize={'2xl'} fontWeight={'medium'} color={'brand.gray.300'}> servers</Text>
                                </Text>
                            </Box>
                        }

                    </Box>

                </Box>      

                

                <Box
                    display={'flex'}
                    alignItems={'center'}
                    justifyContent={'center'}
                    w={['100vw', '100vw', '50vw', '50vw']}
                    mt={'10rem'}
                    pr={['1', '1', '10vw', '10vw']}
                    ml={'5rem'}
                    flexDirection={'column'}
                    borderRadius={'8px'}
                >
                    <Hide below={'1000px'}>
                        <Messages stats={botStats} />
                    </Hide>

                </Box>

            </Box>
            
            <Image src={'images/Wave.png'} w={'100vw'} h={['25%', '25%', '25%', '10%']} />

        </Box>       

    </ChakraProvider>
  )
}
