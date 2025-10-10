import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebase';
import '../styles/main.css';
import '../styles/masuk.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert('Login successful!');
      navigate('/reservasi');
    } catch (error) {
      console.error('Login error:', error);
      
      // Handle specific error messages
      switch (error.code) {
        case 'auth/invalid-email':
          setError('Email tidak valid');
          break;
        case 'auth/user-not-found':
          setError('Akun tidak ditemukan');
          break;
        case 'auth/wrong-password':
          setError('Password salah');
          break;
        case 'auth/invalid-credential':
          setError('Email atau password salah');
          break;
        default:
          setError('Terjadi kesalahan. Silakan coba lagi.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="login-section">
      <div className="login-container">
        <div className="login-form-card">
          <h3>Masuk</h3>
          {error && <p style={{ color: '#ff4444', marginBottom: '1rem', fontSize: '0.9rem' }}>{error}</p>}
          <form onSubmit={handleLogin}>
            <div className="input-group">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <div className="input-group">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
              <span
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
              </span>
            </div>
            <button type="submit" className="login-button" disabled={loading}>
              {loading ? 'Memproses...' : 'Masuk'}
            </button>
          </form>
          <div className="register-link">
            <p>Belum punya akun? 
              <Link to="/register">Daftar</Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;