import Analytics from 'analytics';
import googleAnalytics from '@analytics/google-analytics';

// Initialize analytics instance
const analytics = Analytics({
  app: 'nexus-biomedical',
  plugins: [
    googleAnalytics({
      measurementIds: ['G-XXXXXXXXXX'], // Replace with actual GA4 measurement ID
      gtagConfig: {
        anonymize_ip: true,
        cookie_flags: 'SameSite=None;Secure',
      },
    }),
  ],
});

/**
 * Track page views with language dimension
 * @param {string} path - Page path
 * @param {string} language - Current language (en/es)
 */
export const trackPageView = (path, language = 'en') => {
  analytics.page({
    path,
    language,
    title: document.title,
  });
};

/**
 * Track language toggle events
 * @param {string} fromLang - Previous language
 * @param {string} toLang - New language
 */
export const trackLanguageToggle = (fromLang, toLang) => {
  analytics.track('language_toggle', {
    from_language: fromLang,
    to_language: toLang,
    page: window.location.pathname,
  });
};

/**
 * Track platform interactions
 * @param {string} platform - Platform name (EndoGuard, RxGuard, etc.)
 * @param {string} action - Action type (view, start_trial, complete_assessment, etc.)
 * @param {string} language - Current language
 */
export const trackPlatformInteraction = (platform, action, language = 'en') => {
  analytics.track('platform_interaction', {
    platform,
    action,
    language,
  });
};

/**
 * Track assessment completions
 * @param {string} platform - Platform name
 * @param {number} score - Assessment score
 * @param {string} language - Current language
 */
export const trackAssessmentCompletion = (platform, score, language = 'en') => {
  analytics.track('assessment_completed', {
    platform,
    score,
    language,
    category: score >= 70 ? 'high_risk' : score >= 40 ? 'moderate_risk' : 'low_risk',
  });
};

/**
 * Track subscription events
 * @param {string} action - Action type (start_trial, subscribe, cancel)
 * @param {string} plan - Plan type (basic, premium)
 * @param {string} language - Current language
 */
export const trackSubscription = (action, plan, language = 'en') => {
  analytics.track('subscription_event', {
    action,
    plan,
    language,
  });
};

/**
 * Track conversion goals
 * @param {string} goal - Goal name (signup, trial_start, subscription, assessment_complete)
 * @param {number} value - Optional monetary value
 * @param {string} language - Current language
 */
export const trackConversion = (goal, value = 0, language = 'en') => {
  analytics.track('conversion', {
    goal,
    value,
    language,
    currency: 'USD',
  });
};

/**
 * Track Spanish-specific engagement
 * @param {string} action - Action type
 * @param {object} metadata - Additional metadata
 */
export const trackSpanishEngagement = (action, metadata = {}) => {
  analytics.track('spanish_engagement', {
    action,
    ...metadata,
    language: 'es',
  });
};

/**
 * Track user signup with language preference
 * @param {string} language - Signup language
 * @param {string} source - Signup source (organic, referral, etc.)
 */
export const trackSignup = (language = 'en', source = 'organic') => {
  analytics.track('user_signup', {
    language,
    source,
  });
  
  // Also track as conversion
  trackConversion('signup', 0, language);
};

/**
 * Set user properties for segmentation
 * @param {object} properties - User properties
 */
export const setUserProperties = (properties) => {
  analytics.identify(properties);
};

export default analytics;
