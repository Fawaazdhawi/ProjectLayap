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
import WhatsOnEditPage from './pages/WhatsOnEditPage';
import PracticumEdit from './pages/PracticumEdit.jsx';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/home" element={<Home />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/admin-edit" element={<AdminPage />} />
      <Route path="/admin" element={<Booking />} />
      <Route path="/reservasi-pc" element={<ReservasiPC />} />
      <Route path="/inventaris" element={<Inventaris />} />
      <Route path="/printer-lab" element={<PrinterPage />} />
      <Route path="/edit-whats-on" element={<WhatsOnEditPage />} /> 
      <Route path="/edit-practicum" element={<PracticumEdit />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;