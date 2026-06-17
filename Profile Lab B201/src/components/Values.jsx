import React, { useState } from 'react';
import { valuesData } from '../data/content';
import useScrollReveal from '../hooks/useScrollReveal';
import '../styles/main.css';

const Values = () => {
  const [activeTab, setActiveTab] = useState('collaboration');
  const [ref, isVisible] = useScrollReveal(0.1);

  return (
    <section
      id="values"
      style={{
        position: 'relative',
        overflow: 'hidden',
        padding: '6rem 0',
        minHeight: '520px',
        height: '70vh',
        maxHeight: '700px',
      }}
    >
      {/* Background images — all identical size/crop so crossfade is seamless */}
      {valuesData.tabs.map((tab) => (
        <img
          key={tab.id}
          src={tab.image}
          alt={tab.label}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center center',
            transform: 'scale(1)',
            opacity: activeTab === tab.id ? 1 : 0,
            transition: 'opacity 0.85s ease',
            zIndex: 0,
          }}
        />
      ))}

      {/* 20% dim overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(0,0,0,0.5)',
          zIndex: 1,
          pointerEvents: 'none',
        }}
      />

      {/* Content */}
      <div
        className={`container values-container reveal-up ${isVisible ? 'active' : ''}`}
        ref={ref}
        style={{ position: 'relative', zIndex: 2 }}
      >
        <div className="values-content-left">
          <h2>{valuesData.title.split(' ').map((word, index) => (
            <React.Fragment key={index}>{word}<br /></React.Fragment>
          ))}</h2>
          <div className="tabs">
            {valuesData.tabs.map((tab) => (
              <button
                key={tab.id}
                className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div className="tab-content">
            {valuesData.tabs.map((tab) => (
              <div key={tab.id} className={`tab-pane ${activeTab === tab.id ? 'active' : ''}`}>
                <p>{tab.content}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Values;
