import { useState } from 'react';
import { valuesData } from '../data/content';
import useScrollReveal from '../hooks/useScrollReveal';
import '../styles/main.css';

const VideoSection = () => {
  const [activeTab, setActiveTab] = useState(valuesData.tabs[0].id);
  const [refVideo, isVideoVisible] = useScrollReveal(0.1);
  const [refCulture, isCultureVisible] = useScrollReveal(0.1);

  return (
    <section id="about-lab" style={{ background: '#fff' }}>

      {/* ── Video ── */}
      <div style={{ padding: '5rem 0' }}>
        <div
          className={`container reveal-up ${isVideoVisible ? 'active' : ''}`}
          ref={refVideo}
        >
          <div style={{ borderLeft: '4px solid #c0392b', paddingLeft: '1rem', marginBottom: '1.5rem' }}>
            <h2 className="video-section-title">About Our Lab</h2>
            <p className="video-section-subtitle" style={{ marginBottom: 0 }}>
              Watch the Department of Computer Engineering FTEIC-ITS profile
            </p>
          </div>
          <div className="video-embed-wrapper">
            <iframe
              src="https://www.youtube.com/embed/pJ7XZRFgeBU"
              title="Lab B201 Video Profile"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          </div>
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
        {valuesData.tabs.map((tab) => (
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
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(0,0,0,0.65)',
            zIndex: 1,
            pointerEvents: 'none',
          }}
        />

        {/* Content */}
        <div
          className={`container reveal-up ${isCultureVisible ? 'active' : ''}`}
          ref={refCulture}
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
          <div style={{ borderLeft: '4px solid #c0392b', paddingLeft: '1.25rem', marginBottom: '1.5rem' }}>
            <h2 style={{ color: '#fff', lineHeight: 1.2, marginBottom: 0 }}>
              {valuesData.title}
            </h2>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1.75rem' }}>
            {valuesData.tabs.map((tab) => (
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
            {valuesData.tabs.map((tab) => (
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
