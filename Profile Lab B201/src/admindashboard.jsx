// Profile Lab B201/src/AdminDashboard.jsx
import { useState, useEffect } from 'react';
import './styles/admin.css';

const AdminDashboard = () => {
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
  
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState(localStorage.getItem('adminToken'));
  const [contentList, setContentList] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    section: '',
    content: '',
    image_url: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (token) {
      setIsLoggedIn(true);
      fetchContent();
    }
  }, [token]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Login failed');
      }

      const data = await response.json();
      localStorage.setItem('adminToken', data.token);
      setToken(data.token);
      setIsLoggedIn(true);
      setEmail('');
      setPassword('');
      setSuccess('Login successful!');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchContent = async () => {
    try {
      const response = await fetch(`${API_URL}/content`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setContentList(data);
      }
    } catch (err) {
      console.error('Failed to fetch content:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const method = editingId ? 'PUT' : 'POST';
      const url = editingId ? `${API_URL}/content/${editingId}` : `${API_URL}/content`;

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to save content');
      }

      setSuccess(editingId ? 'Content updated!' : 'Content created!');
      setFormData({ title: '', section: '', content: '', image_url: '' });
      setEditingId(null);
      await fetchContent();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setFormData(item);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this content?')) return;

    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/content/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        setSuccess('Content deleted!');
        await fetchContent();
      } else {
        throw new Error('Failed to delete content');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setToken(null);
    setIsLoggedIn(false);
    setFormData({ title: '', section: '', content: '', image_url: '' });
    setEditingId(null);
  };

  if (!isLoggedIn) {
    return (
      <section className="login-section">
        <div className="login-container">
          <div className="login-form-card">
            <h3>Admin Login</h3>
            {error && <p className="error-message">{error}</p>}
            {success && <p className="success-message">{success}</p>}
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
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
              <button type="submit" className="login-button" disabled={loading}>
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </form>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="admin-dashboard-section">
      <div className="container">
        <div className="dashboard-header">
          <h1>Admin Dashboard</h1>
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </div>

        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}

        <div className="dashboard-content">
          <div className="form-section">
            <h2>{editingId ? 'Edit Content' : 'Create Content'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <label>Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  placeholder="Enter title"
                  disabled={loading}
                />
              </div>
              <div className="input-group">
                <label>Section</label>
                <input
                  type="text"
                  value={formData.section}
                  onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                  required
                  placeholder="e.g., hero, features, footer"
                  disabled={loading}
                />
              </div>
              <div className="input-group">
                <label>Content</label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  required
                  placeholder="Enter content"
                  disabled={loading}
                  rows="5"
                />
              </div>
              <div className="input-group">
                <label>Image URL</label>
                <input
                  type="url"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  placeholder="https://example.com/image.jpg (optional)"
                  disabled={loading}
                />
              </div>
              <div className="button-group">
                <button type="submit" className="submit-button" disabled={loading}>
                  {loading ? 'Saving...' : editingId ? 'Update Content' : 'Create Content'}
                </button>
                {editingId && (
                  <button
                    type="button"
                    className="cancel-button"
                    onClick={() => {
                      setEditingId(null);
                      setFormData({ title: '', section: '', content: '', image_url: '' });
                    }}
                    disabled={loading}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          <div className="content-list-section">
            <h2>Content List</h2>
            {contentList.length === 0 ? (
              <p className="empty-state">No content yet. Create your first content above!</p>
            ) : (
              <div className="content-grid">
                {contentList.map((item) => (
                  <div key={item.id} className="content-card">
                    <h3>{item.title}</h3>
                    <p><strong>Section:</strong> {item.section}</p>
                    <p><strong>Content:</strong> {item.content.substring(0, 80)}...</p>
                    {item.image_url && <p><strong>Image:</strong> {item.image_url}</p>}
                    <div className="card-actions">
                      <button
                        onClick={() => handleEdit(item)}
                        className="edit-button"
                        disabled={loading}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="delete-button"
                        disabled={loading}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdminDashboard;