import '../css/App.css';
import * as React from 'react'
import { ChakraProvider, Table, Thead, Tbody, Tfoot, Tr, Th, Td, TableCaption, TableContainer, Box, Stat, StatLabel, StatNumber, StatHelpText, StatArrow, StatGroup, Divider, Button, useToast, Skeleton, ColorModeScript, } from '@chakra-ui/react'

// Components
import Header from '../comps/Header';
import theme from '../theme';

function AdminGuildsPage() {

  const [guildCount, setGuildCount] = React.useState(['Loading...'])
  const [guilds, setGuilds] = React.useState([])
  const toast = useToast()
  const [isLoaded, setLoaded] = React.useState(false)

  // Set Guild Count
  React.useEffect(() => {
    fetch('http://localhost:2000/admin/fetch-guilds')
      .then(res => res.json())
      .then(data => {
        setGuildCount(data.length)
      }
      )
  }
  , [])

  // Set Guilds
  React.useEffect(() => {
    fetch('http://localhost:2000/admin/fetch-guilds')
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
    <ChakraProvider w='20vw' backgroundColor={'#1A202C'}>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
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
          <Table variant='simple' colorScheme='red'>
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

    </ChakraProvider>
  );
}

export default AdminGuildsPage;