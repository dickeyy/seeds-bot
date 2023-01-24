import Head from 'next/head'
import { Inter } from '@next/font/google'
import { background, Box, Button, ButtonGroup, ChakraProvider, Heading, Image, Text } from '@chakra-ui/react'
import dynamic from 'next/dynamic.js'

const inter = Inter({ subsets: ['latin'] })
import theme from '../../styles/theme.js'

import Discord from '../heroDiscord/index.js'
import React from 'react'

const Messages = dynamic(() => import('../heroDiscord'), { ssr: false });

export default function Hero() {

    // make the background move with the mouse
    const [bgPos, setBgPos] = React.useState({ x: 0, y: 0 });
    React.useEffect(() => {
        const handleMouseMove = (e) => {
            // make the background drift a little bit when the mouse stops moving
            setBgPos({
                x: e.clientX / window.innerWidth * 15,
                y: e.clientY / window.innerHeight * 15,
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
            bgBlendMode={'overlay'}
            bgColor={'rgba(0,0,0,0.6)'}
            flexDirection={'row'}

            bgPosition={`${bgPos.x}% ${bgPos.y}%`}
        >

            <Box
                display={'flex'}
                alignItems={'center'}
                justifyContent={'center'}
                textAlign={['center', 'center', 'left', 'left']}
                w={['100vw', '100vw', '50vw', '50vw']}
                h={'80vh'}
                pl={['1', '1', '10vw', '10vw']}
                flexDirection={'column'}
            >

                <Heading as={'h1'} fontSize={'7xl'}>
                    The <Heading as={'span'} fontSize={'7xl'} color={'brand.brown.500'}>easiest</Heading> bot to use on Discord
                </Heading>

                <Text fontSize={'xl'} pr={['2','2','0','0']} pl={['2','2','0','0']} w={['100vw', '100vw', '40vw', '40vw']}  mt={'8'} fontWeight={'medium'} color={'brand.gray.300'}>
                    Moderation, fun, utility, and economy. <Text as={'span'} color={'brand.brown.900'} fontWeight={'bold'}>Seeds</Text> has it all!
                </Text>

                <ButtonGroup w={['100vw', '100vw', '40vw', '40vw']} mt={'8'} spacing={'4'}>
                    <a href='/invite' target={'_blank'}>
                        <Button colorScheme={'brand.brown'} variant={'solid'} size={'lg'} fontSize={'3xl'} fontWeight={'bold'} p={'2.2rem 5rem'}>Invite</Button>
                    </a>
                    <a href='/support' target={'_blank'}>
                        <Button colorScheme={'brand.brown'} variant={'outline'} size={'lg'} fontSize={'3xl'} fontWeight={'bold'} p={'2.2rem 5rem'}>Support</Button>
                    </a>
                </ButtonGroup>

            </Box>      

            

            <Box
                display={'flex'}
                alignItems={'center'}
                justifyContent={'center'}
                w={['100vw', '100vw', '50vw', '50vw']}
                h={'20vh'}
                pr={['1', '1', '10vw', '10vw']}
                ml={'5rem'}
                flexDirection={'column'}
                mt={'19rem'}
                borderRadius={'10px'}
            >
                    <Messages />

            </Box>

        </Box>       

    </ChakraProvider>
  )
}
