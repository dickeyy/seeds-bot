import * as React from 'react';
import { ChakraProvider, Text, Link, Badge, Button, Box, Image, ColorModeScript } from '@chakra-ui/react';
import '../css/App.css'
import { NavLink } from "react-router-dom";
import Logo from  '../images/logo.png'
import theme from '../theme';


function Header() {

  return (
    <ChakraProvider theme={theme} backgroundColor={'#1A202C'}>
      <Box 
        w={'90vw'} 
        p={'1.5rem'}
        pb={'3rem'}
        mt={'1rem'}
        position={"sticky"}
        top={'0'}
        height={'fit-content'}
        backgroundColor={'rgba(180, 180, 180, 0.2)'}
        backdropFilter={'blur(10px)'}
        boxShadow={'rgba(28, 28, 28, 0.2) 0px 0px 10px'}
        borderRadius={'13px'}
        >
            <Box
                width={'20%'}
                justifyContent={'right'}
                right={'10px'}
                position={'absolute'}
                alignItems={'center'}
            >
                <NavLink to={'/admin/guilds'}>
                    <Link mr={3}>
                        Guilds
                    </Link>
                </NavLink>

                <NavLink to={'/admin/commands'}>
                    <Link mr={3}>
                        Commands
                    </Link>
                </NavLink>

                <NavLink to={'/admin/economy'}>
                    <Link mr={3}>
                        Economy
                    </Link>
                </NavLink>

                
            </Box>

            <Box
                width={'20%'}
                justifyContent={'left'}
                left={'10px'}
                position={'absolute'}
                alignItems={'center'}
                display={'flex'}
                flexDirection={'row'}
            >

                <NavLink to={'/'}>
                    <Link>
                        <a>
                            <Image w={'15%'} mt={'-29px'} justifyContent={'left'} pos={'absolute'} left={'10px'} alignItems={'center'} src={Logo} alt='logo' />
                        </a>
                    </Link>
                </NavLink>
                <Text fontSize={25} ml={20} mr={2} fontWeight={800} mt={'-2.5'}>Seeds</Text>

                <Badge variant='solid' colorScheme='orange' mt={-1.5}>
                    Beta
                </Badge>
            </Box>
      </Box>
    </ChakraProvider>
  );
}

export default Header;