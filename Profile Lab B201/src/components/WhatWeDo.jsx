import { useState, useEffect, useCallback } from 'react';
import { whatWeDoData } from '../data/content';
import { supabase } from '../config/supabase';
import useScrollReveal from '../hooks/useScrollReveal';
import '../styles/main.css';

const WhatWeDo = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [ref, isVisible] = useScrollReveal(0.1);
  const [services, setServices] = useState(whatWeDoData.services);
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    let mounted = true;
    supabase.from('site_settings').select('*').single().then(({ data, error }) => {
      if (!error && mounted) setSettings(data);
    });
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    const fetchServices = async () => {
      const { data, error } = await supabase
        .from('whatwedo_services')
        .select('*')
        .order('created_at', { ascending: true });
      if (!error) {
        setServices(data && data.length > 0 ? data : whatWeDoData.services);
        setActiveSlide((i) => (data && i >= data.length ? 0 : i));
      }
    };
    fetchServices();

    const channel = supabase
      .channel('public:whatwedo_services')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'whatwedo_services' }, fetchServices)
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  const prev = useCallback(() => {
    setActiveSlide(i => (i - 1 + services.length) % services.length);
  }, [services.length]);

  const next = useCallback(() => {
    setActiveSlide(i => (i + 1) % services.length);
  }, [services.length]);

  return (
    <section
      id="projects"
      style={{
        position: 'relative',
        overflow: 'hidden',
        minHeight: '560px',
        height: '72vh',
        maxHeight: '720px',
      }}
    >
      {/* Crossfading background images */}
      {services.map((service, i) => (
        <img
          key={i}
          src={service.image}
          alt=""
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center',
            opacity: activeSlide === i ? 1 : 0,
            transition: 'opacity 0.85s ease',
            zIndex: 0,
          }}
        />
      ))}

      {/* Gradient overlay — heavier on left so text is readable */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to right, rgba(0,0,0,0.88) 45%, rgba(0,0,0,0.38) 100%)',
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
          paddingTop: '2rem',
          paddingBottom: '2rem',
        }}
      >
        {/* Slide counter */}
        <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', fontWeight: 700, letterSpacing: '3px', marginBottom: '1.5rem' }}>
          {String(activeSlide + 1).padStart(2, '0')} / {String(services.length).padStart(2, '0')}
        </div>

        {/* Red accent bar + label + title */}
        <div style={{ borderLeft: '4px solid #c0392b', paddingLeft: '1.25rem', marginBottom: '1.5rem' }}>
          <p style={{ color: '#c0392b', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', margin: '0 0 0.5rem' }}>
            {settings?.whatwedo_title ?? 'What We Do'}
          </p>
          {settings?.whatwedo_description && (
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', lineHeight: 1.7, maxWidth: '480px', margin: '0 0 1rem' }}>
              {settings.whatwedo_description}
            </p>
          )}
          <h2
            key={activeSlide}
            style={{
              color: '#fff',
              margin: 0,
              lineHeight: 1.2,
              fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)',
              maxWidth: '540px',
              animation: 'fadeIn 0.45s ease',
            }}
          >
            {services[activeSlide].title}
          </h2>
        </div>

        {/* Description */}
        <p
          key={`desc-${activeSlide}`}
          style={{
            color: 'rgba(255,255,255,0.72)',
            maxWidth: '480px',
            lineHeight: 1.85,
            fontSize: '1rem',
            marginBottom: '2.5rem',
            animation: 'fadeIn 0.55s ease',
          }}
        >
          {services[activeSlide].description}
        </p>

        {/* Navigation row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {/* Prev button */}
          <button
            onClick={prev}
            aria-label="Previous"
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.12)',
              border: '1.5px solid rgba(255,255,255,0.35)',
              color: '#fff',
              fontSize: '1.1rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background 0.2s ease, border-color 0.2s ease',
              flexShrink: 0,
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#c0392b'; e.currentTarget.style.borderColor = '#c0392b'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.35)'; }}
          >
            ←
          </button>

          {/* Next button */}
          <button
            onClick={next}
            aria-label="Next"
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.12)',
              border: '1.5px solid rgba(255,255,255,0.35)',
              color: '#fff',
              fontSize: '1.1rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background 0.2s ease, border-color 0.2s ease',
              flexShrink: 0,
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#c0392b'; e.currentTarget.style.borderColor = '#c0392b'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.35)'; }}
          >
            →
          </button>

          {/* Dot indicators */}
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center', marginLeft: '0.5rem' }}>
            {services.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveSlide(i)}
                aria-label={`Slide ${i + 1}`}
                style={{
                  borderRadius: '999px',
                  background: i === activeSlide ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.28)',
                  width: i === activeSlide ? '20px' : '6px',
                  height: '6px',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                  transition: 'all 0.3s ease',
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhatWeDo;
