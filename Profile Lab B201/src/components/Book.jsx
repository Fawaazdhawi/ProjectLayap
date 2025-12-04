// src/components/ServiceCards.jsx
import React from 'react';
import { serviceCardsData } from '../data/content';
import { useNavigate } from 'react-router';
import '../styles/main.css';
import '../styles/service.css';

const Book = () => {

  const navigate = useNavigate();

  const handleClick = (path) => {
    if (path) navigate(path);
  }

  return (
    <section className="service-cards-book-section">
      <div className="container">
        <div className="service-edit-grid-2colomn">
          {serviceCardsData.map((service, index) => (
            <div
              key={index}
              className="service-card-item-book"
              onClick={() => handleClick(service.path)}
            >
              {/* <div className="service-card-image-placeholder">
                <img src={service.image} alt={service.title} />
              </div> */}
              
              <h4>{service.title}</h4>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Book;