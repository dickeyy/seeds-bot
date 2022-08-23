import React from 'react';
import { BrowserRouter, Routes, Route, } from "react-router-dom";

// Pages
import AdminGuildsPage from './pages/Admin-Guilds';
import AdminCmdsPage from './pages/Admin-Commands';
import AdminEconPage from './pages/Admin-Economy';
import HomePage from './pages/Home';

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/admin/guilds"  element={<AdminGuildsPage />} />
                <Route path="/admin/commands" element={<AdminCmdsPage />} />
                <Route path="/admin/economy" element={<AdminEconPage />} />
            </Routes>
        </BrowserRouter>
    );
};
