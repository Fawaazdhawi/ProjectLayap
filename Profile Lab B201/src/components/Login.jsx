import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Eye, EyeOff } from 'lucide-react';
import { supabase } from '../config/supabase';
import '../styles/main.css';
import '../styles/masuk.css';

const mapAuthError = (error) => {
  const message = (error?.message || '').toLowerCase();
  if (message.includes('invalid login credentials')) return 'Incorrect email or password';
  if (message.includes('email not confirmed')) return 'Please confirm your email before logging in';
  if (message.includes('invalid email') || message.includes('unable to validate email')) return 'Invalid email address';
  return 'An error occurred. Please try again.';
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
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      if (signInError) {
        setError(mapAuthError(signInError));
        return;
      }
      navigate('/admin-edit');
    } catch (err) {
      setError(mapAuthError(err));
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
        </div>
      </div>
    </section>
  );
};

export default Login;
