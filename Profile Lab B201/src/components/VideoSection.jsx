import { useState, useEffect } from 'react';
import { valuesData } from '../data/content';
import { supabase } from '../config/supabase';
import useScrollReveal from '../hooks/useScrollReveal';
import '../styles/main.css';

const VideoSection = () => {
  const [settings, setSettings] = useState(null);
  const [tabs, setTabs] = useState(valuesData.tabs);
  const [activeTab, setActiveTab] = useState(null);
  const [refVideo, isVideoVisible] = useScrollReveal(0.1);
  const [refCulture, isCultureVisible] = useScrollReveal(0.1);

  useEffect(() => {
    let mounted = true;
    supabase.from('site_settings').select('*').single().then(({ data, error }) => {
      if (!error && mounted) setSettings(data);
    });
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    const fetchTabs = async () => {
      const { data, error } = await supabase
        .from('culture_tabs')
        .select('*')
        .order('sort_order', { ascending: true });
      if (!error) {
        const next = data && data.length > 0 ? data : valuesData.tabs;
        setTabs(next);
      }
    };
    fetchTabs();

    const channel = supabase
      .channel('public:culture_tabs')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'culture_tabs' }, fetchTabs)
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  useEffect(() => {
    if (tabs.length && (activeTab === null || !tabs.some((t) => t.id === activeTab))) {
      setActiveTab(tabs[0].id);
    }
  }, [tabs, activeTab]);

  return (
    <section id="about-lab" style={{ background: '#fff', paddingBottom: 0 }}>

        {/* ── About Our Lab ── */}
        <div
          className={`reveal-up ${isVideoVisible ? 'active' : ''}`}
          ref={refVideo}
        >
          <div style={{ borderLeft: '4px solid #c0392b', paddingLeft: '1rem', marginBottom: '1.5rem' }}>
            <h2 className="video-section-title">{settings?.video_heading ?? 'About Our Lab'}</h2>
            <p className="video-section-subtitle" style={{ marginBottom: 0 }}>
              {settings?.video_subtitle ?? 'Watch the Department of Computer Engineering FTEIC-ITS profile'}
            </p>
          </div>
          <div className="video-embed-wrapper">
            <iframe
              src={settings?.video_url ?? 'https://www.youtube.com/embed/pJ7XZRFgeBU'}
              title="Lab B201 Video Profile"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          </div>
        </div>

      {/* ── Our Culture and Values ── */}
      <div
        style={{
          position: 'relative',
          overflow: 'hidden',
          minHeight: '500px',
          height: '65vh',
          maxHeight: '680px',
        }}
      >
        {/* Crossfading background images */}
        {tabs.map((tab) => (
          <img
            key={tab.id}
            src={tab.image}
            alt=""
            aria-hidden="true"
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center',
              opacity: activeTab === tab.id ? 1 : 0,
              transition: 'opacity 0.85s ease',
              zIndex: 0,
            }}
          />
        ))}

        {/* Dark overlay */}
        <div
          className={`reveal-up ${isCultureVisible ? 'active' : ''}`}
          ref={refCulture}
          style={{ marginTop: '6rem' }}
        >
          <div style={{ borderLeft: '4px solid #c0392b', paddingLeft: '1.25rem', marginBottom: '1.5rem' }}>
            <h2 style={{ color: '#fff', lineHeight: 1.2, marginBottom: 0 }}>
              {settings?.culture_title ?? valuesData.title}
            </h2>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1.75rem' }}>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`about-tab-btn ${activeTab === tab.id ? 'about-tab-active' : ''}`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div style={{ maxWidth: '520px' }}>
            {tabs.map((tab) => (
              <div
                key={tab.id}
                style={{
                  display: activeTab === tab.id ? 'block' : 'none',
                  animation: activeTab === tab.id ? 'fadeIn 0.4s ease' : 'none',
                }}
              >
                <p style={{ color: 'rgba(255,255,255,0.78)', lineHeight: 1.85, fontSize: '1rem', margin: 0 }}>
                  {tab.content}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default VideoSection;
