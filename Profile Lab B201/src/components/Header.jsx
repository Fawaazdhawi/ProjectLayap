import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { headerData, adminNavLinks } from '../data/content';
import { supabase } from '../config/supabase';
import '../styles/main.css';

const Header = ({ navLinks }) => {
  const [settings, setSettings] = useState(null);
  const links = navLinks ?? headerData.navLinks;
  const isAdminHeader = navLinks === adminNavLinks;
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login', { replace: true });
  };

  useEffect(() => {
    let mounted = true;
    supabase.from('site_settings').select('*').single().then(({ data, error }) => {
      if (!error && mounted) setSettings(data);
    });
    return () => { mounted = false; };
  }, []);

  const logo = settings?.logo_url ?? headerData.logo;
  const labTitle = settings?.lab_title ?? headerData.labTitle;
  const labSubtitle = settings?.lab_subtitle ?? headerData.labSubtitle;

  return (
    <header className="main-header">
      <div className="header-container">
        <Link to="/" className="logo-area" style={{ textDecoration: 'none' }}>
          <img src={logo} alt="Logo Lab B201" className="header-logo" />
          <div className="text-container">
            <span className="lab-title">{labTitle}</span>
            <span className="lab-subtitle">{labSubtitle}</span>
          </div>
        </Link>
        <nav className="nav-menu">
          {links.map((link, index) => {
            // Hash anchors point to home sections; prefix with "/" so they
            // navigate home first, then scroll (handled by ScrollToHash in App).
            const to = link.href.startsWith('#') ? `/${link.href}` : link.href;
            return (
              <Link key={index} to={to} className="nav-link">
                {link.name}
              </Link>
            );
          })}
          {isAdminHeader && (
            <button type="button" className="nav-link nav-logout" onClick={handleLogout}>
              Logout
            </button>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
