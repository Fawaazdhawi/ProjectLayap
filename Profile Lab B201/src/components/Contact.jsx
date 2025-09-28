import React from 'react';
import { contactData } from '../data/content';
import '../styles/main.css';

const Contact = () => {
  return (
    <section className="contact-section">
      <div className="container contact-container">
        <h2>{contactData.title}</h2>
        <div className="contact-content-grid">
          <div className="contact-image">
            <img src={contactData.image} alt="Contact person" />
          </div>
          <div className="contact-details">
            {contactData.details.map((detail, index) => (
              <div key={index} className="contact-box">
                <p>{detail.label}</p>
                <p>{detail.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;