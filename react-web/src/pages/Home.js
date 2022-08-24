import '../css/App.css';
import * as React from 'react'
import { theme, Box, Button, AlertDialog, AlertDialogBody, AlertDialogFooter, AlertDialogHeader, AlertDialogContent, AlertDialogOverlay, useDisclosure, } from '@chakra-ui/react'
import { FaDiscord } from 'react-icons/fa';
import { useSearchParams, useLocation } from "react-router-dom"

// Components
import Header from '../comps/Header';
import { ColorModeSwitcher } from '../ColorModeSwitcher';
import { checkUser } from '../checkUser';
// import theme from '../theme';

// const discordUrl = 'https://discord.com/api/oauth2/authorize?client_id=968198214450831370&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2F&response_type=token&scope=identify%20email%20guilds'
const discordUrl = 'https://discord.com/api/oauth2/authorize?client_id=968198214450831370&redirect_uri=https%3A%2F%2Fdashboard.seedsbot.xyz%2F&response_type=token&scope=identify%20email%20guilds'

function HomePage() {

    const [isLoading, setLoading] = React.useState(false)
    const [isDisabled, setDisabled] = React.useState(false)
    const { isOpen, onOpen, onClose } = useDisclosure()
    const cancelRef = React.useRef()

    const location = useLocation();
    const params = new URLSearchParams(location.hash);
    const token = params.get('access_token');
    const tokenType = params.get('#token_type');

     //check user
    React.useEffect(() => {
        if (checkUser()) {
        window.location.href = "/admin/guilds"
        }
    }, [])

    React.useEffect(() => {
        if (token !== null) {
            setLoading(true)

            const reqUrl = `https://dashboard.seedsbot.xyz/api/auth_login?access_token=${token}%2Ftoken_type=${tokenType}`

            fetch(reqUrl)
            .then(res => res.json())
            .then(data => {
                
                console.log(data)
            })

            fetch('https://discord.com/api/users/@me', {
                headers: {
                    authorization: `${tokenType} ${token}`,
                },
            })
            .then(result => result.json())
            .then(response => {
                const { username, discriminator } = response;

                if (localStorage.getItem('username') !== username && localStorage.getItem('username') !== null) {
                    localStorage.removeItem("token")
                    localStorage.removeItem("token_type")
                    localStorage.removeItem("username")
                    localStorage.removeItem("discriminator")
                    localStorage.removeItem('expires_at')

                    localStorage.setItem('token', token)
                    localStorage.setItem('token_type', tokenType)
                    localStorage.setItem('username', username)
                    localStorage.setItem('discriminator', discriminator)
                    localStorage.setItem('expires_at', Date.now() + (1000 * 60 * 60 * 24 * 7 * 14))
                } else {
                    localStorage.setItem('token', token)
                    localStorage.setItem('token_type', tokenType)
                    localStorage.setItem('username', username)
                    localStorage.setItem('discriminator', discriminator)
                    localStorage.setItem('expires_at', Date.now() + (1000 * 60 * 60 * 24 * 7 * 14))
                }

                if (username === 'dickey' && discriminator === '6969') {
                    window.location.replace(`https://dashboard.seedsbot.xyz/admin/guilds`)
                    // window.location.replace(`http://localhost:3000/admin/guilds`)
                } else {
                    setLoading(false)
                    setDisabled(true)

                    onOpen()
                }
            })
            .catch(console.error);
        }
    }, [])

  return (
    <Box w='20vw' theme={theme} flexDirection="column">
        <Box h={150} />
        <ColorModeSwitcher />

        <Box h={10} />

        <Button isLoading={isLoading} isDisabled={isDisabled} colorScheme='orange' variant='solid' size='lg' leftIcon={<FaDiscord />} onClick={ () => { window.location.replace(`${discordUrl}`)} }>
            Login With Discord
        </Button>

        <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
        isCentered
        >
        <AlertDialogOverlay>
          <AlertDialogContent>
            
            <AlertDialogHeader fontSize={30} color={'red.400'} fontWeight='bold' mt={3}>
              ERROR 401 - Unauthorized
            </AlertDialogHeader>

            <AlertDialogBody>
              Only the bot owner @dickey#6969 can use the dashboard at this time.
            </AlertDialogBody>

            <AlertDialogFooter>
              
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

    </Box>
  );
}

export default HomePage;

async function authUser(token, tokenType) {

    const reqUrl = `https://dashboard.seedsbot.xyz/api/auth_login?access_token=${token}%2Ftoken_type=${tokenType}`

    fetch(reqUrl)
      .then(res => res.json())
      .then(data => {
        
        console.log(data)
    })

    fetch('https://discord.com/api/users/@me', {
        headers: {
            authorization: `${tokenType} ${token}`,
        },
    })
    .then(result => result.json())
    .then(response => {
        const { username, discriminator } = response;

        if (localStorage.getItem('username') !== username && localStorage.getItem('username') !== null) {
            localStorage.removeItem("token")
            localStorage.removeItem("token_type")
            localStorage.removeItem("username")
            localStorage.removeItem("discriminator")

            localStorage.setItem('token', token)
            localStorage.setItem('token_type', tokenType)
            localStorage.setItem('username', username)
            localStorage.setItem('discriminator', discriminator)
        } else {
            localStorage.setItem('token', token)
            localStorage.setItem('token_type', tokenType)
            localStorage.setItem('username', username)
            localStorage.setItem('discriminator', discriminator)
        }

        if (username === 'dickey' && discriminator === '6969') {
            window.location.replace(`https://dashboard.seedsbot.xyz/admin/guilds`)
            // window.location.replace(`http://localhost:3000/admin/guilds`)
        }
    })
    .catch(console.error);

}