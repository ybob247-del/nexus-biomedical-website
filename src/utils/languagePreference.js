/**
 * Language Preference Cookie Management
 * Stores user's language preference for 30 days
 */

const COOKIE_NAME = 'nexus_language_preference';
const COOKIE_EXPIRY_DAYS = 30;

/**
 * Set language preference cookie
 * @param {string} language - Language code (en/es)
 */
export const setLanguagePreference = (language) => {
  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + COOKIE_EXPIRY_DAYS);
  
  document.cookie = `${COOKIE_NAME}=${language}; expires=${expiryDate.toUTCString()}; path=/; SameSite=Lax; Secure`;
  
  // Also store in localStorage as backup
  try {
    localStorage.setItem(COOKIE_NAME, language);
  } catch (e) {
    console.warn('Failed to set language preference in localStorage:', e);
  }
};

/**
 * Get language preference from cookie or localStorage
 * @returns {string|null} Language code or null if not set
 */
export const getLanguagePreference = () => {
  // Try cookie first
  const cookies = document.cookie.split(';');
  for (let cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === COOKIE_NAME) {
      return value;
    }
  }
  
  // Fallback to localStorage
  try {
    return localStorage.getItem(COOKIE_NAME);
  } catch (e) {
    console.warn('Failed to get language preference from localStorage:', e);
    return null;
  }
};

/**
 * Clear language preference
 */
export const clearLanguagePreference = () => {
  document.cookie = `${COOKIE_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  
  try {
    localStorage.removeItem(COOKIE_NAME);
  } catch (e) {
    console.warn('Failed to clear language preference from localStorage:', e);
  }
};

/**
 * Detect browser language preference
 * @returns {string} Language code (en/es)
 */
export const detectBrowserLanguage = () => {
  const browserLang = navigator.language || navigator.userLanguage;
  
  // Check if browser language is Spanish
  if (browserLang.startsWith('es')) {
    return 'es';
  }
  
  return 'en';
};

/**
 * Initialize language preference
 * Checks cookie, localStorage, then browser language
 * @returns {string} Language code (en/es)
 */
export const initializeLanguagePreference = () => {
  // Check saved preference
  const savedPreference = getLanguagePreference();
  if (savedPreference) {
    return savedPreference;
  }
  
  // Detect browser language
  const browserLang = detectBrowserLanguage();
  
  // Save detected language
  setLanguagePreference(browserLang);
  
  return browserLang;
};
