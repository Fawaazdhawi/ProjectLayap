import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router';
import Home from './pages/Home';
import AboutPage from './pages/AboutPage';
import LoginPage from './pages/LoginPage';
import AdminPage from './pages/AdminPage';
import WhatsOnEditPage from './pages/WhatsOnEditPage';
import PracticumEdit from './pages/PracticumEdit';
import WhatWeDoEditPage from './pages/WhatWeDoEditPage';
import CultureTabsEditPage from './pages/CultureTabsEditPage';
import TeamEditPage from './pages/TeamEditPage';
import ContactEditPage from './pages/ContactEditPage';
import SiteSettingsEdit from './pages/SiteSettingsEdit';
import NewsDetailPage from './pages/NewsDetail';
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
      <Route path="/login" element={<LoginPage />} />
      <Route path="/news/:id" element={<NewsDetailPage />} />

      <Route path="/admin-edit" element={<ProtectedRoute><AdminPage /></ProtectedRoute>} />
      <Route path="/edit-whats-on" element={<ProtectedRoute><WhatsOnEditPage /></ProtectedRoute>} />
      <Route path="/edit-practicum" element={<ProtectedRoute><PracticumEdit /></ProtectedRoute>} />
      <Route path="/edit-whatwedo" element={<ProtectedRoute><WhatWeDoEditPage /></ProtectedRoute>} />
      <Route path="/edit-culture" element={<ProtectedRoute><CultureTabsEditPage /></ProtectedRoute>} />
      <Route path="/edit-team" element={<ProtectedRoute><TeamEditPage /></ProtectedRoute>} />
      <Route path="/edit-contact" element={<ProtectedRoute><ContactEditPage /></ProtectedRoute>} />
      <Route path="/edit-settings" element={<ProtectedRoute><SiteSettingsEdit /></ProtectedRoute>} />

      <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
