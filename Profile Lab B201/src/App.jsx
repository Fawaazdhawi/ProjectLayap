import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router';
import Home from './pages/Home';
import AboutPage from './pages/AboutPage';
import ArticlePage from './pages/ArticlePage';
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

// Scrolls to the element matching the URL hash (e.g. /#news), or to the top
// when navigating between pages without a hash.
function ScrollToHash() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      // Element may mount a tick after navigation; retry briefly.
      let tries = 0;
      const tryScroll = () => {
        const el = document.getElementById(hash.slice(1));
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        } else if (tries++ < 10) {
          setTimeout(tryScroll, 50);
        }
      };
      tryScroll();
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  return null;
}

function App() {
  return (
    <>
      <ScrollToHash />
      <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/home" element={<Home />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/news/:id" element={<ArticlePage />} />
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
    </>
  );
}

export default App;
