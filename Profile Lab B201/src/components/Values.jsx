import React, { useState } from 'react';
import { valuesData } from '../data/content';
import '../styles/main.css';

const Values = () => {
  const [activeTab, setActiveTab] = useState('collaboration');

  return (
    <section className="values-section">
      <div className="container values-container">
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
        <div className="values-image-right">
          {valuesData.tabs.map((tab) => (
            <img
              key={tab.id}
              src={tab.image}
              alt={tab.label}
              className={`tab-image ${activeTab === tab.id ? 'active' : ''}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Values;