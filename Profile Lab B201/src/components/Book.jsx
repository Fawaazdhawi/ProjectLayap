// src/components/ServiceCards.jsx
import React from 'react';
import { serviceCardsData } from '../data/content';
import { useNavigate } from 'react-router';
import '../styles/main.css';
import '../styles/service.css';

const Book = () => {

  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/reservasi-pc');
  }

  return (
    <section className="service-cards-section">
      <div className="container">
        <div className="service-cards-grid">
          {serviceCardsData.map((service, index) => (
            <div
              key={index}
              className="service-card-item"
              onClick={handleClick}
            >
              <div className="service-card-image-placeholder">
              </div>
              <h4>{service.title}</h4>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Book;