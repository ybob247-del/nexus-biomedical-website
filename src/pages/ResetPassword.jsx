/**
 * Reset Password Page
 * Set new password after clicking email link
 */

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import '../styles/auth.css';

const ResetPassword = () => {
  const { t } = useTranslation();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      setError('Invalid or missing reset token');
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError(t('auth.passwordMismatch'));
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        setError(data.error || 'Failed to reset password');
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
          <p>Create a new password</p>
        </div>

        {/* Reset Password Form */}
        <div className="auth-card">
          <h2>Reset Password</h2>

          {!success ? (
            <>
              {error && (
                <div className="auth-error">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="auth-input-group">
                  <label htmlFor="password">{t('auth.password')}</label>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="auth-input"
                    placeholder="••••••••"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {t('auth.passwordRequirements')}
                  </p>
                </div>

                <div className="auth-input-group">
                  <label htmlFor="confirmPassword">{t('auth.confirmPassword')}</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="auth-input"
                    placeholder="••••••••"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading || !token}
                  className="auth-submit-btn"
                >
                  {loading ? 'Resetting...' : 'Reset Password'}
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
                    Password Reset Successful!
                  </h3>
                  <p style={{ color: '#B8D4E8', fontSize: '0.95rem', margin: 0 }}>
                    Your password has been reset. Redirecting to login page...
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="auth-footer">
            <p>
              <Link to="/login">{t('auth.signIn')}</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
