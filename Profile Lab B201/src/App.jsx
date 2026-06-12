import { Routes, Route } from 'react-router';
import Home from './pages/Home';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Booking from './pages/Booking';
import AdminPage from './pages/AdminPage';
import ReservasiPC from './pages/ReservasiPC';
import Inventaris from './pages/Inventaris';
import PrinterPage from './pages/PrinterPage';
import WhatsOnEditPage from './pages/WhatsOnEditPage';
import PracticumEdit from './pages/PracticumEdit';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/ProtectedRoute';
import './styles/main.css';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/home" element={<Home />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route path="/admin" element={<ProtectedRoute><Booking /></ProtectedRoute>} />
      <Route path="/admin-edit" element={<ProtectedRoute><AdminPage /></ProtectedRoute>} />
      <Route path="/reservasi-pc" element={<ProtectedRoute><ReservasiPC /></ProtectedRoute>} />
      <Route path="/inventaris" element={<ProtectedRoute><Inventaris /></ProtectedRoute>} />
      <Route path="/printer-lab" element={<ProtectedRoute><PrinterPage /></ProtectedRoute>} />
      <Route path="/edit-whats-on" element={<ProtectedRoute><WhatsOnEditPage /></ProtectedRoute>} />
      <Route path="/edit-practicum" element={<ProtectedRoute><PracticumEdit /></ProtectedRoute>} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
