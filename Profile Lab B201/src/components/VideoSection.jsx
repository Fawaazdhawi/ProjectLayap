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
      <div className="container" style={{ padding: '6rem 0' }}>

        {/* ── About Our Lab ── */}
        <div
          className={`reveal-up ${isVideoVisible ? 'active' : ''}`}
          ref={refVideo}
        >
          <div style={{ borderLeft: '4px solid #c0392b', paddingLeft: '1.25rem', marginBottom: '2rem' }}>
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

        {/* ── Our Culture and Values ── */}
        <div
          className={`reveal-up ${isCultureVisible ? 'active' : ''}`}
          ref={refCulture}
          style={{ marginTop: '6rem' }}
        >
          <div style={{ borderLeft: '4px solid #c0392b', paddingLeft: '1.25rem', marginBottom: '2rem' }}>
            <h2 style={{ color: '#1a1a1a', lineHeight: 1.2, marginBottom: 0 }}>
              {valuesData.title}
            </h2>
          </div>

          <div className="culture-grid">
            {/* Left: tabs + text */}
            <div>
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

              {valuesData.tabs.map((tab) => (
                <div
                  key={tab.id}
                  style={{
                    display: activeTab === tab.id ? 'block' : 'none',
                    animation: activeTab === tab.id ? 'fadeIn 0.4s ease' : 'none',
                  }}
                >
                  <p style={{ color: '#555', lineHeight: 1.85, fontSize: '1.05rem', margin: 0 }}>
                    {tab.content}
                  </p>
                </div>
              ))}
            </div>

            {/* Right: crossfading image card */}
            <div className="culture-image-card">
              {valuesData.tabs.map((tab) => (
                <img
                  key={tab.id}
                  src={tab.image}
                  alt={tab.label}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: 'center',
                    opacity: activeTab === tab.id ? 1 : 0,
                    transition: 'opacity 0.7s ease',
                  }}
                />
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default VideoSection;
