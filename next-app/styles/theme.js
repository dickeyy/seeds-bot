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
        }
    }
  }
}

// 3. extend the theme
const theme = extendTheme(config)

export default theme