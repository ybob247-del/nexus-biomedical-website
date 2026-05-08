import React, { useState, useEffect } from 'react';

export default function AdminProtectedRoute({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [checking, setChecking] = useState(true);
  const [loading, setLoading] = useState(false);

  // Verify any existing token with the server on mount
  useEffect(() => {
    const verifyToken = async () => {
      try {
        const token = sessionStorage.getItem('admin_token');
        const headers = { 'Content-Type': 'application/json' };
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }
        const res = await fetch('/api/admin/verify', {
          method: 'GET',
          credentials: 'include',
          headers,
        });
        const data = await res.json();
        setIsAuthenticated(!!data.valid);
      } catch {
        setIsAuthenticated(false);
      } finally {
        setChecking(false);
      }
    };
    verifyToken();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        if (data.token) {
          sessionStorage.setItem('admin_token', data.token);
        }
        setIsAuthenticated(true);
        setPassword('');
      } else {
        setError(data.error || 'Incorrect password');
        setPassword('');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: 'linear-gradient(135deg, #0A1B3D 0%, #1a2942 50%, #0A1B3D 100%)' }}>
        <div style={{ color: '#60a5fa', fontSize: '1.5rem', fontWeight: 600 }}>Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0A1B3D 0%, #1a2942 50%, #0A1B3D 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
      }}>
        <div style={{
          maxWidth: '400px',
          width: '100%',
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '20px',
          padding: '2rem',
        }}>
          <h2 style={{
            fontSize: '2rem',
            fontWeight: 800,
            marginBottom: '0.5rem',
            background: 'linear-gradient(135deg, #60A5FA 0%, #FFFFFF 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textAlign: 'center',
          }}>
            Admin Access
          </h2>
          <p style={{ color: '#B8D4E8', marginBottom: '2rem', textAlign: 'center' }}>
            Enter password to access admin panel
          </p>
          <form onSubmit={handleSubmit}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              disabled={loading}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                borderRadius: '10px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                background: 'rgba(255, 255, 255, 0.05)',
                color: '#FFFFFF',
                fontSize: '1rem',
                marginBottom: '1rem',
              }}
              autoFocus
            />
            {error && (
              <div style={{
                padding: '0.75rem',
                borderRadius: '10px',
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: '#EF4444',
                marginBottom: '1rem',
                textAlign: 'center',
              }}>
                {error}
              </div>
            )}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                background: loading ? '#3B82F6' : 'linear-gradient(135deg, #60A5FA 0%, #3B82F6 100%)',
                color: 'white',
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '10px',
                fontSize: '1rem',
                fontWeight: 600,
                cursor: loading ? 'wait' : 'pointer',
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? 'Verifying...' : 'Access Admin Panel'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return children;
}
