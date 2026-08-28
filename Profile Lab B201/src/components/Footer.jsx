import React, { useState, useEffect } from 'react';
import { footerData } from '../data/content';
import { supabase } from '../config/supabase';
import '../styles/main.css';

const Footer = () => {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    let mounted = true;
    supabase.from('site_settings').select('*').single().then(({ data, error }) => {
      if (!error && mounted) setSettings(data);
    });
    return () => { mounted = false; };
  }, []);

  return (
    <footer>
      <p>{settings?.footer_text ?? footerData.text}</p>
    </footer>
  );
};

export default Footer;
