/**
 * Tour Analytics Tracking Utility
 * Tracks user interactions with onboarding tours
 */

/**
 * Track tour event
 * @param {string} tourName - Name of the tour (e.g., 'dashboard', 'endoguard', 'rxguard')
 * @param {string} event - Event type (e.g., 'started', 'completed', 'skipped', 'step_viewed')
 * @param {object} metadata - Additional metadata (step number, completion percentage, etc.)
 */
export function trackTourEvent(tourName, event, metadata = {}) {
  try {
    // Get user info if available
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;
    
    const eventData = {
      tour_name: tourName,
      event_type: event,
      user_id: user?.id || 'anonymous',
      user_email: user?.email || 'anonymous',
      timestamp: new Date().toISOString(),
      ...metadata
    };
    
    // Log to console in development
    if (import.meta.env.DEV) {
      console.log('📊 Tour Analytics:', eventData);
    }
    
    // Send to analytics endpoint
    sendToAnalytics(eventData);
    
    // Store in localStorage for offline tracking
    storeTourEvent(eventData);
    
  } catch (error) {
    console.error('Error tracking tour event:', error);
  }
}

/**
 * Send analytics data to backend
 */
async function sendToAnalytics(eventData) {
  try {
    const response = await fetch('/api/analytics/tour', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(eventData),
    });
    
    if (!response.ok) {
      console.warn('Failed to send tour analytics:', response.statusText);
    }
  } catch (error) {
    // Silently fail - analytics should not block user experience
    console.debug('Analytics endpoint not available:', error.message);
  }
}

/**
 * Store tour event in localStorage for offline tracking
 */
function storeTourEvent(eventData) {
  try {
    const key = 'tour_analytics_events';
    const eventsStr = localStorage.getItem(key);
    const events = eventsStr ? JSON.parse(eventsStr) : [];
    
    // Add new event
    events.push(eventData);
    
    // Keep only last 100 events
    const recentEvents = events.slice(-100);
    
    localStorage.setItem(key, JSON.stringify(recentEvents));
  } catch (error) {
    console.debug('Failed to store tour event locally:', error);
  }
}

/**
 * Get tour completion statistics for current user
 */
export function getTourStats() {
  try {
    const key = 'tour_analytics_events';
    const eventsStr = localStorage.getItem(key);
    const events = eventsStr ? JSON.parse(eventsStr) : [];
    
    const stats = {
      total_tours_started: 0,
      total_tours_completed: 0,
      total_tours_skipped: 0,
      completion_rate: 0,
      tours: {}
    };
    
    events.forEach(event => {
      const tourName = event.tour_name;
      
      // Initialize tour stats if needed
      if (!stats.tours[tourName]) {
        stats.tours[tourName] = {
          started: 0,
          completed: 0,
          skipped: 0,
          last_interaction: null
        };
      }
      
      // Update counts
      if (event.event_type === 'started') {
        stats.total_tours_started++;
        stats.tours[tourName].started++;
      } else if (event.event_type === 'completed') {
        stats.total_tours_completed++;
        stats.tours[tourName].completed++;
      } else if (event.event_type === 'skipped') {
        stats.total_tours_skipped++;
        stats.tours[tourName].skipped++;
      }
      
      // Update last interaction
      stats.tours[tourName].last_interaction = event.timestamp;
    });
    
    // Calculate completion rate
    if (stats.total_tours_started > 0) {
      stats.completion_rate = (stats.total_tours_completed / stats.total_tours_started * 100).toFixed(1);
    }
    
    return stats;
  } catch (error) {
    console.error('Error getting tour stats:', error);
    return null;
  }
}

/**
 * Clear all tour analytics data
 */
export function clearTourAnalytics() {
  try {
    localStorage.removeItem('tour_analytics_events');
    console.log('Tour analytics data cleared');
  } catch (error) {
    console.error('Error clearing tour analytics:', error);
  }
}
