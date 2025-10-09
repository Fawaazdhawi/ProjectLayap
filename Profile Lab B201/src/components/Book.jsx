// src/components/ServiceCards.jsx
import React from 'react';
import { serviceCardsData } from '../data/content';
import '../styles/main.css';
import '../styles/service.css';

const Book = ({ onNavigate }) => {
  return (
    <section className="service-cards-section">
      <div className="container">
        <div className="service-cards-grid">
          {serviceCardsData.map((service, index) => (
            <div
              key={index}
              className="service-card-item"
              onClick={() => onNavigate(service.href)}
            >
              <div className="service-card-image-placeholder">
                {/* Tambahkan elemen gambar jika Anda memiliki gambar untuk kartu */}
                {/* <img src={service.image} alt={service.title} /> */}
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