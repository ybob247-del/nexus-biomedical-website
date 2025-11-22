/**
 * Waitlist Admin Dashboard
 * View and export waitlist signups by platform
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function WaitlistAdmin() {
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!user || !token) {
      navigate('/login?redirect=/admin/waitlist');
      return;
    }

    loadWaitlist();
  }, [user, token, navigate]);

  const loadWaitlist = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/admin/waitlist', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to load waitlist');
      }

      setData(result);
    } catch (err) {
      console.error('Load waitlist error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    if (!data) return;

    const entries = selectedPlatform === 'all' 
      ? data.allEntries 
      : data.byPlatform[selectedPlatform] || [];

    const filtered = entries.filter(entry => {
      if (!searchQuery) return true;
      const query = searchQuery.toLowerCase();
      return (
        entry.email.toLowerCase().includes(query) ||
        entry.first_name?.toLowerCase().includes(query) ||
        entry.last_name?.toLowerCase().includes(query) ||
        entry.platform.toLowerCase().includes(query)
      );
    });

    // CSV headers
    const headers = ['Email', 'First Name', 'Last Name', 'Platform', 'Joined Date', 'Notified'];
    
    // CSV rows
    const rows = filtered.map(entry => [
      entry.email,
      entry.first_name || '',
      entry.last_name || '',
      entry.platform,
      new Date(entry.created_at).toLocaleDateString(),
      entry.notified ? 'Yes' : 'No'
    ]);

    // Combine headers and rows
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    // Download
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `waitlist-${selectedPlatform}-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ textAlign: 'center', color: '#FFFFFF' }}>
          <div style={{
            width: '60px',
            height: '60px',
            border: '4px solid rgba(0, 206, 209, 0.2)',
            borderTop: '4px solid #00CED1',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px'
          }}></div>
          <p style={{ fontSize: '1.125rem' }}>Loading waitlist...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem'
      }}>
        <div style={{
          background: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          borderRadius: '16px',
          padding: '2rem',
          maxWidth: '500px',
          textAlign: 'center'
        }}>
          <h2 style={{ color: '#FCA5A5', fontSize: '1.5rem', marginBottom: '1rem' }}>
            Access Denied
          </h2>
          <p style={{ color: 'rgba(255, 255, 255, 0.7)' }}>{error}</p>
          <button
            onClick={() => navigate('/')}
            style={{
              marginTop: '1.5rem',
              padding: '0.75rem 1.5rem',
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '10px',
              color: '#FFFFFF',
              cursor: 'pointer'
            }}
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  const entries = selectedPlatform === 'all' 
    ? data.allEntries 
    : data.byPlatform[selectedPlatform] || [];

  const filtered = entries.filter(entry => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      entry.email.toLowerCase().includes(query) ||
      entry.first_name?.toLowerCase().includes(query) ||
      entry.last_name?.toLowerCase().includes(query) ||
      entry.platform.toLowerCase().includes(query)
    );
  });

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
      padding: '2rem',
      color: '#FFFFFF'
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <button
            onClick={() => navigate('/')}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: '#FFFFFF',
              padding: '0.75rem 1.5rem',
              borderRadius: '10px',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: 600,
              marginBottom: '1.5rem'
            }}
          >
            ← Back to Home
          </button>

          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: 700,
            marginBottom: '0.5rem',
            background: 'linear-gradient(135deg, #00CED1 0%, #FFFFFF 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Waitlist Dashboard
          </h1>

          <p style={{ fontSize: '1.125rem', color: 'rgba(255, 255, 255, 0.7)' }}>
            Manage platform launch waitlist signups
          </p>
        </div>

        {/* Stats Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem'
        }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '16px',
            padding: '1.5rem'
          }}>
            <div style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.6)', marginBottom: '0.5rem' }}>
              Total Signups
            </div>
            <div style={{ fontSize: '2.5rem', fontWeight: 700, color: '#00CED1' }}>
              {data.total}
            </div>
          </div>

          {data.stats.map(stat => (
            <div
              key={stat.platform}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '16px',
                padding: '1.5rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onClick={() => setSelectedPlatform(stat.platform)}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'}
            >
              <div style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.6)', marginBottom: '0.5rem' }}>
                {stat.platform}
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 700 }}>
                {stat.count}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.5)', marginTop: '0.5rem' }}>
                {stat.pending} pending
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '16px',
          padding: '1.5rem',
          marginBottom: '2rem',
          display: 'flex',
          gap: '1rem',
          flexWrap: 'wrap',
          alignItems: 'center'
        }}>
          <div style={{ flex: 1, minWidth: '200px' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', color: 'rgba(255, 255, 255, 0.7)' }}>
              Platform
            </label>
            <select
              value={selectedPlatform}
              onChange={(e) => setSelectedPlatform(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '10px',
                color: '#FFFFFF',
                fontSize: '1rem'
              }}
            >
              <option value="all">All Platforms</option>
              {data.stats.map(stat => (
                <option key={stat.platform} value={stat.platform}>{stat.platform}</option>
              ))}
            </select>
          </div>

          <div style={{ flex: 1, minWidth: '200px' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', color: 'rgba(255, 255, 255, 0.7)' }}>
              Search
            </label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by email or name..."
              style={{
                width: '100%',
                padding: '0.75rem',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '10px',
                color: '#FFFFFF',
                fontSize: '1rem'
              }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.75rem' }}>
            <button
              onClick={() => navigate('/admin/notify-waitlist')}
              style={{
                padding: '0.75rem 1.5rem',
                background: 'linear-gradient(135deg, #9F7AEA 0%, #00CED1 100%)',
                border: 'none',
                borderRadius: '10px',
                color: '#FFFFFF',
                fontSize: '1rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              📧 Send Notifications
            </button>
            <button
              onClick={exportToCSV}
              style={{
                padding: '0.75rem 1.5rem',
                background: 'linear-gradient(135deg, #00CED1 0%, #9F7AEA 100%)',
                border: 'none',
                borderRadius: '10px',
                color: '#FFFFFF',
                fontSize: '1rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              📥 Export CSV
            </button>
          </div>
        </div>

        {/* Results Count */}
        <div style={{ marginBottom: '1rem', color: 'rgba(255, 255, 255, 0.7)' }}>
          Showing {filtered.length} of {entries.length} entries
        </div>

        {/* Table */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '16px',
          overflow: 'hidden'
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'rgba(255, 255, 255, 0.05)' }}>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.8)' }}>Email</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.8)' }}>Name</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.8)' }}>Platform</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.8)' }}>Joined</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.8)' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((entry, index) => (
                <tr
                  key={entry.id}
                  style={{
                    borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                    background: index % 2 === 0 ? 'transparent' : 'rgba(255, 255, 255, 0.02)'
                  }}
                >
                  <td style={{ padding: '1rem', fontSize: '0.9375rem' }}>{entry.email}</td>
                  <td style={{ padding: '1rem', fontSize: '0.9375rem' }}>
                    {entry.first_name || entry.last_name 
                      ? `${entry.first_name || ''} ${entry.last_name || ''}`.trim()
                      : '-'}
                  </td>
                  <td style={{ padding: '1rem', fontSize: '0.9375rem' }}>{entry.platform}</td>
                  <td style={{ padding: '1rem', fontSize: '0.9375rem', color: 'rgba(255, 255, 255, 0.7)' }}>
                    {new Date(entry.created_at).toLocaleDateString()}
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{
                      padding: '0.25rem 0.75rem',
                      borderRadius: '12px',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      background: entry.notified ? 'rgba(16, 185, 129, 0.2)' : 'rgba(251, 191, 36, 0.2)',
                      color: entry.notified ? '#10B981' : '#FBBF24'
                    }}>
                      {entry.notified ? 'Notified' : 'Pending'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filtered.length === 0 && (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'rgba(255, 255, 255, 0.5)' }}>
              No entries found
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
