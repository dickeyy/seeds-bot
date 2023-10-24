import Head from 'next/head'
import { Inter } from '@next/font/google'
import { Box, Button, ChakraProvider, Heading, Spinner, Text, useColorMode, useColorModeValue } from '@chakra-ui/react'

const inter = Inter({ subsets: ['latin'] })
import theme from '../styles/theme.js'

import NavBar from '../comps/navbar'
import React from 'react'
import SEOHead from '@/comps/seoHead/index.js'

export default function FourOhFourPage() {

  const page = 'invite'

  const { toggleColorMode } = useColorMode();
  const text = useColorModeValue('dark', 'light');

  React.useEffect(() => {
    if (text === 'dark') {
        toggleColorMode()
    }
  }, [])


  return (
    <ChakraProvider theme={theme}>
      <SEOHead title={'404'} description={'Page not found'} />

      <Box>
        <NavBar active={page}/>
        <Box
            display={'flex'}
            flexDirection={'column'}
            alignItems={'center'}
            justifyContent={'center'}
            w={'100vw'}
            h={'100vh'}
            textAlign={'center'}
            p={10}

        >
          
            <Heading as={'h1'}
                fontSize={'5xl'}
            >
                Hmm we couldn't find that page
            </Heading>
            <br></br>
            <Text
                fontSize={'xl'}
                fontWeight={'bold'}
                color={'brand.gray.500'}
            >
                Error Code: 404
            </Text>
            <br></br>
            <br></br>
            <a href={'/'}>
                <Button size={'lg'} colorScheme={'brand.brown'}>Go Back Home</Button>
            </a>

        </Box>
      </Box>
        
    </ChakraProvider>
  )
}
