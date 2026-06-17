import { Link } from 'react-router';
import { headerData } from '../data/content';
import '../styles/main.css';

const Header = ({ navLinks }) => {
  const links = navLinks ?? headerData.navLinks;

  return (
    <header className="main-header">
      <div className="header-container">
        <Link to="/" className="logo-area" style={{ textDecoration: 'none' }}>
          <img src={headerData.logo} alt="Logo Lab B201" className="header-logo" />
          <div className="text-container">
            <span className="lab-title">{headerData.labTitle}</span>
            <span className="lab-subtitle">{headerData.labSubtitle}</span>
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
        </nav>
      </div>
    </header>
  );
};

export default Header;
