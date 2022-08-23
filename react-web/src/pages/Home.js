import '../css/App.css';
import * as React from 'react'
import { ChakraProvider, Table, theme,  ThemeProvider, Thead, Tbody, Tfoot, Tr, Th, Td, TableCaption, TableContainer, Box, Stat, StatLabel, StatNumber, StatHelpText, StatArrow, StatGroup, Divider, Button, useToast, Skeleton, ColorModeScript, useColorMode, Heading, } from '@chakra-ui/react'
import { FaDiscord } from 'react-icons/fa';
import { useSearchParams } from "react-router-dom"

// Components
import Header from '../comps/Header';
import { ColorModeSwitcher } from '../ColorModeSwitcher';
// import theme from '../theme';

const discordUrl = 'https://discord.com/api/oauth2/authorize?client_id=968198214450831370&redirect_uri=http%3A%2F%2Flocalhost%3A3000&response_type=code&scope=email%20identify%20guilds%20guilds.join'

function HomePage() {

    const [isLoading, setLoading] = React.useState(false)

    let [searchParams, setSearchParams] = useSearchParams()
    const code = searchParams.get("code")

    React.useEffect(() => {
        if (code !== null) {
            setLoading(true)

            authUser(code)
        }
    })

  return (
    <Box w='20vw' theme={theme} flexDirection="column">
        <Box h={150} />
        <ColorModeSwitcher />

        <Box h={10} />

        <Button isLoading={isLoading} colorScheme='orange' variant='solid' size='lg' leftIcon={<FaDiscord />} onClick={ () => { window.location.replace(`${discordUrl}`)} }>
            Login With Discord
        </Button>

    </Box>
  );
}

export default HomePage;

async function authUser(code) {

    

}