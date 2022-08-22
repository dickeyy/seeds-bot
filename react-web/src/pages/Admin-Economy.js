import '../css/App.css';

import * as React from 'react'

import { ChakraProvider, Table, Thead, Tbody, Tfoot, Tr, Th, Td, TableCaption, TableContainer, Box, Stat, StatLabel, StatNumber, StatHelpText, StatArrow, StatGroup, Divider, Button, useToast, Skeleton } from '@chakra-ui/react'

// Components
import Header from '../comps/Header';

function AdminCmdsPage() {

  const [userCount, setUserCount] = React.useState(['Loading...'])
  const [totalCoins, setTotalCoins] = React.useState([0])
  const [econData, setEconData] = React.useState([{}])
  const toast = useToast()
  const [isLoaded, setLoaded] = React.useState(false)

  // Set user Count
  React.useEffect(() => {
    fetch('http://localhost:2000/admin/fetch-economy')
      .then(res => res.json())
      .then(data => {
        setUserCount(data.length)
      }
      )
  }
  , [])

  // Set cmd coin Count
  React.useEffect(() => {
    fetch('http://localhost:2000/admin/fetch-economy')
      .then(res => res.json())
      .then(data => {
        var rC = 0
        for (var i = 0; i < data.length; i++) {

            if (data[i].coins != null) {
                rC = Number(data[i].coins) + rC

                var commas = rC.toLocaleString("en-US");
            }
        }
        setTotalCoins(commas)
      }
      )
  }
  , [])

  // Set econ data
  React.useEffect(() => {
    fetch('http://localhost:2000/admin/fetch-economy')
      .then(res => res.json())
      .then(data => {
        
        setEconData(data)

        setLoaded(true)

        toast({
          title: 'Loaded Command Data',
          status: 'success',
          duration: 5000,
          isClosable: true,
        })
      }
      )
  }
  , [])

  return (
    <ChakraProvider w='20vw'>
      <Header />
      <Box h={50}></Box>
      <StatGroup>
        <Stat>
            <StatLabel fontSize={40}>Econ Users</StatLabel>
            <StatNumber fontSize={50}>{userCount}</StatNumber>
        </Stat>
        <Stat>
            <StatLabel fontSize={40}>Total Coins</StatLabel>
            <StatNumber fontSize={50}>{totalCoins}</StatNumber>
        </Stat>
      </StatGroup>
      <Box h={5}></Box>
      <Divider />
      <Skeleton isLoaded={isLoaded}>
        <TableContainer maxWidth='60%' whiteSpace={'normal'} justifyContent={'center'} m={'auto'}>
          <Table variant='simple' colorScheme='red'>
          <TableCaption placement={'top'} fontSize={30}>Commands</TableCaption>
            <Thead>
              <Tr>
                <Th>User ID</Th>
                <Th>Guild ID</Th>
                <Th isNumeric={true}>Coins</Th>
              </Tr>
            </Thead>
            <Tbody fontSize={20}>
            
            {econData.map(econ => (
                <Tr>
                    <Td>{econ.userId}</Td>
                    <Td>{econ.guildId}</Td>
                    <Td isNumeric={true}>{econ.coins}</Td>
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

export default AdminCmdsPage;