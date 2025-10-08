import React from 'react';
import { aboutData } from '../data/content';
import '../styles/main.css';

const About = () => {
  return (
    <section className="about-section" id="about">
      <div className="container about-container background-image">
        <div className="about-text-left">
          <h2>Welcome to <br /> B201 Lab</h2>
          <p>{aboutData.description}</p>  
        </div>
        <div className="about-content-right">
          <div className="about-header">
            <a className="about-link about-hover" href="https://www.youtube.com/watch?v=pJ7XZRFgeBU&t=2s">{aboutData.aboutTitle}</a>
          </div>
          <img src={aboutData.image} alt="About Lab B201" className='about-image-right' />
        </div>
      </div>
    </section>
  );
};

export default About;