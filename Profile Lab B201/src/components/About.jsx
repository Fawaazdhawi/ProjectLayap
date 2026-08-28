import { useState, useEffect } from 'react';
import { aboutData } from '../data/content';
import { supabase } from '../config/supabase';
import useScrollReveal from '../hooks/useScrollReveal';
import '../styles/main.css';

const FALLBACK = {
  headingLine1: 'Welcome to',
  headingLine2: 'B201 Lab',
  description: aboutData.description,
  image: aboutData.image,
};

const About = () => {
  const [ref, isVisible] = useScrollReveal(0.1);
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    let mounted = true;
    supabase.from('site_settings').select('*').single().then(({ data, error }) => {
      if (!error && mounted) setSettings(data);
    });
    return () => { mounted = false; };
  }, []);

  return (
    <section
      id="about"
      style={{
        position: 'relative',
        overflow: 'hidden',
        minHeight: '420px',
        height: '55vh',
        maxHeight: '580px',
      }}
    >
      {/* Background */}
      <img
        src={settings?.about_background_image ?? FALLBACK.image}
        alt=""
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center',
          zIndex: 0,
        }}
      />

      {/* Dark overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(0,0,0,0.62)',
          zIndex: 1,
          pointerEvents: 'none',
        }}
      />

      {/* Content */}
      <div
        className={`container reveal-up ${isVisible ? 'active' : ''}`}
        ref={ref}
        style={{
          position: 'relative',
          zIndex: 2,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '4rem 0',
        }}
      >
        <div style={{ borderLeft: '4px solid #c0392b', paddingLeft: '1.25rem', marginBottom: '1.25rem' }}>
          <h2 style={{ color: '#fff', lineHeight: 1.2, marginBottom: '0.5rem' }}>
            {settings?.about_heading_line1 ?? FALLBACK.headingLine1}<br />{settings?.about_heading_line2 ?? FALLBACK.headingLine2}
          </h2>
        </div>

        <p
          style={{
            color: 'rgba(255,255,255,0.72)',
            lineHeight: 1.8,
            fontSize: '1rem',
            maxWidth: '560px',
          }}
        >
          {settings?.about_description ?? FALLBACK.description}
        </p>
      </div>
    </section>
  );
};

export default About;
