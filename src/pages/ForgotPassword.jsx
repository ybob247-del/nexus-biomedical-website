/**
 * Forgot Password Page
 * Request password reset email
 */

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import '../styles/auth.css';

const ForgotPassword = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
      } else {
        setError(data.error || 'Failed to send reset email');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        {/* Logo */}
        <div className="auth-logo">
          <h1>Nexus Biomedical Intelligence</h1>
          <p>Reset your password</p>
        </div>

        {/* Forgot Password Form */}
        <div className="auth-card">
          <h2>{t('auth.forgotPassword')}</h2>

          {!success ? (
            <>
              <p style={{ color: '#B8D4E8', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
                Enter your email address and we'll send you a link to reset your password.
              </p>

              {error && (
                <div className="auth-error">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="auth-input-group">
                  <label htmlFor="email">{t('auth.email')}</label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="auth-input"
                    placeholder="you@example.com"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="auth-submit-btn"
                >
                  {loading ? 'Sending...' : 'Send Reset Link'}
                </button>
              </form>
            </>
          ) : (
            <div style={{
              background: 'rgba(0, 206, 209, 0.1)',
              border: '1px solid rgba(0, 206, 209, 0.3)',
              borderRadius: '8px',
              padding: '1.5rem',
              marginBottom: '1.5rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'start', gap: '1rem' }}>
                <span style={{ fontSize: '2rem' }}>✅</span>
                <div>
                  <h3 style={{ color: '#00CED1', marginBottom: '0.5rem', fontSize: '1.1rem' }}>
                    Check Your Email
                  </h3>
                  <p style={{ color: '#B8D4E8', fontSize: '0.95rem', margin: 0 }}>
                    We've sent a password reset link to <strong>{email}</strong>. 
                    Please check your inbox and follow the instructions.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="auth-footer">
            <p>
              Remember your password?{' '}
              <Link to="/login">{t('auth.signIn')}</Link>
            </p>
            <p style={{ marginTop: '1rem' }}>
              <Link to="/">← {t('common.back')} to home</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
