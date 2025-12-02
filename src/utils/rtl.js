/**
 * RTL (Right-to-Left) Utility Functions
 * Provides language direction detection and RTL support utilities
 */

/**
 * RTL languages that require right-to-left text direction
 */
const RTL_LANGUAGES = ['ar', 'he', 'fa', 'ur', 'yi', 'ji', 'iw', 'ps', 'sd'];

/**
 * Check if a language code requires RTL text direction
 * @param {string} languageCode - ISO language code (e.g., 'ar', 'en', 'es')
 * @returns {boolean} - True if language requires RTL direction
 */
export const isRTL = (languageCode) => {
  if (!languageCode) return false;
  
  // Extract base language code (e.g., 'ar' from 'ar-SA')
  const baseLanguage = languageCode.split('-')[0].toLowerCase();
  
  return RTL_LANGUAGES.includes(baseLanguage);
};

/**
 * Get text direction for a language
 * @param {string} languageCode - ISO language code
 * @returns {string} - 'rtl' or 'ltr'
 */
export const getTextDirection = (languageCode) => {
  return isRTL(languageCode) ? 'rtl' : 'ltr';
};

/**
 * Update document direction attribute
 * @param {string} languageCode - ISO language code
 */
export const updateDocumentDirection = (languageCode) => {
  const direction = getTextDirection(languageCode);
  document.documentElement.setAttribute('dir', direction);
  document.documentElement.setAttribute('lang', languageCode);
};

/**
 * Get CSS class for directional styling
 * @param {string} languageCode - ISO language code
 * @returns {string} - 'rtl' or 'ltr' class name
 */
export const getDirectionClass = (languageCode) => {
  return isRTL(languageCode) ? 'rtl' : 'ltr';
};

/**
 * Get directional value (useful for margins, padding, etc.)
 * @param {string} languageCode - ISO language code
 * @param {any} ltrValue - Value for LTR languages
 * @param {any} rtlValue - Value for RTL languages
 * @returns {any} - Appropriate value based on language direction
 */
export const getDirectionalValue = (languageCode, ltrValue, rtlValue) => {
  return isRTL(languageCode) ? rtlValue : ltrValue;
};

/**
 * Flip horizontal position for RTL
 * @param {string} position - Position value ('left', 'right')
 * @param {string} languageCode - ISO language code
 * @returns {string} - Flipped position for RTL, original for LTR
 */
export const flipPosition = (position, languageCode) => {
  if (!isRTL(languageCode)) return position;
  
  const positionMap = {
    'left': 'right',
    'right': 'left',
    'start': 'end',
    'end': 'start'
  };
  
  return positionMap[position] || position;
};

export default {
  isRTL,
  getTextDirection,
  updateDocumentDirection,
  getDirectionClass,
  getDirectionalValue,
  flipPosition
};
