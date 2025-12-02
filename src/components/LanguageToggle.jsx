/**
 * Language Toggle Component
 * Allows users to switch between English and Spanish
 */

import React from 'react';
import { useTranslation } from 'react-i18next';
import { trackLanguageToggle } from '../utils/analytics';
import { setLanguagePreference } from '../utils/languagePreference';

const LanguageToggle = () => {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const currentLang = i18n.language;
    const newLang = currentLang === 'en' ? 'es' : 'en';
    
    // Track language toggle event
    trackLanguageToggle(currentLang, newLang);
    
    // Save language preference
    setLanguagePreference(newLang);
    
    i18n.changeLanguage(newLang);
  };

  return (
    <button
      onClick={toggleLanguage}
      style={{
        position: 'fixed',
        top: '24px',
        right: '24px',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.5rem 1rem',
        background: 'rgba(255, 255, 255, 0.1)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        borderRadius: '0.5rem',
        color: 'white',
        fontSize: '0.875rem',
        fontWeight: 500,
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        zIndex: 999
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
      }}
      title="Switch Language / Cambiar Idioma"
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
      <span>{i18n.language === 'en' ? 'EN' : 'ES'}</span>
      <span style={{ opacity: 0.6 }}>|</span>
      <span style={{ opacity: 0.6 }}>{i18n.language === 'en' ? 'ES' : 'EN'}</span>
    </button>
  );
};

export default LanguageToggle;
