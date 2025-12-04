import React, { useState } from 'react';
import '../styles/reservasipc.css';

const ReservationModal = ({ pc, onClose, onSubmit }) => {
  const [nama, setNama] = useState('');
  const [nrp, setNrp] = useState('');
  const [keperluan, setKeperluan] = useState('');
  const [tanggal, setTanggal] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const checkExistingReservation = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/reservations/check?pcId=${pc.title}&tanggal=${tanggal}`);
      const data = await response.json();
      return data.exists || false;
    } catch (error) {
      console.error('Error checking reservation:', error);
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Silakan login terlebih dahulu');
        setLoading(false);
        return;
      }

      const isReserved = await checkExistingReservation();
      if (isReserved) {
        setError('PC sudah direservasi untuk tanggal ini');
        setLoading(false);
        return;
      }

      const reservationData = {
        pcId: pc.title,
        pcImage: pc.Image || '',
        nama,
        nrp,
        keperluan,
        tanggal,
        status: 'pending'
      };
      
      const response = await fetch('http://localhost:3000/api/reservations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(reservationData)
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Gagal menyimpan reservasi');
        return;
      }

      console.log('Reservation saved with ID:', data.id);
      onSubmit(reservationData);
      alert(`Reservasi untuk ${pc.title} berhasil!`);
      onClose();
    } catch (error) {
      console.error('Error saving reservation:', error);
      setError('Gagal menyimpan reservasi. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content-reservasi">
        <button className="modal-close-button" onClick={onClose}>&times;</button>
        <h3 className="modal-title">Reservasi {pc.title}</h3>
        {error && <p style={{ color: '#ff4444', marginBottom: '1rem', fontSize: '0.9rem', textAlign: 'center' }}>{error}</p>}
        <form onSubmit={handleSubmit} className="reservation-form">
          <div className="input-field">
            <label htmlFor="nama">
              <i className="fas fa-user"></i>
            </label>
            <input 
              type="text" 
              id="nama" 
              placeholder="Nama" 
              value={nama} 
              onChange={(e) => setNama(e.target.value)} 
              required 
              disabled={loading}
            />
          </div>
          <div className="input-field">
            <label htmlFor="nrp">
              <i className="fas fa-id-card"></i>
            </label>
            <input 
              type="text" 
              id="nrp" 
              placeholder="NRP" 
              value={nrp} 
              onChange={(e) => setNrp(e.target.value)} 
              required 
              disabled={loading}
            />
          </div>
          <div className="input-field">
            <label htmlFor="keperluan">
              <i className="fas fa-clipboard-list"></i>
            </label>
            <input 
              type="text" 
              id="keperluan" 
              placeholder="Keperluan" 
              value={keperluan} 
              onChange={(e) => setKeperluan(e.target.value)} 
              required 
              disabled={loading}
            />
          </div>
          <div className="input-field">
            <label htmlFor="tanggal">
              <i className="fas fa-calendar-alt"></i>
            </label>
            <input 
              type="date" 
              id="tanggal" 
              placeholder="Tanggal" 
              value={tanggal} 
              onChange={(e) => setTanggal(e.target.value)} 
              required 
              disabled={loading}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
          <button type="submit" className="reserve-button" disabled={loading}>
            {loading ? 'Menyimpan...' : 'Reservasi'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReservationModal;