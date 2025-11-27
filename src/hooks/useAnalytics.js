import { useAuth } from '../context/AuthContext';

/**
 * Custom hook for tracking user actions and feature usage
 * Automatically sends analytics events to the backend
 */
export function useAnalytics(platform) {
  const { token } = useAuth();

  const trackAction = async (action, metadata = {}) => {
    if (!token || !platform) return;

    try {
      await fetch('/api/analytics/track-usage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          platform,
          action,
          metadata
        })
      });
    } catch (error) {
      // Silently fail - don't disrupt user experience
      console.debug('Analytics tracking failed:', error);
    }
  };

  return { trackAction };
}
