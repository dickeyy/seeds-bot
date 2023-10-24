import React, { ReactNode } from 'react';
import {
  IconButton,
  Avatar,
  Box,
  CloseButton,
  Flex,
  HStack,
  VStack,
  Icon,
  useColorModeValue,
  Link,
  Drawer,
  DrawerContent,
  Text,
  useDisclosure,
  BoxProps,
  FlexProps,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Image,
  ChakraProvider,
  DrawerOverlay,
  Button,
  Tooltip 
} from '@chakra-ui/react';
import {
  FiHome,
  FiTrendingUp,
  FiCompass,
  FiStar,
  FiSettings,
  FiMenu,
  FiBell,
  FiChevronDown,
  FiList,
  FiShield,
  FiAlertTriangle,
  FiMusic,
} from 'react-icons/fi';
import theme from '@/styles/theme';
import { RiSwordLine, RiUserAddLine } from 'react-icons/ri';
import { FaTwitch, FaTwitter, FaYoutube } from 'react-icons/fa';
import { IoEnter, IoEnterOutline } from 'react-icons/io5';
import { BiBarChartAlt2 } from 'react-icons/bi';
import { BsCoin } from 'react-icons/bs';

const LinkItems = [
  { name: 'Overview', icon: FiHome, link: '/overview' },
  { name: 'Logging', icon: FiList, link: '/logging' },
  { name: 'Automod', icon: FiShield, link: '/automod' },
  { name: 'Music', icon: FiMusic, link: '/music' },
  { name: 'Reporting', icon: FiAlertTriangle, link: '/reporting' },
  { name: 'Starboard', icon: FiStar, link: '/starboard' },
  { name: 'Welcome / Exit', icon: IoEnterOutline, link: '/member-join' },
  { name: 'Economy', icon: BsCoin, link: '/economy' },
  { name: 'Autorole', icon: RiUserAddLine, link: '/autorole' },
  { name: 'Levels', icon: BiBarChartAlt2, link: '/levels' },
  { name: 'Twitch', icon: FaTwitch, link: '/twitch' },
  { name: 'Twitter', icon: FaTwitter, link: '/twitter' },
  { name: 'YouTube', icon: FaYoutube, link: '/youtube' },
];

