import React, { useState } from 'react';
import '../styles/main.css';
import '../styles/masuk.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    console.log('Login attempt with:', { email, password });
  };

  return (
<section className="login-section">
    <div className="login-container">
      <div className="login-form-card">
        <h3>Masuk</h3>
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
            </span>
          </div>
          <button type="submit" href="/reservasi" className="login-button">Masuk</button>
        </form>
        <div className="register-link">
          <p>Belum punya akun? <a href="">Daftar</a></p>
        </div>
      </div>
    </div>
</section>
  );
};

export default Login;