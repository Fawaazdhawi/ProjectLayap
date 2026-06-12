import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { Eye, EyeOff } from 'lucide-react';
import { auth } from '../config/firebase';
import '../styles/main.css';
import '../styles/masuk.css';

const ERROR_MESSAGES = {
  'auth/invalid-email': 'Invalid email address',
  'auth/user-not-found': 'Account not found',
  'auth/wrong-password': 'Incorrect password',
  'auth/invalid-credential': 'Incorrect email or password',
};

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
      navigate('/admin');
    } catch (err) {
      setError(ERROR_MESSAGES[err.code] ?? 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="login-section">
      <div className="login-container">
        <div className="login-form-card">
          <h3>Sign In</h3>
          {error && <p className="auth-error">{error}</p>}
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
            <div className="input-group password-group">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <button type="submit" className="login-button" disabled={loading}>
              {loading ? 'Processing...' : 'Sign In'}
            </button>
          </form>
          <div className="register-link">
            <p>Don't have an account? <Link to="/register">Register</Link></p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
