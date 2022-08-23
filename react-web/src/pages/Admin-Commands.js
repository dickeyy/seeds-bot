import '../css/App.css';

import * as React from 'react'

import { ChakraProvider, Table, Thead, Tbody, Tfoot, Tr, Th, Td, TableCaption, TableContainer, Box, Stat, StatLabel, StatNumber, StatHelpText, StatArrow, StatGroup, Divider, Button, useToast, Skeleton, ColorModeScript, ThemeProvider, } from '@chakra-ui/react'

// Components
import Header from '../comps/Header';
import theme from '../theme';

function AdminCmdsPage() {

  const [cmdCount, setCmdCount] = React.useState(['Loading...'])
  const [cmdRunCount, setCmdRunCount] = React.useState([0])
  const [commandData, setCommandData] = React.useState([{}])
  const toast = useToast()
  const [isLoaded, setLoaded] = React.useState(false)

  // Set cmd Count
  React.useEffect(() => {
    fetch('https://us-central1.gcp.data.mongodb-api.com/app/seeds-dashboard-vsxgk/endpoint/admin/fetch/commands')
      .then(res => res.json())
      .then(data => {
        setCmdCount(data.data.length)
      }
      )
  }
  , [])

  // Set cmd run Count
  React.useEffect(() => {
    fetch('https://us-central1.gcp.data.mongodb-api.com/app/seeds-dashboard-vsxgk/endpoint/admin/fetch/commands')
      .then(res => res.json())
      .then(data => {
        var rC = 0
        for (var i = 0; i < data.data.length; i++) {
           rC = Number(data.data[i].runCount) + rC
        }
        setCmdRunCount(rC)
      }
      )
  }
  , [])

  // Set cmd data
  React.useEffect(() => {
    fetch('https://us-central1.gcp.data.mongodb-api.com/app/seeds-dashboard-vsxgk/endpoint/admin/fetch/commands')
      .then(res => res.json())
      .then(data => {
        
        setCommandData(data.data)

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
    <Box theme={theme}  w='20vw'>
      <Header />
      <Box h={50}></Box>
      <StatGroup>
        <Stat>
            <StatLabel fontSize={40}>Commands Run</StatLabel>
            <StatNumber fontSize={50}>{cmdRunCount}</StatNumber>
        </Stat>
        <Stat>
            <StatLabel fontSize={40}>Command Count</StatLabel>
            <StatNumber fontSize={50}>{cmdCount}</StatNumber>
        </Stat>
      </StatGroup>
      <Box h={5}></Box>
      <Divider />
      <Skeleton isLoaded={isLoaded}>
        <TableContainer maxWidth='40%' whiteSpace={'normal'} justifyContent={'center'} m={'auto'}>
          <Table variant='simple' colorScheme='orange'>
          <TableCaption placement={'top'} fontSize={30}>Commands</TableCaption>
            <Thead>
              <Tr>
                <Th>Name</Th>
                <Th isNumeric={true}>Run Count</Th>
              </Tr>
            </Thead>
            <Tbody fontSize={20}>
            
            {commandData.map(cmd => (
                <Tr>
                    <Td>{cmd.name}</Td>
                    <Td isNumeric={true}>{cmd.runCount}</Td>
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

export default AdminCmdsPage;