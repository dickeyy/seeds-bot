import { Box, Button, ChakraProvider, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerHeader, DrawerOverlay, Heading, Hide, Image, Link, Show, Text, useDisclosure } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { GiHamburger, GiHamburgerMenu } from 'react-icons/gi';

import theme from '../../styles/theme.js'

export default function NavBar(props) {

    const activePage = props.active

    const [cmdsActive, setCmdsActive] = useState(false)
    const [supportActive, setSupportActive] = useState(false)
    const [size, setSize] = useState('')

    const { isOpen, onOpen, onClose } = useDisclosure()

    const handleClick = () => {
        onOpen()
    }

    useEffect(() => {
        if (activePage === 'commands') {
            setCmdsActive(true)
        } else if (activePage === 'support') {
            setSupportActive(true)
        }
    }, [])

    
  return (
    <Box theme={theme}>
      
        <Box
            display={'flex'}
            w={'90vw'}
            p={'1rem'}
            position={'fixed'}
            top={'0'}
            left={'5vw'}
            height={'fit-content'}
            backgroundColor={'rgba(180, 180, 180, 0.2)'}
            backdropFilter={'blur(10px)'}
            boxShadow={'rgba(28, 28, 28, 0.2) 0px 0px 10px'}
            borderRadius={'8px'}
            margin={'1rem auto'}
            zIndex={'1'}
        >

            <a href='/' >            
                <Box
                    display={'flex'}
                    alignItems={'center'}
                    justifyContent={'center'}
                    w={'fit-content'}
                    h={'fit-content'}
                    left={'0'}
                >
                    <Image src={'/images/seeds-logo-removebg.png'} alt={'logo'} w={'2.5rem'} h={'2.5rem'} p={0} />

                    <Hide breakpoint='(max-width: 340px)'>
                        <Text
                            fontSize={'1.5rem'}
                            fontWeight={'bold'}
                            ml={'0.5rem'}
                        >
                            Seeds
                        </Text>
                    </Hide>
                </Box>
            </a>


            <Hide breakpoint='(max-width: 530px)'>
                <Box 
                    display={'flex'}
                    alignItems={'center'}
                    justifyContent={'center'}
                    w={'fit-content'}
                    h={'fit-content'}
                    // put this on the right side
                    position={'absolute'}
                    right={'0'}
                    top={'3'}
                    pr={'1rem'}
                >
                    <a href='/support' >
                        <Text
                            fontSize={'1rem'}
                            fontWeight={supportActive ? 'bold' : 'medium'}
                            p={'0.5rem 1rem'}
                            _hover={{
                                opacity: '0.4',
                            }}
                            color={supportActive ? 'brand.brown.50' : 'white'}
                            backgroundColor={supportActive ? 'brand.brown.900' : 'rgba(0, 0, 0, 0)'}
                            borderRadius={'8px'}
                        >
                            Support
                        </Text>
                    </a>
                    {/* <a href='/commands' >
                        <Text
                            fontSize={'1rem'}
                            fontWeight={cmdsActive ? 'bold' : 'medium'}
                            p={'0.5rem 1rem'}
                            _hover={{
                                opacity: '0.4',
                            }}
                            color={cmdsActive ? 'brand.brown.50' : 'white'}
                            backgroundColor={cmdsActive ? 'brand.brown.900' : 'rgba(0, 0, 0, 0)'}
                            borderRadius={'8px'}
                        >
                            Commands
                        </Text>
                    </a> */}
                    <a href='/invite' target={'_blank'} >
                        <Button 
                            colorScheme={'brand.brown'} 
                            variant={'solid'} 
                            size={'lg'}
                            fontSize={'1rem'}
                            fontWeight={'bold'}
                            p={'0.5rem 1.5rem'}
                            borderRadius={'8px'}
                            ml={'1rem'}
                        >
                            Invite
                        </Button>
                    </a>
                </Box>
            </Hide>

            <Show breakpoint='(max-width: 530px)'>
                <Box 
                    display={'flex'}
                    position={'absolute'}
                    right={'0'}
                    mr={'1rem'}
                >
                    <Button
                        onClick={() => handleClick(size)}
                        key={size}
                        pr={1}
                        leftIcon={<GiHamburgerMenu />} 
                    ></Button>

                    <a href='/invite' target={'_blank'} >
                        <Button
                            colorScheme={'brand.brown'} 
                            variant={'solid'} 
                            size={'md'}
                            fontSize={'1rem'}
                            fontWeight={'bold'}
                            p={'0.5rem 1.5rem'}
                            borderRadius={'8px'}
                            ml={'1rem'}
                        >
                            Invite
                        </Button>
                    </a>

                    <Drawer onClose={onClose} isOpen={isOpen} size={'xs'}>
                        <DrawerOverlay />
                        <DrawerContent 
                            backgroundColor={'#595755'}
                        >
                            <DrawerCloseButton />
                            <DrawerHeader fontSize={50} fontWeight={700}>Menu</DrawerHeader>
                            <DrawerBody>
                                <a href='/support'>
                                    <Link fontSize={30} fontWeight={700}>
                                        Support
                                    </Link>
                                </a>
                                <Box w={10} />
                                {/* <a href='/commands'>
                                    <Link fontSize={30} fontWeight={700}>
                                        Commands
                                    </Link>
                                </a> */}
                            </DrawerBody>
                        </DrawerContent>
                    </Drawer>
                </Box>
            </Show>
        </Box>
        
    </Box>
  )
}
