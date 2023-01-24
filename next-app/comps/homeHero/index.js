import Head from 'next/head'
import { Inter } from '@next/font/google'
import { Box, ChakraProvider, Heading, Text } from '@chakra-ui/react'

const inter = Inter({ subsets: ['latin'] })
import theme from '../../styles/theme.js'

export default function Hero() {

  return (
    <ChakraProvider theme={theme}>
      
        <Box
            display={'flex'}
            w={'100vw'}
            h={'100vh'}
            position={'absolute'}
            top={'0'}
            zIndex={'-1'}
            bgGradient={'linear(to-r, brand.brown.500, brand.brown.400, brand.brown.300, brand.brown.200, brand.brown.100)'}
        >

        </Box>
        
    </ChakraProvider>
  )
}
