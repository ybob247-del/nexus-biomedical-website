/**
 * Language Toggle Component
 * Allows users to switch between English and Spanish
 * Preserves current route when switching languages
 */

import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';
import { trackLanguageToggle } from '../utils/analytics';
import { setLanguagePreference } from '../utils/languagePreference';

const LanguageToggle = () => {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const toggleLanguage = () => {
    const currentLang = i18n.language;
    const newLang = currentLang === 'en' ? 'es' : 'en';
    
    // Track language toggle event
    trackLanguageToggle(currentLang, newLang);
    
    // Save language preference
    setLanguagePreference(newLang);
    
    // Preserve route when switching languages
    const currentPath = location.pathname;
    let newPath = currentPath;
    
    if (newLang === 'es') {
      // Switch to Spanish: add /es prefix if not already there
      if (!currentPath.startsWith('/es')) {
        if (currentPath === '/') {
          newPath = '/es';
        } else {
          newPath = `/es${currentPath}`;
        }
      }
    } else {
      // Switch to English: remove /es prefix
      if (currentPath.startsWith('/es')) {
        // Handle /es (homepage) -> /
        if (currentPath === '/es') {
          newPath = '/';
        } else {
          // Handle /es/path -> /path
          newPath = currentPath.replace('/es', '');
        }
      }
    }
    
    // Navigate to new path - App.jsx useEffect will handle language change based on URL
    if (newPath !== currentPath) {
      navigate(newPath);
    }
  };

  // Determine current language for visual state
  const isEnglish = i18n.language === 'en';
  const isSpanish = i18n.language === 'es';

  return (
    <button
      onClick={toggleLanguage}
      style={{
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
        whiteSpace: 'nowrap',
        flexShrink: 0
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
      {/* Active language in bright white, inactive in dimmed */}
      <span style={{ opacity: isEnglish ? 1 : 0.5, fontWeight: isEnglish ? 600 : 400 }}>EN</span>
      <span style={{ opacity: 0.6 }}>|</span>
      <span style={{ opacity: isSpanish ? 1 : 0.5, fontWeight: isSpanish ? 600 : 400 }}>ES</span>
    </button>
  );
};

export default LanguageToggle;
