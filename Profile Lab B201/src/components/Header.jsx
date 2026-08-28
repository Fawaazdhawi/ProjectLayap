import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
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
        <div className="logo-area">
          <img src={logo} alt="Logo Lab B201" className="header-logo" />
          <div className="text-container">
            <span className="lab-title">{labTitle}</span>
            <span className="lab-subtitle">{labSubtitle}</span>
          </div>
        </div>
        <nav className="nav-menu">
          {links.map((link, index) => (
            <a key={index} href={link.href} className="nav-link">
              {link.name}
            </a>
          ))}
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
