import '../css/App.css';
import * as React from 'react'
import { ChakraProvider, Table, theme,  ThemeProvider, Thead, Tbody, Tfoot, Tr, Th, Td, TableCaption, TableContainer, Box, Stat, StatLabel, StatNumber, StatHelpText, StatArrow, StatGroup, Divider, Button, useToast, Skeleton, ColorModeScript, useColorMode, } from '@chakra-ui/react'
import { useLocation } from "react-router-dom"
import { checkUser } from '../checkUser';

// Components
import Header from '../comps/Header';
import { ColorModeSwitcher } from '../ColorModeSwitcher';
// import theme from '../theme';

const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

function AdminGuildsPage() {

  const [guildCount, setGuildCount] = React.useState(0)
  const [guilds, setGuilds] = React.useState([])
  const [userCount, setUserCount] = React.useState(['Loading...'])
  const [userNumCount, setUserNumCount] = React.useState(0)
  const [guildChangeNum, setGuildChangeNum] = React.useState([0])
  const [guildChangeType, setGuildChangeType] = React.useState(['decrease'])
  const [userChangeNum, setUserChangeNum] = React.useState([0])
  const [userChangeType, setUserChangeType] = React.useState(['decrease'])
  const toast = useToast()
  const [isLoaded, setLoaded] = React.useState(false)

  //check user
  React.useEffect(() => {
    if (!checkUser()) {
      window.location.href = "/"
    }
  }, [])

  // Set Guild Count
  React.useEffect(() => {
    delay(1000).then(() => {
      fetch('https://us-central1.gcp.data.mongodb-api.com/app/seeds-dashboard-vsxgk/endpoint/admin/fetch/guilds')
      .then(res => res.json())
      .then(data => {
        fetch('https://us-central1.gcp.data.mongodb-api.com/app/seeds-dashboard-vsxgk/endpoint/admin/fetch/historical_data/guilds')
        .then(res2 => res2.json())
        .then(data2 => {


          setGuildCount(data.data.length - 1)
          console.log((guildCount))

          var rC = 0
          for (var i = 0; i < data.data.length; i++) {

              if (data.data[i].memberCount != null) {
                  rC = Number(data.data[i].memberCount) + rC

                  var commas = rC.toLocaleString("en-US"); 
              }
          }
          
          setUserNumCount(rC)
          console.log(commas, rC)

          setUserCount(commas)

          setGuilds(data.data)

          delay(1000).then(() => {
            const guildHistory = data2.guildCount
            const userHistory = data2.userCount

            setGuildChangeNum(guildHistory)
            setUserChangeNum(userHistory)


            if (Number(guildChangeNum) > Number(guildCount)) {
              setGuildChangeType('decrease')
            } else {
              setGuildChangeType('increase')
            }

            if (userChangeNum > userNumCount) {
              setUserChangeType('decrease')
            } else {
              setUserChangeType('increase')
            }

          })

          setLoaded(true)
      
          toast({
            title: 'Loaded Guild Data',
            status: 'success',
            duration: 5000,
            isClosable: true,
          })
        })
      }
      )
    })
  }, [])

  return (
    <Box w='20vw' theme={theme}>
      <Header />
      <Box h={50}></Box>
      
      <StatGroup>
        <Stat>
            <StatLabel fontSize={40}>Guild Count</StatLabel>
            <StatNumber fontSize={50}>{guildCount}</StatNumber>
            <StatHelpText>
              <StatArrow type={guildChangeType} />
                {guildCount - guildChangeNum} in the last 24 hours
            </StatHelpText>
        </Stat>
        <Stat>
            <StatLabel fontSize={40}>User Count</StatLabel>
            <StatNumber fontSize={50}>{userCount}</StatNumber>
            <StatHelpText>
              <StatArrow type={userChangeType} />
                {userNumCount - userChangeNum} in the last 24 hours
            </StatHelpText>
        </Stat>
      </StatGroup>
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