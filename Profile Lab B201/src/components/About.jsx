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
            {/* Teks "Computer Engineering ITS Video Profile" tetap sebagai tautan,
                tapi video disematkan di bawahnya */}
            <a className="about-link about-hover" href="https://www.youtube.com/watch?v=pJ7XZRFgeBU&t=2s" target="_blank">
              {aboutData.aboutTitle}
            </a>
          </div>
          {/* Bagian ini telah diganti dengan iframe video YouTube */}
          <div className="video-container">
            <iframe
              src="https://www.youtube.com/embed/pJ7XZRFgeBU"
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen>
            </iframe>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;