export default function SidebarWithHeader(props) {

  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <ChakraProvider theme={theme}>
      
      <Drawer
        isOpen={isOpen}
        placement={'left'}
        onClose={onClose}
        size={'xs'}
      >
        <DrawerOverlay />
        <DrawerContent
          bg={'#161515'}
          p={0}
        >
          <Flex
            h={'20'}
            alignItems={'center'}
            justifyContent={'space-between'}
            px={6}
          >
            <Text
              fontSize={'xl'}
              fontWeight={700}
              color={'white'}
            >
              Seeds
            </Text>
            <CloseButton
              display={{ base: 'flex', md: 'none' }}
              onClick={onClose}
              color={'white'}
            />
          </Flex>

          <VStack
            spacing={4}
            align={'stretch'}
            px={6}
            mt={6}
          >
            {LinkItems.map((link) => (
              <Link
                key={link.name}
                px={2}
                py={1}
                rounded={'md'}
                _hover={{ 
                  textDecoration: 'none',
                  bg: 'brand.brown.500',
                }}
                href={`/dashboard/${props.guild.id}/${link.link}`}
              >
                <Flex
                  align={'center'}
                >
                  <Icon
                    as={link.icon}
                    w={5}
                    h={5}
                    color={'white'}
                  />
                  <Text
                    ml={4}
                    fontWeight={600}
                    color={'white'}
                  >
                    {link.name} 
                  </Text>
                </Flex>
              </Link>
            ))}
          </VStack>

          <Flex
            mt={'auto'}
            mb={6}
            align={'center'}
            justify={'space-between'}
            px={6}
          >
          </Flex>
        </DrawerContent>
      </Drawer>

      {/* make the sidebar always visible but collapsed */}

      <Box
        bgColor='#161515'
        alignContent={'center'}
        justifyContent={'center'}
        top={'0'}
        minH="100%"
        w={'6rem'}
        pos={'fixed'}
        borderRight="1px"
        borderColor="brand.gray.900"
      >
          <Flex
            h={'20'}
            alignItems={'center'}
            justifyContent={'space-between'}
            px={6}
          >
            <Text
              fontSize={'xl'}
              fontWeight={700}
              color={'white'}
            >
              Seeds
            </Text>
            <CloseButton
              display={{ base: 'flex', md: 'none' }}
              onClick={onClose}
              color={'white'}
            />
          </Flex>

          <VStack
            spacing={4}
            align={'stretch'}
            px={6}
            mt={6}
          >
            <IconButton 
              aria-label="Open Menu"
              icon={<FiMenu />}
              size={'md'}
              color={'white'}
              onClick={onOpen}
              mr={2}
              ml={0}
            />
            {LinkItems.map((link) => (
              <Link
                key={link.name}
                p={2}
                width={'2.5rem'}
                rounded={'md'}
                _hover={{
                  textDecoration: 'none',
                  bg: 'brand.brown.500',
                }}
                href={`/dashboard/${props.guild.id}/${link.link}`}
              >
                <Flex
                  align={'center'}
                >
                  <Icon
                    as={link.icon}
                    w={6}
                    h={6}
                    color={'white'}
                  />
                </Flex>
              </Link>
            ))}
          </VStack>

          <Flex
            mt={'auto'}
            mb={6}
            align={'center'}
            justify={'space-between'}
            px={6}
          >
            
          </Flex>
      </Box>

      <Box
        bgColor='#161515'
        alignContent={'center'}
        justifyContent={'center'}
        top={'0'}
        minH="15"
        minW="100vw"
        pos={'fixed'}
        p={4}
        borderBottom="1px"
        borderColor="brand.gray.900"
      >
        {/* make a profile picture and name on the far right side */}
        <Box
          flexDirection={'row'}
        >

          <Flex
            align={'center'}
            justify={'flex-end'}
            w={'100%'}
          >

            <Flex
              align={'center'}
              justify={'flex-start'}
              w={'100%'}
            >
              <Avatar size={'md'} src='/images/seeds-logo-removebg.png' />
              <Text
                ml={2}
                fontWeight={600}
                color={'white'}
                fontSize={'2xl'}
              >
                Seeds
              </Text>
            </Flex>

            <Box
              w={'100%'}
              flexDirection={'row'}
              display={'flex' }
              justifyContent={'flex-end'}
            >
              <Avatar
                mt={'1.5'}
                size={'sm'}
                src={
                  `https://cdn.discordapp.com/icons/${props.guild.id}/${props.guild.icon}.png`
                }
              />
              
              <VStack
                display={{ base: 'none', md: 'flex' }}
                alignItems="flex-start"
                spacing="1px"
                ml="2">
                <Text fontWeight={'medium'} fontSize="md">{props.guild.name}</Text>
                <Text fontSize="xs" color="brand.gray.200">
                  ID: {props.guild.id}
                </Text>
              </VStack>

              <Menu
                bgColor={'#161515'}
              >
                <MenuButton
                  as={IconButton}
                  aria-label="Options"
                  icon={<FiChevronDown />}
                  size={'md'}
                  color={'white'}
                  variant={'ghost'}
                  ml={2}
                />
                <MenuList bgColor={'#161515'} p={5} justifyContent={'center'} alignContent={'center'}>
                  <Text fontSize={"md"} color={'brand.gray.200'}>Member Count:</Text>
                  <Text fontSize={"xl"} fontWeight={'bold'} mb={3}>{props.guild.memberCount.toLocaleString()}</Text>
                  <MenuDivider />
                  <a href={`${process.env.REDIRECT}/dashboard/select-server`}>
                    <Button colorScheme={'brand.brown'} w={'100%'} mt={2} mb={2}>Switch Server</Button>
                  </a>
                  
                </MenuList>
              </Menu>
            </Box>


          </Flex>
        </Box>




      </Box>

    </ChakraProvider>
  )

}