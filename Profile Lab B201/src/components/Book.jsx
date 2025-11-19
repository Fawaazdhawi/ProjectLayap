// src/components/ServiceCards.jsx
import React from 'react';
import { serviceCardsData } from '../data/content';
import { useNavigate } from 'react-router';
import '../styles/main.css';

const Book = () => {

  const navigate = useNavigate();

  const handleClick = (path) => {
    if (path) navigate(path);
    else navigate('/reservasi-pc');
  }

  return (
    <section className="service-cards-section">
      <div className="container">
        <div className="service-cards-grid">
          {serviceCardsData.map((service, index) => (
            <div
              key={index}
              className="service-card-item"
              onClick={() => handleClick(service.path)}
            >
              <div className="service-card-image-placeholder">
                <img src={service.image} alt={service.title} />
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