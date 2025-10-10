import React, { useState } from 'react';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { db, auth } from '../config/firebase';
import '../styles/reservasipc.css';

const ReservationModal = ({ pc, onClose, onSubmit }) => {
  const [nama, setNama] = useState('');
  const [nrp, setNrp] = useState('');
  const [keperluan, setKeperluan] = useState('');
  const [tanggal, setTanggal] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const checkExistingReservation = async () => {
    // Check if PC is already reserved for the selected date
    const reservationsRef = collection(db, 'reservations');
    const q = query(
      reservationsRef,
      where('pcId', '==', pc.title),
      where('tanggal', '==', tanggal)
    );
    
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      // Check if user is logged in
      if (!auth.currentUser) {
        alert('Silakan login terlebih dahulu');
        setLoading(false);
        return;
      }

      // Check if PC is already reserved for this date
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
        userId: auth.currentUser.uid,
        userEmail: auth.currentUser.email,
        status: 'pending',
        createdAt: new Date()
      };
      
      // Save to Firestore
      const docRef = await addDoc(collection(db, 'reservations'), reservationData);
      console.log('Reservation saved with ID:', docRef.id);
      
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
      <div className="modal-content">
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