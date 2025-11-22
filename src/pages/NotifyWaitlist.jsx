/**
 * Notify Waitlist Admin Page
 * Send bulk launch announcement emails to platform waitlists
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function NotifyWaitlist() {
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [waitlistData, setWaitlistData] = useState(null);
  
  const [selectedPlatform, setSelectedPlatform] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const platforms = [
    'ElderWatch',
    'PediCalc',
    'ClinicalIQ',
    'ReguReady',
    'SkinScan'
  ];

  useEffect(() => {
    if (!user || !token) {
      navigate('/login?redirect=/admin/notify-waitlist');
      return;
    }

    loadWaitlistData();
  }, [user, token, navigate]);

  const loadWaitlistData = async () => {
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

      setWaitlistData(result);
    } catch (err) {
      console.error('Load waitlist error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSendNotifications = async (e) => {
    e.preventDefault();
    
    if (!selectedPlatform || !subject || !message) {
      setError('Please fill in all fields');
      return;
    }

    const pendingCount = waitlistData?.byPlatform[selectedPlatform]?.filter(e => !e.notified).length || 0;
    
    if (pendingCount === 0) {
      setError('No pending notifications for this platform');
      return;
    }

    const confirmed = window.confirm(
      `Send launch notification to ${pendingCount} users on the ${selectedPlatform} waitlist?`
    );

    if (!confirmed) return;

    setSending(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch('/api/admin/notify-waitlist', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          platform: selectedPlatform,
          subject,
          message
        })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to send notifications');
      }

      setSuccess(`Successfully sent ${result.sent} emails!`);
      setSelectedPlatform('');
      setSubject('');
      setMessage('');
      
      // Reload waitlist data
      await loadWaitlistData();

    } catch (err) {
      console.error('Send notifications error:', err);
      setError(err.message);
    } finally {
      setSending(false);
    }
  };

  const loadTemplate = (platform) => {
    setSubject(`${platform} is Now Live! Start Your Free Trial`);
    setMessage(`We're excited to announce that ${platform} is now available!

As a valued member of our waitlist, you get early access to this revolutionary healthcare AI platform.

🎉 Special Launch Benefits:
• Extended free trial period
• Priority customer support
• Early access to new features

Click below to start your free trial and experience the future of healthcare intelligence.

Thank you for your patience and support!

The Nexus Biomedical Intelligence Team`);
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
          <p style={{ fontSize: '1.125rem' }}>Loading...</p>
        </div>
      </div>
    );
  }

  if (error && !waitlistData) {
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

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
      padding: '2rem',
      color: '#FFFFFF'
    }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <button
            onClick={() => navigate('/admin/waitlist')}
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
            ← Back to Waitlist
          </button>

          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: 700,
            marginBottom: '0.5rem',
            background: 'linear-gradient(135deg, #00CED1 0%, #FFFFFF 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Send Launch Notifications
          </h1>

          <p style={{ fontSize: '1.125rem', color: 'rgba(255, 255, 255, 0.7)' }}>
            Notify waitlist users when a platform launches
          </p>
        </div>

        {/* Success Message */}
        {success && (
          <div style={{
            background: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: '12px',
            padding: '1rem',
            marginBottom: '2rem',
            color: '#10B981'
          }}>
            ✅ {success}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '12px',
            padding: '1rem',
            marginBottom: '2rem',
            color: '#FCA5A5'
          }}>
            ⚠️ {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSendNotifications}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '16px',
            padding: '2rem',
            marginBottom: '2rem'
          }}>
            {/* Platform Selection */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: 600,
                marginBottom: '0.5rem',
                color: 'rgba(255, 255, 255, 0.9)'
              }}>
                Platform *
              </label>
              <select
                value={selectedPlatform}
                onChange={(e) => {
                  setSelectedPlatform(e.target.value);
                  if (e.target.value) {
                    loadTemplate(e.target.value);
                  }
                }}
                required
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
                <option value="">Select a platform...</option>
                {platforms.map(platform => {
                  const pendingCount = waitlistData?.byPlatform[platform]?.filter(e => !e.notified).length || 0;
                  return (
                    <option key={platform} value={platform}>
                      {platform} ({pendingCount} pending)
                    </option>
                  );
                })}
              </select>
            </div>

            {/* Subject */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: 600,
                marginBottom: '0.5rem',
                color: 'rgba(255, 255, 255, 0.9)'
              }}>
                Email Subject *
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
                placeholder="Enter email subject..."
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

            {/* Message */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: 600,
                marginBottom: '0.5rem',
                color: 'rgba(255, 255, 255, 0.9)'
              }}>
                Email Message *
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                placeholder="Enter email message..."
                rows={12}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '10px',
                  color: '#FFFFFF',
                  fontSize: '1rem',
                  fontFamily: 'inherit',
                  resize: 'vertical'
                }}
              />
              <p style={{
                fontSize: '0.75rem',
                color: 'rgba(255, 255, 255, 0.5)',
                marginTop: '0.5rem'
              }}>
                Tip: Use line breaks to format your message. A "Start Free Trial" button will be added automatically.
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={sending || !selectedPlatform}
              style={{
                width: '100%',
                padding: '1rem',
                background: sending || !selectedPlatform 
                  ? 'rgba(255, 255, 255, 0.1)' 
                  : 'linear-gradient(135deg, #00CED1 0%, #9F7AEA 100%)',
                border: 'none',
                borderRadius: '10px',
                color: '#FFFFFF',
                fontSize: '1.125rem',
                fontWeight: 600,
                cursor: sending || !selectedPlatform ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease',
                opacity: sending || !selectedPlatform ? 0.5 : 1
              }}
            >
              {sending ? 'Sending Emails...' : '📧 Send Launch Notifications'}
            </button>
          </div>
        </form>

        {/* Preview */}
        {selectedPlatform && (
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '16px',
            padding: '2rem'
          }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>
              Email Preview
            </h3>
            <div style={{
              background: '#FFFFFF',
              color: '#000000',
              padding: '2rem',
              borderRadius: '10px'
            }}>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>{subject}</h2>
              <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                {message}
              </div>
              <button style={{
                padding: '0.75rem 1.5rem',
                background: 'linear-gradient(135deg, #00CED1 0%, #9F7AEA 100%)',
                border: 'none',
                borderRadius: '10px',
                color: '#FFFFFF',
                fontWeight: 600,
                cursor: 'pointer'
              }}>
                Start Free Trial →
              </button>
            </div>
          </div>
        )}
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
