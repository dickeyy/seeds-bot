import Head from 'next/head'
import { Inter } from '@next/font/google'
import { Box, Button, ChakraProvider, Heading, Hide, Icon, List, ListIcon, ListItem, Show, Spinner, Table, Tag, Text, Th, Thead, Tr, useColorMode, useColorModeValue } from '@chakra-ui/react'
import { RiRadioButtonLine } from 'react-icons/ri'
import { AddIcon, CheckIcon, CloseIcon, SmallAddIcon } from '@chakra-ui/icons'
import axios from 'axios'

const inter = Inter({ subsets: ['latin'] })
import theme from '../../styles/theme.js'

import React from 'react'

export default function PremiumFeatureList() {

    const handleBuy = (subType) => {
        axios.post('http://localhost:3000/api/checkout-session', {
            subType: subType
        }).then((res) => {
            console.log(res.data) 
            window.location.href = res.data.url
        })
    }

  return (

    <ChakraProvider theme={theme}>

      <Box
        h={'100vh'}
        w={'100vw'}
        bgAttachment={'fixed'}
        flexDirection={'column'}

      >
        <Box
            display={'flex'}
            flexDirection={'column'}
            justifyContent={'center'}
            mx={'auto'}
            w={'40vw'}
            textAlign={'center'}
            pt={'5rem'}
        >
            <Heading fontSize={'5xl'} color={'white'}>Feature Comparison</Heading>
            <br></br>
            <Table w={'100%'} variant="simple" colorScheme="brand.brown">
                <Thead>
                    <Tr>
                        <Th fontSize={'2xl'} color={'white'} borderBottom={'0px'}></Th>
                        <Th border={'0px'} borderBottom={'0px'} borderLeftRadius={'5px'} borderRightRadius={'5px'} borderBottomRadius={'0px'} borderColor={'brand.brown.700'} bgColor={'brand.gray.900'} fontSize={'2xl'} color={'brand.gray.50'}>Free</Th>
                        <Th border={'0px'} borderBottom={'0px'} borderLeftRadius={'5px'} borderRightRadius={'5px'} borderBottomRadius={'0px'} borderColor={'brand.brown.700'} bgColor={'brand.brown.700'} fontSize={'2xl'} color={'white'}>Premium</Th>
                    </Tr>

                    <Tr>
                        <Th borderColor={'brand.gray.900'} color={'brand.gray.100'} fontSize={'xl'}>Feature</Th>
                        <Th borderLeft={'2px'} borderColor={'brand.gray.900'} color={'brand.gray.100'}><Icon as={CloseIcon} color={'red.300'} boxSize={5} /></Th>
                        <Th borderLeft={'2px'} borderRight={'2px'} borderColor={'brand.brown.700'} color={'brand.gray.100'}><Icon as={CheckIcon} color={'green.300'} boxSize={5} /></Th>
                    </Tr>

                    <Tr>
                        <Th borderColor={'brand.gray.900'} color={'brand.gray.100'} fontSize={'xl'}>Feature</Th>
                        <Th borderLeft={'2px'} borderColor={'brand.gray.900'} color={'brand.gray.100'}><Icon as={CloseIcon} color={'red.300'} boxSize={5} /></Th>
                        <Th borderLeft={'2px'} borderRight={'2px'} borderColor={'brand.brown.700'} color={'brand.gray.100'}><Icon as={CheckIcon} color={'green.300'} boxSize={5} /></Th>
                    </Tr>

                    <Tr>
                        <Th borderColor={'brand.gray.900'} color={'brand.gray.100'} fontSize={'xl'}>Feature</Th>
                        <Th borderLeft={'2px'} borderColor={'brand.gray.900'} color={'brand.gray.100'}><Icon as={CloseIcon} color={'red.300'} boxSize={5} /></Th>
                        <Th borderLeft={'2px'} borderRight={'2px'} borderColor={'brand.brown.700'} color={'brand.gray.100'}><Icon as={CheckIcon} color={'green.300'} boxSize={5} /></Th>
                    </Tr>

                    <Tr>
                        <Th borderColor={'brand.gray.900'} color={'brand.gray.100'} fontSize={'xl'}>Feature</Th>
                        <Th borderLeft={'2px'} borderColor={'brand.gray.900'} color={'brand.gray.100'}><Icon as={CloseIcon} color={'red.300'} boxSize={5} /></Th>
                        <Th borderLeft={'2px'} borderRight={'2px'} borderColor={'brand.brown.700'} color={'brand.gray.100'}><Icon as={CheckIcon} color={'green.300'} boxSize={5} /></Th>
                    </Tr>

                    <Tr>
                        <Th borderColor={'brand.gray.900'} color={'brand.gray.100'} fontSize={'xl'}>Feature</Th>
                        <Th borderLeft={'2px'} borderColor={'brand.gray.900'} color={'brand.gray.100'}><Icon as={CloseIcon} color={'red.300'} boxSize={5} /></Th>
                        <Th borderLeft={'2px'} borderRight={'2px'} borderColor={'brand.brown.700'} color={'brand.gray.100'}><Icon as={CheckIcon} color={'green.300'} boxSize={5} /></Th>
                    </Tr>

                    <Tr>
                        <Th borderColor={'brand.gray.900'} color={'brand.gray.100'} fontSize={'xl'}>Feature</Th>
                        <Th borderLeft={'2px'} borderColor={'brand.gray.900'} color={'brand.gray.100'}><Icon as={CloseIcon} color={'red.300'} boxSize={5} /></Th>
                        <Th borderLeft={'2px'} borderRight={'2px'} borderColor={'brand.brown.700'} color={'brand.gray.100'}><Icon as={CheckIcon} color={'green.300'} boxSize={5} /></Th>
                    </Tr>

                    <Tr>
                        <Th borderColor={'brand.gray.900'} color={'brand.gray.100'} fontSize={'xl'}>Feature</Th>
                        <Th borderLeft={'2px'} borderColor={'brand.gray.900'} color={'brand.gray.100'}><Icon as={CloseIcon} color={'red.300'} boxSize={5} /></Th>
                        <Th borderLeft={'2px'} borderRight={'2px'} borderColor={'brand.brown.700'} color={'brand.gray.100'}><Icon as={CheckIcon} color={'green.300'} boxSize={5} /></Th>
                    </Tr>

                    <Tr>
                        <Th borderColor={'brand.gray.900'} color={'brand.gray.100'} fontSize={'xl'}>Feature</Th>
                        <Th borderLeft={'2px'} borderColor={'brand.gray.900'} color={'brand.gray.100'}><Icon as={CloseIcon} color={'red.300'} boxSize={5} /></Th>
                        <Th borderLeft={'2px'} borderRight={'2px'} borderColor={'brand.brown.700'} color={'brand.gray.100'}><Icon as={CheckIcon} color={'green.300'} boxSize={5} /></Th>
                    </Tr>

                    <Tr>
                        <Th borderColor={'brand.gray.900'} color={'brand.gray.100'} fontSize={'xl'}>Feature</Th>
                        <Th borderLeft={'2px'} borderColor={'brand.gray.900'} color={'brand.gray.100'}><Icon as={CloseIcon} color={'red.300'} boxSize={5} /></Th>
                        <Th borderLeft={'2px'} borderRight={'2px'} borderColor={'brand.brown.700'} color={'brand.gray.100'}><Icon as={CheckIcon} color={'green.300'} boxSize={5} /></Th>
                    </Tr>

                    <Tr>
                        <Th borderColor={'brand.gray.900'} color={'brand.gray.100'} fontSize={'xl'}>Feature</Th>
                        <Th borderLeft={'2px'} borderColor={'brand.gray.900'} color={'brand.gray.100'}><Icon as={CloseIcon} color={'red.300'} boxSize={5} /></Th>
                        <Th borderLeft={'2px'} borderRight={'2px'} borderColor={'brand.brown.700'} color={'brand.gray.100'}><Icon as={CheckIcon} color={'green.300'} boxSize={5} /></Th>
                    </Tr>

                    <Tr>
                        <Th border={'0px'}></Th>
                        <Th border={'0px'}></Th>
                        <Th borderLeft={'2px'} borderRight={'2px'} borderColor={'brand.brown.700'} color={'brand.gray.100'}><Button size={'lg'} w={'100%'} colorScheme={'brand.brown'} as='a' href='#pricing'>Get Premium</Button></Th>
                    </Tr>
                </Thead>
            </Table>

        </Box>
    </Box>
        
    </ChakraProvider>
  )
}
