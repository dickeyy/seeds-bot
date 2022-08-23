import '../css/App.css';
import * as React from 'react'
import { ChakraProvider, Table, Thead, Tbody, Tfoot, Tr, Th, Td, TableCaption, TableContainer, Box, Stat, StatLabel, StatNumber, StatHelpText, StatArrow, StatGroup, Divider, Button, useToast, Skeleton, ColorModeScript, ThemeProvider, } from '@chakra-ui/react'
import { useLocation } from 'react-router-dom';

// Components
import Header from '../comps/Header';
import theme from '../theme';
import { checkUser } from '../checkUser';

function AdminCmdsPage() {

  const [cmdCount, setCmdCount] = React.useState(['Loading...'])
  const [cmdRunCount, setCmdRunCount] = React.useState(['Loading...'])
  const [commandData, setCommandData] = React.useState([{}])
  const toast = useToast()
  const [isLoaded, setLoaded] = React.useState(false)

  //check user
  React.useEffect(() => {
    if (!checkUser()) {
      window.location.href = "/"
    }
  }, [])

  // Set cmd Count
  React.useEffect(() => {
    fetch('https://us-central1.gcp.data.mongodb-api.com/app/seeds-dashboard-vsxgk/endpoint/admin/fetch/commands')
      .then(res => res.json())
      .then(data => {
        setCmdCount(data.data.length)

        var rC = 0
        for (var i = 0; i < data.data.length; i++) {
           rC = Number(data.data[i].runCount) + rC
        }
        setCmdRunCount(rC)

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