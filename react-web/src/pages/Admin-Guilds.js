import '../css/App.css';
import * as React from 'react'
import { ChakraProvider, Table, theme,  ThemeProvider, Thead, Tbody, Tfoot, Tr, Th, Td, TableCaption, TableContainer, Box, Stat, StatLabel, StatNumber, StatHelpText, StatArrow, StatGroup, Divider, Button, useToast, Skeleton, ColorModeScript, useColorMode, } from '@chakra-ui/react'

// Components
import Header from '../comps/Header';
import { ColorModeSwitcher } from '../ColorModeSwitcher';
// import theme from '../theme';

function AdminGuildsPage() {

  const [guildCount, setGuildCount] = React.useState(['Loading...'])
  const [guilds, setGuilds] = React.useState([])
  const toast = useToast()
  const [isLoaded, setLoaded] = React.useState(false)
  const { colorMode, toggleColorMode } = useColorMode()

  // Set Guild Count
  React.useEffect(() => {
    fetch('https://seeds-bot.vercel.app/api/api/admin/fetch-guilds')
      .then(res => res.json())
      .then(data => {
        setGuildCount(data.length)
      }
      )
  }
  , [])

  // Set Guilds
  React.useEffect(() => {
    fetch('https://seeds-bot.vercel.app/api/api/admin/fetch-guilds')
      .then(res => res.json())
      .then(data => {
        
        setGuilds(data)

        setLoaded(true)

        toast({
          title: 'Loaded Guild Data',
          status: 'success',
          duration: 5000,
          isClosable: true,
        })
      }
      )
  }
  , [])

  return (
    <Box w='20vw' theme={theme}>
      <Header />
      <Box h={50}></Box>
      
      <Stat>
        <StatLabel fontSize={40}>Guild Count</StatLabel>
        <StatNumber fontSize={50}>{guildCount}</StatNumber>
      </Stat>
      <Box h={5}></Box>
      <Divider />
      <Skeleton isLoaded={isLoaded}>
        <TableContainer maxWidth='70%' whiteSpace={'normal'} justifyContent={'center'} m={'auto'}>
          <Table variant='simple' colorScheme='orange'>
          <TableCaption placement={'top'} fontSize={30}>Guilds</TableCaption>
            <Thead>
              <Tr>
                <Th>ID</Th>
                <Th>Name</Th>
                <Th isNumeric={true}>Member Count</Th>
                <Th>Joined At</Th>
              </Tr>
            </Thead>
            <Tbody fontSize={20}>
            
            {guilds.map(guild => (
              <Tr>
              <Td>{guild.id}</Td>
              <Td>{guild.name}</Td>
              <Td isNumeric={true}>{guild.memberCount}</Td>
              <Td>{guild.joinedAt}</Td>
            </Tr>
            ))}

            </Tbody>
          </Table>
        </TableContainer>
      </Skeleton>

      <Box h={50}></Box>

    </Box>
  );
}

export default AdminGuildsPage;