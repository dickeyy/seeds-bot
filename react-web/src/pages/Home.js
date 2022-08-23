import '../css/App.css';
import * as React from 'react'
import { ChakraProvider, Table, theme,  ThemeProvider, Thead, Tbody, Tfoot, Tr, Th, Td, TableCaption, TableContainer, Box, Stat, StatLabel, StatNumber, StatHelpText, StatArrow, StatGroup, Divider, Button, useToast, Skeleton, ColorModeScript, useColorMode, Heading, } from '@chakra-ui/react'
import { FaDiscord } from 'react-icons/fa';
import { useSearchParams, useLocation } from "react-router-dom"

// Components
import Header from '../comps/Header';
import { ColorModeSwitcher } from '../ColorModeSwitcher';
// import theme from '../theme';

const discordUrl = 'https://discord.com/api/oauth2/authorize?client_id=968198214450831370&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2F&response_type=token&scope=identify%20email%20guilds'

function HomePage() {

    const [isLoading, setLoading] = React.useState(false)

    const location = useLocation();
    const params = new URLSearchParams(location.hash);
    const token = params.get('access_token');
    const tokenType = params.get('token_type');

    React.useEffect(() => {
        if (token !== null) {
            setLoading(true)

            authUser(token, tokenType)
        }
    }, [])

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

async function authUser(token, tokenType) {

    const reqUrl = `https://dashboard.seedsbot.xyz/api/auth_login?access_token=${token}&token_type=${tokenType}`

    fetch(reqUrl)
      .then(res => res.json())
      .then(data => {
        
        console.log(data)
      }
      )

}