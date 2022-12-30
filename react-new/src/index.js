import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import * as React from "react";
import * as ReactDOM from 'react-dom/client'

import App from "./app";

const rootElement = document.getElementById('root')
ReactDOM.createRoot(rootElement).render(
  <ChakraProvider>
    <React.StrictMode>
    <ColorModeScript  initialColorMode={"dark"}/>
    <App />
  </React.StrictMode>
  </ChakraProvider>,
)