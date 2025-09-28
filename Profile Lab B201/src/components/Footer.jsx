import React from 'react';
import { footerData } from '../data/content';
import '../styles/main.css';

const Footer = () => {
  return (
    <footer>
      <p>{footerData.text}</p>
    </footer>
  );
};

export default Footer;