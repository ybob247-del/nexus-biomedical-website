/**
 * Signup Page
 * New user registration page
 */

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/auth.css';

const Signup = () => {
  const { t } = useTranslation();

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const value = e.target.name === 'password' || e.target.name === 'confirmPassword' 
      ? e.target.value.trim() 
      : e.target.value;
    
    setFormData({
      ...formData,
      [e.target.name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Debug logging
    console.log('Password:', formData.password);
    console.log('Confirm Password:', formData.confirmPassword);
    console.log('Passwords match:', formData.password === formData.confirmPassword);
    console.log('Password length:', formData.password.length);
    console.log('Confirm length:', formData.confirmPassword.length);

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      console.error('PASSWORD MISMATCH DETECTED');
      setError(t('auth.passwordMismatch'));
      return;
    }

    setLoading(true);

    const result = await signup(
      formData.email,
      formData.password,
      formData.firstName,
      formData.lastName
    );

    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error);
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        {/* Logo */}
        <div className="auth-logo">
          <h1>Nexus Biomedical Intelligence</h1>
          <p>{t('auth.createAccount')} to get started</p>
        </div>

        {/* Signup Form */}
        <div className="auth-card">
          <h2>{t('auth.getStarted')}</h2>

          {error && (
            <div className="auth-error">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName">
                  {t('auth.firstName')}
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="auth-input"
                  placeholder="John"
                />
              </div>

              <div>
                <label htmlFor="lastName">
                  {t('auth.lastName')}
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="auth-input"
                  placeholder="Doe"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email">
                {t('auth.email')}
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="auth-input"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="password">
                {t('auth.password')}
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="auth-input"
                placeholder="••••••••"
              />
              <p className="text-xs text-gray-500 mt-1">
                {t('auth.passwordRequirements')}
              </p>
            </div>

            <div>
              <label htmlFor="confirmPassword">
                {t('auth.confirmPassword')}
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="auth-input"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="auth-submit-btn"
            >
              {loading ? t('auth.creatingAccount') : t('auth.createAccount')}
            </button>
          </form>

          {/* Free Trial Notice */}
          <div className="mt-6 p-4 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 rounded-lg">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-cyan-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <div>
                <p className="text-sm font-semibold text-white mb-1">{t('auth.freeTrialNotice')}</p>
                <p className="text-xs text-gray-300">
                  {t('auth.freeTrialDetails')}
                </p>
              </div>
            </div>
          </div>

          <div className="auth-footer">
            <p>
              {t('auth.hasAccount')}{' '}
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

export default Signup;

