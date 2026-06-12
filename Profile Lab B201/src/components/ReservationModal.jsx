import React, { useState } from 'react';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { db, auth } from '../config/firebase';
import '../styles/reservasipc.css';

const ReservationModal = ({ pc, onClose, onSubmit }) => {
  const [fullName, setFullName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [purpose, setPurpose] = useState('');
  const [date, setDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const checkExistingReservation = async () => {
    const reservationsRef = collection(db, 'reservations');
    const q = query(
      reservationsRef,
      where('pcId', '==', pc.title),
      where('tanggal', '==', date)
    );
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!auth.currentUser) {
        alert('Please log in first');
        setLoading(false);
        return;
      }

      const isReserved = await checkExistingReservation();
      if (isReserved) {
        setError('This PC is already reserved for the selected date');
        setLoading(false);
        return;
      }

      const reservationData = {
        pcId: pc.title,
        pcImage: pc.Image || '',
        nama: fullName,
        nrp: studentId,
        keperluan: purpose,
        tanggal: date,
        userId: auth.currentUser.uid,
        userEmail: auth.currentUser.email,
        status: 'pending',
        createdAt: new Date(),
      };

      const docRef = await addDoc(collection(db, 'reservations'), reservationData);
      console.log('Reservation saved with ID:', docRef.id);

      onSubmit(reservationData);
      alert(`Reservation for ${pc.title} was successful!`);
      onClose();
    } catch (err) {
      console.error('Error saving reservation:', err);
      setError('Failed to save reservation. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content-reservasi">
        <button className="modal-close-button" onClick={onClose}>&times;</button>
        <h3 className="modal-title">Reserve {pc.title}</h3>
        {error && <p style={{ color: '#ff4444', marginBottom: '1rem', fontSize: '0.9rem', textAlign: 'center' }}>{error}</p>}
        <form onSubmit={handleSubmit} className="reservation-form">
          <div className="input-field">
            <label htmlFor="fullName">
              <i className="fas fa-user"></i>
            </label>
            <input
              type="text"
              id="fullName"
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          <div className="input-field">
            <label htmlFor="studentId">
              <i className="fas fa-id-card"></i>
            </label>
            <input
              type="text"
              id="studentId"
              placeholder="Student ID (NRP)"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          <div className="input-field">
            <label htmlFor="purpose">
              <i className="fas fa-clipboard-list"></i>
            </label>
            <input
              type="text"
              id="purpose"
              placeholder="Purpose"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          <div className="input-field">
            <label htmlFor="date">
              <i className="fas fa-calendar-alt"></i>
            </label>
            <input
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              disabled={loading}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
          <button type="submit" className="reserve-button" disabled={loading}>
            {loading ? 'Saving...' : 'Reserve'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReservationModal;
