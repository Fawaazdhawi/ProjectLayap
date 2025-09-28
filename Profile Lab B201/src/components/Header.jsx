import React from 'react';
import { headerData } from '../data/content';
import '../styles/main.css';

const Header = () => {
  return (
    <header className="main-header">
      <div className="header-container">
        <div className="logo-area">
          <img src={headerData.logo} alt="Logo Lab B201" className="header-logo" />
          <div className="text-container">
            <span className="lab-title">{headerData.labTitle}</span>
            <span className="lab-subtitle">{headerData.labSubtitle}</span>
          </div>
        </div>
        <nav className="nav-menu">
          {headerData.navLinks.map((link, index) => (
            <a key={index} href={link.href} className="nav-link">
              {link.name}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Header;