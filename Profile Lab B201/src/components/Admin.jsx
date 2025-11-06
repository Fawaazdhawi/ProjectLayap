// src/components/ServiceCards.jsx
import React from 'react';
import { cardData } from '../data/content';
import { useNavigate } from 'react-router';
import '../styles/main.css';
import '../styles/admin.css';

const AdminEdit = () => {

  const navigate = useNavigate();

  const handleClick = (path) => {
    if (path) navigate(path);
    else navigate('/reservasi-pc');
  }

  return (
    <section className="service-edit-section">
      <div className="container">
        <h2 style={{fontSize: 50, fontStyle: 'italic'}}>Create & Edit Page</h2> <br />
        <div className="service-edit-grid">
          {cardData.map((service, index) => (
            <div
              key={index}
              className="service-edit-item"
              onClick={() => handleClick(service.path)}
            >
              <h4>{service.title}</h4>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AdminEdit;