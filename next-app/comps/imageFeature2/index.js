import Head from 'next/head'
import { Inter } from '@next/font/google'
import { Box, ChakraProvider, Heading, Image, Text, useColorMode, useColorModeValue } from '@chakra-ui/react'
import { FaShieldAlt, FaStar } from 'react-icons/fa'
import { RiRadioButtonLine } from 'react-icons/ri'

const inter = Inter({ subsets: ['latin'] })
import theme from '../../styles/theme.js'
import React from 'react'

export default function ImageFeature2(props) {

  return (

    <Box
        display={'flex'}
        flexDir={'row'}
        justifyContent={'center'}
        alignItems={'center'}
        textAlign={'center'}
        w={'100vw'}
    >
        
        <Image src={props.image} borderRadius={'10px'} />
        <Box w={'10vw'} />
        <Box 
        display={'flex'}
        flexDirection={'column'}
        justifyContent={'center'}
        alignItems={'center'}
        textAlign={'center'}
        w={'30rem'}
        >
            <Heading
                fontSize={'5xl'}
            >
                {props.title}
            </Heading>
            <br></br>
            <Text
                color={'brand.gray.300'}
                fontSize={'lg'}
            >
                {props.text}
            </Text>
        </Box>
    </Box>
  )
}
