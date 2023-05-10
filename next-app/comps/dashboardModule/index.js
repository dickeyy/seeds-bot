import { Box, Button, ChakraProvider, Grid, Heading, Hide, Image, Input, InputGroup, InputRightAddon, InputRightElement, Show, Spinner, Text, useColorMode, useColorModeValue, useToast } from '@chakra-ui/react'
import { FiSettings } from 'react-icons/fi'
import theme from '../../styles/theme.js'

export default function DashboardModule(props) {

    return (
        <Box 
            theme={theme}
            display={'flex'}
            flexDirection={'column'}
            bgColor={'#161515'}
            borderRadius={'10px'}
            width={'100%'}
            maxWidth={'800px'}
            p={'1.5rem'}
            mb={'2rem'}
            mr={'1rem'}
            borderColor={'#2f2f2f'}
            borderWidth={'2px'}
        >
            
            <Box
                borderBottom={'2px solid #2f2f2f'}
                mb={'1rem'}
                flexDir={'row'}
                display={'flex'}
                alignItems={'center'}
                justifyContent={'flex-start'}
                width={'100%'}

            >
                {props.icon}
                <Heading
                    as={'h1'}
                    fontSize={'1.2rem'}
                    mb={'1rem'}
                    color={'brand.gray.100'}
                >
                    {props.title}
                </Heading>
            </Box>  

            {props.content}


        </Box>
    )

}