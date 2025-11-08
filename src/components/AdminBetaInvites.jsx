import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminBetaInvites() {
  // Password protection state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [checking, setChecking] = useState(true);

  // Form state
  const [email, setEmail] = useState('');
  const [days, setDays] = useState(60);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [recentInvites, setRecentInvites] = useState([]);
  const navigate = useNavigate();

  // Check authentication on mount
  useEffect(() => {
    console.log('AdminBetaInvites: Checking authentication...');
    const auth = sessionStorage.getItem('admin_authenticated');
    console.log('AdminBetaInvites: auth value:', auth);
    if (auth === 'true') {
      console.log('AdminBetaInvites: User is authenticated');
      setIsAuthenticated(true);
    } else {
      console.log('AdminBetaInvites: User is NOT authenticated');
    }
    setChecking(false);
  }, []);

  // Handle password submission
  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    const ADMIN_PASSWORD = 'nexus2025';
    
    if (passwordInput === ADMIN_PASSWORD) {
      sessionStorage.setItem('admin_authenticated', 'true');
      setIsAuthenticated(true);
      setPasswordError('');
      console.log('AdminBetaInvites: Password correct, authenticated');
    } else {
      setPasswordError('Incorrect password');
      setPasswordInput('');
      console.log('AdminBetaInvites: Password incorrect');
    }
  };

  // Handle beta invite submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/admin/send-beta-invite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, days }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(`✅ Beta invite sent to ${email}!`);
        setEmail('');
        setRecentInvites([{ email, days, timestamp: new Date().toISOString() }, ...recentInvites.slice(0, 9)]);
      } else {
        setMessage(`❌ Error: ${data.error || 'Failed to send invite'}`);
      }
    } catch (error) {
      setMessage(`❌ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  console.log('AdminBetaInvites: Rendering... checking:', checking, 'isAuthenticated:', isAuthenticated);

  // Show loading
  if (checking) {
    console.log('AdminBetaInvites: Showing loading screen');
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: 'linear-gradient(135deg, #0A1B3D 0%, #1a2942 50%, #0A1B3D 100%)' }}>
        <div style={{ color: '#60a5fa', fontSize: '1.5rem', fontWeight: 600 }}>Loading...</div>
      </div>
    );
  }

  // Show password prompt if not authenticated
  if (!isAuthenticated) {
    console.log('AdminBetaInvites: Showing password prompt');
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
          background: '#FFFFFF',
          border: '3px solid #60A5FA',
          borderRadius: '20px',
          padding: '2rem',
          boxShadow: '0 10px 40px rgba(96, 165, 250, 0.5)',
        }}>
          <h2 style={{
            fontSize: '2rem',
            fontWeight: 800,
            marginBottom: '0.5rem',
            color: '#0A1B3D',
            textAlign: 'center',
          }}>
            🔐 Admin Access
          </h2>
          <p style={{ color: '#1a2942', marginBottom: '2rem', textAlign: 'center', fontSize: '1.1rem' }}>
            Enter password to access admin panel
          </p>
          <form onSubmit={handlePasswordSubmit}>
            <input
              type="password"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              placeholder="Enter admin password"
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                borderRadius: '10px',
                border: '2px solid #60A5FA',
                background: '#F0F9FF',
                color: '#0A1B3D',
                fontSize: '1.1rem',
                marginBottom: '1rem',
              }}
              autoFocus
            />
            {passwordError && (
              <div style={{
                padding: '0.75rem',
                borderRadius: '10px',
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: '#EF4444',
                marginBottom: '1rem',
                textAlign: 'center',
              }}>
                {passwordError}
              </div>
            )}
            <button
              type="submit"
              style={{
                width: '100%',
                background: 'linear-gradient(135deg, #60A5FA 0%, #3B82F6 100%)',
                color: 'white',
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '10px',
                fontSize: '1rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Access Admin Panel
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Show admin panel if authenticated
  console.log('AdminBetaInvites: Showing admin panel');
  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0A1B3D 0%, #1a2942 50%, #0A1B3D 100%)', color: '#FFFFFF', padding: '2rem' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <button onClick={() => navigate('/')} style={{ background: 'rgba(255, 255, 255, 0.1)', border: '1px solid rgba(255, 255, 255, 0.2)', color: '#FFFFFF', padding: '0.75rem 1.5rem', borderRadius: '30px', cursor: 'pointer', fontSize: '1rem', fontWeight: 600, marginBottom: '2rem' }}>
          ← Back to Home
        </button>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.5rem', background: 'linear-gradient(135deg, #60A5FA 0%, #FFFFFF 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Beta Invite Management
        </h1>
        <p style={{ color: '#B8D4E8', marginBottom: '3rem' }}>Grant beta access to users for all 6 platforms</p>
        <form onSubmit={handleSubmit} style={{ background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '20px', padding: '2rem', marginBottom: '2rem' }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Email Address</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="pharmacist@hospital.com" style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.2)', background: 'rgba(255, 255, 255, 0.05)', color: '#FFFFFF', fontSize: '1rem' }} />
          </div>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Access Duration (Days)</label>
            <select value={days} onChange={(e) => setDays(Number(e.target.value))} style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.2)', background: 'rgba(255, 255, 255, 0.05)', color: '#FFFFFF', fontSize: '1rem' }}>
              <option value={30}>30 days</option>
              <option value={60}>60 days</option>
              <option value={90}>90 days</option>
            </select>
          </div>
          <button type="submit" disabled={loading} style={{ width: '100%', background: loading ? '#666' : 'linear-gradient(135deg, #60A5FA 0%, #3B82F6 100%)', color: 'white', border: 'none', padding: '1rem 2rem', borderRadius: '10px', fontSize: '1.1rem', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', transition: 'all 0.3s ease' }}>
            {loading ? 'Sending...' : 'Send Beta Invite'}
          </button>
          {message && (
            <div style={{ marginTop: '1rem', padding: '1rem', borderRadius: '10px', background: message.startsWith('✅') ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)', border: `1px solid ${message.startsWith('✅') ? 'rgba(34, 197, 94, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`, color: message.startsWith('✅') ? '#22C55E' : '#EF4444' }}>
              {message}
            </div>
          )}
        </form>
        {recentInvites.length > 0 && (
          <div style={{ background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '20px', padding: '2rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>Recent Invites</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {recentInvites.map((invite, index) => (
                <div key={index} style={{ padding: '1rem', borderRadius: '10px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                  <div style={{ fontWeight: 600 }}>{invite.email}</div>
                  <div style={{ fontSize: '0.9rem', color: '#B8D4E8', marginTop: '0.25rem' }}>{invite.days} days • {new Date(invite.timestamp).toLocaleString()}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

