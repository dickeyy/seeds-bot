import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import * as React from "react";
import * as ReactDOM from 'react-dom/client'

import App from "./app";
import config from "./theme";

const rootElement = document.getElementById('root')
ReactDOM.createRoot(rootElement).render(
  <ChakraProvider>
    <React.StrictMode>
    <ColorModeScript  initialColorMode={config.initialColorMode}/>
    <App />
  </React.StrictMode>
  </ChakraProvider>,
)