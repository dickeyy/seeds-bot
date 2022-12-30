import { Box, Button, ButtonGroup, ChakraProvider, Heading, Text } from "@chakra-ui/react";
import { NavLink } from "react-router-dom";

import theme from '../theme';

function HomePage() {
    return (
        <ChakraProvider theme={theme}>
            <Box
                textAlign={'center'}
                justifyContent={'center'}
                alignItems={'center'}
                display={'flex'}
                flexDirection={'column'}
                height={'100vh'}
            >
                <Heading
                    color={'brand.orange.500'}
                    fontSize={['7xl', '8xl', '9xl']}
                    fontWeight={'extrabold'}
                >
                    Seeds
                </Heading>
                
                <Text
                    color={'brand.gray.500'}
                    fontSize={['xl', '2xl', '3xl']}
                    fontWeight={'bold'}
                >
                    The easiest to use Discord Bot
                </Text>
                
                <a href={'https://seedsbot.xyz/invite'} target="_blank" rel="noreferrer">
                    <Button 
                        colorScheme={"brand.orange"} 
                        fontSize={['2xl', '3xl', '4xl']}
                        padding={'2rem'}
                        mt={'2rem'}
                    >
                        Invite
                    </Button>
                </a>

                <ButtonGroup
                    mt={'2rem'}
                    spacing={'2rem'}
                >
                    <NavLink to={'/dashboard'}>
                        <Button
                            colorScheme={"brand.orange"}
                            size={'lg'}
                            variant={'outline'}
                        >
                            Dashboard
                        </Button>
                    </NavLink>

                    <a href={'https://seedsbot.xyz/support'} target="_blank" rel="noreferrer">
                        <Button
                            colorScheme={"brand.orange"}
                            size={'lg'}
                            variant={'outline'}
                        >
                            Support
                        </Button>
                    </a>
                </ButtonGroup>

            </Box>
        </ChakraProvider>
    );
};

export default HomePage;