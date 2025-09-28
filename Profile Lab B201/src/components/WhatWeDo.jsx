import React from 'react';
import { whatWeDoData } from '../data/content';
import '../styles/main.css';

const WhatWeDo = () => {
  return (
    <section className="what-we-do-section" id="projects">
      <div className="container">
        <h2>{whatWeDoData.title}</h2>
        <div className="services-grid">
          {whatWeDoData.services.map((service, index) => (
            <div key={index} className="service-card">
              <img src={service.image} alt={service.title} />
              <h4>{service.title.split('<br />').join('')}</h4>
            </div>
          ))}
        </div>
        <p className="section-description">{whatWeDoData.description}</p>
      </div>
    </section>
  );
};

export default WhatWeDo;