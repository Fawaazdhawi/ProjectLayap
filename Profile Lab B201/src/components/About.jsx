import React from 'react';
import { aboutData } from '../data/content';
import '../styles/main.css';

const About = () => {
  return (
    <section className="about-section" id="about">
      <div className="container about-container">
        <div className="about-text-left">
          <h2>Welcome to <br /> Our Lab.</h2>
        </div>
        <div className="about-content-right">
          <div className="about-header">
            <h3>{aboutData.aboutTitle}</h3>
          </div>
          <p>{aboutData.description}</p>
          <div className="stats-grid">
            {aboutData.stats.map((stat, index) => (
              <div key={index} className="stat-item">
                <h4>{stat.value}</h4>
                <p>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;