import React from 'react';
import Home from './pages/Home';
import './styles/main.css';
import { Routes, Route } from 'react-router';
import NotFound from './pages/NotFound';
import LoginPage from './pages/LoginPage';
import Booking from './pages/Booking';
import RegisterPage from './pages/RegisterPage';
import ReservasiPC from './pages/ReservasiPC';
import Inventaris from './pages/Inventaris';
import PrinterPage from './pages/PrinterPage';
import AdminPage from './pages/AdminPage';
import HomeEditPage from './pages/HomeEditPage';
import AdminDashboard from './admindashboard';

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/home" element={<Home />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      
      {/* Admin Routes */}
      <Route path="/admin-dashboard" element={<AdminDashboard />} />
      <Route path="/admin-edit" element={<AdminPage />} />
      <Route path="/admin" element={<Booking />} />
      <Route path="/edit-home" element={<HomeEditPage />} />
      
      {/* Feature Routes */}
      <Route path="/reservasi-pc" element={<ReservasiPC />} />
      <Route path="/inventaris" element={<Inventaris />} />
      <Route path="/printer-lab" element={<PrinterPage />} />
      
      {/* 404 Not Found */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;