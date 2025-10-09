// src/components/ReservationModal.jsx
import React, { useState } from 'react';
import '../styles/reservasipc.css'; // Create this file for styling

const ReservationModal = ({ pc, onClose, onSubmit }) => {
  const [nama, setNama] = useState('');
  const [nrp, setNrp] = useState('');
  const [keperluan, setKeperluan] = useState('');
  const [tanggal, setTanggal] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ pcId: pc.id, nama, nrp, keperluan, tanggal });
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close-button" onClick={onClose}>&times;</button>
        <h3 className="modal-title">Reservasi {pc.title}</h3>
        <form onSubmit={handleSubmit} className="reservation-form">
          <div className="input-field">
            <label htmlFor="nama">
              <i className="fas fa-user"></i>
            </label>
            <input type="text" id="nama" placeholder="Nama" value={nama} onChange={(e) => setNama(e.target.value)} required />
          </div>
          <div className="input-field">
            <label htmlFor="nrp">
              <i className="fas fa-id-card"></i>
            </label>
            <input type="text" id="nrp" placeholder="NRP" value={nrp} onChange={(e) => setNrp(e.target.value)} required />
          </div>
          <div className="input-field">
            <label htmlFor="keperluan">
              <i className="fas fa-clipboard-list"></i>
            </label>
            <input type="text" id="keperluan" placeholder="Keperluan" value={keperluan} onChange={(e) => setKeperluan(e.target.value)} required />
          </div>
          <div className="input-field">
            <label htmlFor="tanggal">
              <i className="fas fa-calendar-alt"></i>
            </label>
            <input type="date" id="tanggal" placeholder="Tanggal" value={tanggal} onChange={(e) => setTanggal(e.target.value)} required />
          </div>
          <button type="submit" className="reserve-button">Reservasi</button>
        </form>
      </div>
    </div>
  );
};

export default ReservationModal;