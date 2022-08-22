import React from 'react';
import { BrowserRouter, Routes, Route, } from "react-router-dom";
import { ColorModeScript } from '@chakra-ui/react';
import theme from './theme'

// Pages
import AdminGuildsPage from './pages/Admin-Guilds';
import AdminCmdsPage from './pages/Admin-Commands';
import AdminEconPage from './pages/Admin-Economy';

// root.render(
//   <React.StrictMode>
//     <HomePage />
//   </React.StrictMode>
// );

export default function App() {
    return (
        // <BrowserRouter>
        // <ColorModeScript initialColorMode={theme.config.initialColorMode} />
        //     <Routes>
        //     <Route path="/" element={<AdminGuildsPage />} />
        //     <Route path="/admin/guilds" element={<AdminGuildsPage />} />
        //     <Route path="/admin/commands" element={<AdminCmdsPage />} />
        //     <Route path="/admin/economy" element={<AdminEconPage />} />
        //     </Routes>
        // </BrowserRouter>

        <AdminGuildsPage />
    );
};
