import Head from 'next/head'
import { Inter } from '@next/font/google'
import { Box, Button, ChakraProvider, Heading, Hide, Image, List, Icon, ListIcon, ListItem, Show, Spinner, Tag, Text, useColorMode, useColorModeValue } from '@chakra-ui/react'
import { AddIcon, ArrowDownIcon, SmallAddIcon } from '@chakra-ui/icons'
import axios from 'axios'

const inter = Inter({ subsets: ['latin'] })
import theme from '../../styles/theme.js'

import React from 'react'

export default function HeroPremium() {

    const handleBuy = (subType) => {
        // axios.post('http://localhost:3000/api/checkout-session', {
        //     subType: subType
        // }).then((res) => {
        //     console.log(res.data) 
        //     window.location.href = res.data.url
        // })
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
            w={'100vw'}
            textAlign={'center'}
            pt={'20vh'}
            id={'pricing'}

        >
                
            <Box
                display={'flex'}
                flexDirection={'row'}
                justifyContent={'center'}
                alignItems={'center'}
                w={'100vw'}
            >
                <Box
                    bgColor={'#161515'}
                    w={'23.5rem'}
                    h={'50vh'}
                    display={'flex'}
                    borderRadius={'10px'}
                    flexDirection={'column'}
                    transition='all 0.2s ease-in-out'
                    textAlign={'left'}
                    p={'1.5rem'}
                    _hover={{
                        zIndex: '1',
                        boxShadow: '0 0 0px 5px #d79a61',
                        border: '1px solid rgba(255, 255, 255, 0.18)',
                        transform: 'scale(1.05)',
                    }}
                >
                    <Text
                        color={'white'}
                        fontSize={'4xl'}
                        fontWeight={'bold'}
                    >
                        Montly
                    </Text>
                    <br></br>
                    <Box
                        display={'flex'}
                        bgGradient={'linear(to-r, brand.brown.700, brand.brown.100)'}
                        bgClip={'text'}
                        w={'100%'}
                        h={'10vh'}
                    >
                        <Text
                            fontSize={'6xl'}
                            fontWeight={'bold'}
                        >
                            7.00 USD
                        </Text>
                    </Box>
                    <Text
                        fontSize={'lg'}
                        fontWeight={'medium'}
                        color={'brand.gray.300'}
                        mt={'-1rem'}
                    >
                        USD / Month + tax
                    </Text>

                    <br></br>

                    <List>
                        <ListItem 
                            color={'brand.gray.50'}
                            fontSize={'lg'}
                            fontWeight={'medium'}
                        >
                            <ListIcon color={'brand.brown.500'} as={SmallAddIcon} />
                            Access to all premium features
                        </ListItem>

                        <ListItem 
                            color={'brand.gray.50'}
                            fontSize={'lg'}
                            fontWeight={'medium'}
                        >
                            <ListIcon color={'brand.brown.500'} as={SmallAddIcon} />
                            Community server exclusive perks
                        </ListItem>

                        <ListItem 
                            color={'brand.gray.50'}
                            fontSize={'lg'}
                            fontWeight={'medium'}
                        >
                            <ListIcon color={'brand.brown.500'} as={SmallAddIcon} />
                            Elevated support priority
                        </ListItem>

                        <ListItem 
                            color={'brand.gray.50'}
                            fontSize={'lg'}
                            fontWeight={'medium'}
                        >
                            <ListIcon color={'brand.brown.500'} as={SmallAddIcon} />
                            Reduced command cooldowns
                        </ListItem>

                        <ListItem 
                            color={'brand.gray.50'}
                            fontSize={'lg'}
                            fontWeight={'medium'}
                        >
                            <ListIcon color={'brand.brown.500'} as={SmallAddIcon} />
                            Support the development of Seeds
                        </ListItem>
                    </List>

                    <br></br>
                    
                    <Button onClick={() => {
                        handleBuy('monthly')
                    }} disabled colorScheme={'brand.brown'} variant={'outline'} size={'lg'} mt={'1rem'} w={'100%'}>Upgrade</Button>
                
                </Box>

                <Box
                    bgColor={'#161515'}
                    w={'27rem'}
                    h={'55vh'}
                    display={'flex'}
                    borderRadius={'10px'}
                    flexDirection={'column'}
                    transition='all 0.2s ease-in-out'
                    textAlign={'left'}
                    p={'1.5rem'}
                    // make it look like its glowing gold
                    // boxShadow={'0 0 40px 5px #d79a61'}
                    // blur only the edges of the box
                    // backdropFilter={'blur(10px)'}
                    // make the box look like its glowing
                    // border={'1px solid rgba(255, 255, 255, 0.18)'}
                    mr={'1rem'}
                    ml={'1rem'}
                    _hover={{
                        boxShadow: '0 0 0px 5px #d79a61',
                        border: '1px solid rgba(255, 255, 255, 0.18)',
                        transform: 'scale(1.05)',
                    }}
                >
                    <Box
                        display={'flex'}
                        flexDirection={'row'}
                        alignItems={'center'}
                    >
                        <Text
                            color={'white'}
                            fontSize={'4xl'}
                            fontWeight={'bold'}
                        >
                            Yearly
                        </Text>
                        <Tag
                            size={'lg'}
                            colorScheme={'brand.brown'}
                            ml={'1rem'}
                        >
                            28% off
                        </Tag>
                    </Box>
                    <br></br>
                    <Box
                        display={'flex'}
                        bgGradient={'linear(to-r, brand.brown.700, brand.brown.100)'}
                        bgClip={'text'}
                        w={'100%'}
                        h={'10vh'}
                    >
                        <Text
                            fontSize={'6xl'}
                            fontWeight={'bold'}
                        >
                            5.00 USD
                        </Text>
                    </Box>
                    <Box 
                        display={'flex'}
                        flexDirection={'row'}
                        alignItems={'center'}
                    >
                        <Text
                            fontSize={'lg'}
                            fontWeight={'medium'}
                            color={'brand.gray.300'}
                            mt={'-1rem'}
                        >
                            USD / Month / Year + tax | $60.00 USD / Year
                        </Text>
                    </Box>
                    <br></br>
                    
                    <List>
                        <ListItem 
                            color={'brand.gray.50'}
                            fontSize={'xl'}
                            fontWeight={'medium'}
                        >
                            <ListIcon color={'brand.brown.500'} as={SmallAddIcon} />
                            Access to all premium features
                        </ListItem>

                        <ListItem 
                            color={'brand.gray.50'}
                            fontSize={'xl'}
                            fontWeight={'medium'}
                        >
                            <ListIcon color={'brand.brown.500'} as={SmallAddIcon} />
                            Community server exclusive perks
                        </ListItem>

                        <ListItem 
                            color={'brand.gray.50'}
                            fontSize={'xl'}
                            fontWeight={'medium'}
                        >
                            <ListIcon color={'brand.brown.500'} as={SmallAddIcon} />
                            Elevated support priority
                        </ListItem>

                        <ListItem 
                            color={'brand.gray.50'}
                            fontSize={'xl'}
                            fontWeight={'medium'}
                        >
                            <ListIcon color={'brand.brown.500'} as={SmallAddIcon} />
                            Reduced command cooldowns
                        </ListItem>

                        <ListItem 
                            color={'brand.gray.50'}
                            fontSize={'xl'}
                            fontWeight={'medium'}
                        >
                            <ListIcon color={'brand.brown.500'} as={SmallAddIcon} />
                            Support the development of Seeds
                        </ListItem>
                    </List>
                    
                    <br></br>
                    <Button onClick={() => {
                        handleBuy('yearly')
                    }} disabled colorScheme={'brand.brown'} variant={'solid'} size={'lg'} mt={'1rem'} w={'100%'}>Upgrade</Button>
                
                </Box>

                <Box
                    bgColor={'#161515'}
                    w={'23.5rem'}
                    h={'50vh'}
                    display={'flex'}
                    borderRadius={'10px'}
                    flexDirection={'column'}
                    transition='all 0.2s ease-in-out'
                    textAlign={'left'}
                    p={'1.5rem'}
                    _hover={{
                        zIndex: '1',
                        boxShadow: '0 0 0px 5px #d79a61',
                        border: '1px solid rgba(255, 255, 255, 0.18)',
                        transform: 'scale(1.05)',
                    }}
                >
                    <Box
                        display={'flex'}
                        flexDirection={'row'}
                        alignItems={'center'}
                    >
                        <Text
                            color={'white'}
                            fontSize={'4xl'}
                            fontWeight={'bold'}
                        >
                            Lifetime
                        </Text>
                        <Tag
                            size={'lg'}
                            colorScheme={'brand.brown'}
                            ml={'1rem'}
                        >
                            Most Popular
                        </Tag>
                    </Box>
                    <br></br>
                    <Box
                        display={'flex'}
                        bgGradient={'linear(to-r, brand.brown.700, brand.brown.100)'}
                        bgClip={'text'}
                        w={'100%'}
                        h={'10vh'}
                    >
                        <Text
                            fontSize={'6xl'}
                            fontWeight={'bold'}
                        >
                            99.99 USD
                        </Text>
                    </Box>
                    <Text
                        fontSize={'lg'}
                        fontWeight={'medium'}
                        color={'brand.gray.300'}
                        mt={'-1rem'}
                    >
                        USD + tax | Payed once
                    </Text>

                    <br></br>

                    <List>
                        <ListItem 
                            color={'brand.gray.50'}
                            fontSize={'lg'}
                            fontWeight={'medium'}
                        >
                            <ListIcon color={'brand.brown.500'} as={SmallAddIcon} />
                            Access to all premium features
                        </ListItem>

                        <ListItem 
                            color={'brand.gray.50'}
                            fontSize={'lg'}
                            fontWeight={'medium'}
                        >
                            <ListIcon color={'brand.brown.500'} as={SmallAddIcon} />
                            Community server exclusive perks
                        </ListItem>

                        <ListItem 
                            color={'brand.gray.50'}
                            fontSize={'lg'}
                            fontWeight={'medium'}
                        >
                            <ListIcon color={'brand.brown.500'} as={SmallAddIcon} />
                            Elevated support priority
                        </ListItem>

                        <ListItem 
                            color={'brand.gray.50'}
                            fontSize={'lg'}
                            fontWeight={'medium'}
                        >
                            <ListIcon color={'brand.brown.500'} as={SmallAddIcon} />
                            Reduced command cooldowns
                        </ListItem>

                        <ListItem 
                            color={'brand.gray.50'}
                            fontSize={'lg'}
                            fontWeight={'medium'}
                        >
                            <ListIcon color={'brand.brown.500'} as={SmallAddIcon} />
                            Support the development of Seeds
                        </ListItem>
                    </List>

                    <br></br>
                    <Button  onClick={() => {
                        handleBuy('lifetime')
                    }} colorScheme={'brand.brown'} variant={'outline'} size={'lg'} mt={'1rem'} w={'100%'}>Upgrade</Button>
                
                </Box>

            </Box>

            <Text
                color={'brand.gray.300'}
                fontSize={'3xl'}
                fontWeight={'medium'}
                mt={'7rem'}
            >
                See all benefits <Icon as={ArrowDownIcon} />
            </Text>

        </Box>
    </Box>
        
    </ChakraProvider>
  )
}
