import { extendTheme } from '@chakra-ui/react'

// 2. Add your color mode config
const config = {
  initialColorMode: 'dark',
  useSystemColorMode: true,
  styles: {
    global: {
      body: {
        bg: '#0e0d0d',
        color: 'white',
      },
    },
  },
  colors: {
    brand: {
        brown: {
            50: '#ebccb0',
            100: '#e7c2a0',
            200: '#e3b890',
            300: '#dfae80',
            400: '#dba470',
            500: '#d79a61',
            600: '#c18a57',
            700: '#ac7b4d',
            800: '#966b43',
            900: '#815c3a',
        },
        gray: {
            900: '#2e2e2e',
            800: '#333333',
            700: '#383838',
            600: '#3d3d3d',
            500: '#444444',
            400: '#5a5a5a',
            300: '#707070',
            200: '#868686',
            100: '#9d9d9d',
            50: '#b3b3b3',
        }
    }
  }
}

// 3. extend the theme
const theme = extendTheme(config)

export default theme