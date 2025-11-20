import React from 'react';
import { contactData } from '../data/content';
import '../styles/main.css';

const Contact = () => {
  return (
    <section className="contact-section">
      <div className="container contact-container">
        <h2>{contactData.title}</h2>
        <div className="contact-content-grid">
          <div className="contact-details">
            {contactData.details.map((detail, index) => (
              <div key={index} className="contact-box">
                <img 
                  src={detail.icon} 
                  alt={`${detail.label} icon`} 
                  className="contact-icon" 
                />
                
                  <p className="contact-label">{detail.label}</p> 
                  <p className="contact-value">{detail.value}</p>                 
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;