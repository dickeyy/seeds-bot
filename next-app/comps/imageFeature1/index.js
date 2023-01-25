import Head from 'next/head'
import { Inter } from '@next/font/google'
import { Box, ChakraProvider, Heading, Image, Text, useColorMode, useColorModeValue } from '@chakra-ui/react'
import { FaShieldAlt, FaStar } from 'react-icons/fa'
import { RiRadioButtonLine } from 'react-icons/ri'

const inter = Inter({ subsets: ['latin'] })
import theme from '../../styles/theme.js'
import React from 'react'

export default function ImageFeature1(props) {

  return (

    <Box
        display={'flex'}
        flexDir={['column','column','column','row']}
        justifyContent={'center'}
        alignItems={'center'}
        textAlign={'center'}
    >
        <Box 
            display={'flex'}
            flexDirection={'column'}
            justifyContent={'center'}
            alignItems={'center'}
            textAlign={'center'}
            w={['25rem','25rem','25rem','30rem']}
            mb={['2rem','2rem','2rem','0']}
        >
            <Heading
                fontSize={['3xl','4xl','5xl','5xl']}
            >
                {props.title}
            </Heading>
            <br></br>
            <Text
                color={'brand.gray.300'}
                fontSize={['md','md','lg','lg']}
                pr={['2rem','2rem','0','0']}
                pl={['2rem','2rem','0','0']}
            >
                {props.text}
            </Text>
        </Box>
        <Box w={'10vw'} />
        <Image src={props.image} borderRadius={'10px'} ml={['2','2','2','0']} />
    </Box>
  )
}
