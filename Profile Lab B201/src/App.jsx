import React from 'react';
import Home from './pages/Home';
import './styles/main.css';
import { Routes, Route } from 'react-router';
import NotFound from './pages/NotFound';
import LoginPage from './pages/LoginPage';
import Booking from './pages/Booking';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/home" element={<Home />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/reservasi" element={<Booking />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;