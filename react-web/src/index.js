import { ColorModeScript } from "@chakra-ui/react";
import * as React from "react";
import * as ReactDOM from 'react-dom/client'

import App from "./app";
import AdminGuildsPage from './pages/Admin-Guilds';
import theme from "./theme";

const rootElement = document.getElementById('root')
ReactDOM.createRoot(rootElement).render(
  <>
    {/* 👇 Here's the script */}
    {/* <ColorModeScript initialColorMode={'dark'} /> */}
    <AdminGuildsPage />
  </>,
)