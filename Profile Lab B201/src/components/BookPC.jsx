
import React, { useState } from 'react';
import { serviceCardsData } from '../data/reserve';
import ReservationModal from './ReservationModal';
import '../styles/main.css';
import '../styles/service.css';

const BookPC = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedPC, setSelectedPC] = useState(null);

  const handleCardClick = (pc) => {
    setSelectedPC(pc);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedPC(null);
  };

  const handleReservationSubmit = (reservationData) => {
    console.log('Reservation data submitted:', reservationData);
    alert(`Reservasi untuk ${reservationData.pcTitle || 'PC'} berhasil!`);
  };

  return (
    <section className="service-cards-section">
      <div className="container">
        <h1 style={{ marginBottom: '50px', textAlign: 'center', color: 'white' }}>Lab B201 PC Reservation</h1>
        <div className="service-cards-grid">
          {serviceCardsData.map((service, index) => (
            <div
              key={index}
              className="service-card-item"
              onClick={() => handleCardClick(service)}
            >
              <div className="service-card-image-placeholder">  
                {service.Image && <img src={service.Image} alt={service.title} />}
              </div>
              <h4>{service.title}</h4>
            </div>
          ))}
        </div>
      </div>

      {showModal && selectedPC && (
        <ReservationModal
          pc={selectedPC}
          onClose={handleCloseModal}
          onSubmit={handleReservationSubmit}
        />
      )}
    </section>
  );
};

export default BookPC;