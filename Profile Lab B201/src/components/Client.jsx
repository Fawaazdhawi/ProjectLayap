import React from 'react';
import { clientsData } from '../data/content';
import '../styles/main.css';

const Clients = () => {
  return (
    <section className="clients-section">
      <div className="container">
        <div className="clients-header">
          <h2>{clientsData.title}</h2>
          <button className="subscribe-button">{clientsData.subtitle}</button>
        </div>
        <p className="clients-description">{clientsData.description}</p>
        <div className="logos-container">
          {clientsData.logos.map((logo, index) => (
            <img key={index} src={logo} alt={`Client ${index + 1}`} className="client-logo" />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Clients;