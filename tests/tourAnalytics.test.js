/**
 * Tour Analytics System Tests
 * Tests tour tracking, analytics storage, and statistics
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { trackTourEvent, getTourStats, clearTourAnalytics } from '../src/utils/tourAnalytics';

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => {
      store[key] = value.toString();
    },
    removeItem: (key) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    }
  };
})();

// Mock fetch
global.fetch = vi.fn();

describe('Tour Analytics System', () => {
  beforeEach(() => {
    // Reset localStorage before each test
    localStorageMock.clear();
    global.localStorage = localStorageMock;
    
    // Reset fetch mock
    global.fetch.mockClear();
    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => ({ success: true })
    });
  });

  afterEach(() => {
    clearTourAnalytics();
  });

  describe('trackTourEvent', () => {
    it('should track tour started event', () => {
      trackTourEvent('dashboard', 'started', {
        total_steps: 5,
        auto_start: true
      });

      const events = JSON.parse(localStorage.getItem('tour_analytics_events'));
      expect(events).toHaveLength(1);
      expect(events[0].tour_name).toBe('dashboard');
      expect(events[0].event_type).toBe('started');
      expect(events[0].total_steps).toBe(5);
    });

    it('should track tour completed event', () => {
      trackTourEvent('endoguard', 'completed', {
        last_step_index: 5,
        total_steps: 6,
        completion_percentage: '100.0'
      });

      const events = JSON.parse(localStorage.getItem('tour_analytics_events'));
      expect(events[0].event_type).toBe('completed');
      expect(events[0].completion_percentage).toBe('100.0');
    });

    it('should track tour skipped event', () => {
      trackTourEvent('rxguard', 'skipped', {
        last_step_index: 2,
        total_steps: 5,
        completion_percentage: '60.0'
      });

      const events = JSON.parse(localStorage.getItem('tour_analytics_events'));
      expect(events[0].event_type).toBe('skipped');
      expect(events[0].last_step_index).toBe(2);
    });

    it('should track step viewed events', () => {
      trackTourEvent('dashboard', 'step_viewed', {
        step_index: 1,
        step_title: 'Welcome to Dashboard',
        total_steps: 5,
        progress_percentage: '40.0'
      });

      const events = JSON.parse(localStorage.getItem('tour_analytics_events'));
      expect(events[0].event_type).toBe('step_viewed');
      expect(events[0].step_index).toBe(1);
      expect(events[0].step_title).toBe('Welcome to Dashboard');
    });

    it('should send analytics to backend API', async () => {
      trackTourEvent('dashboard', 'started', { total_steps: 5 });

      // Wait for async fetch call
      await new Promise(resolve => setTimeout(resolve, 100));

      expect(global.fetch).toHaveBeenCalledWith(
        '/api/analytics/tour',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        })
      );
    });

    it('should handle API errors gracefully', async () => {
      global.fetch.mockRejectedValueOnce(new Error('Network error'));

      // Should not throw error
      expect(() => {
        trackTourEvent('dashboard', 'started', { total_steps: 5 });
      }).not.toThrow();

      // Event should still be stored locally
      const events = JSON.parse(localStorage.getItem('tour_analytics_events'));
      expect(events).toHaveLength(1);
    });

    it('should limit stored events to 100', () => {
      // Add 150 events
      for (let i = 0; i < 150; i++) {
        trackTourEvent('test-tour', 'step_viewed', { step_index: i });
      }

      const events = JSON.parse(localStorage.getItem('tour_analytics_events'));
      expect(events.length).toBeLessThanOrEqual(100);
    });
  });

  describe('getTourStats', () => {
    it('should return empty stats when no events exist', () => {
      const stats = getTourStats();
      expect(stats.total_tours_started).toBe(0);
      expect(stats.total_tours_completed).toBe(0);
      expect(stats.completion_rate).toBe(0);
    });

    it('should calculate tour statistics correctly', () => {
      // Simulate tour interactions
      trackTourEvent('dashboard', 'started', { total_steps: 5 });
      trackTourEvent('dashboard', 'completed', { total_steps: 5 });
      trackTourEvent('endoguard', 'started', { total_steps: 6 });
      trackTourEvent('endoguard', 'skipped', { last_step_index: 3 });
      trackTourEvent('rxguard', 'started', { total_steps: 4 });
      trackTourEvent('rxguard', 'completed', { total_steps: 4 });

      const stats = getTourStats();
      
      expect(stats.total_tours_started).toBe(3);
      expect(stats.total_tours_completed).toBe(2);
      expect(stats.total_tours_skipped).toBe(1);
      expect(stats.completion_rate).toBe('66.7'); // 2/3 = 66.7%
    });

    it('should track per-tour statistics', () => {
      trackTourEvent('dashboard', 'started', { total_steps: 5 });
      trackTourEvent('dashboard', 'completed', { total_steps: 5 });
      trackTourEvent('dashboard', 'started', { total_steps: 5 });
      trackTourEvent('dashboard', 'skipped', { last_step_index: 2 });

      const stats = getTourStats();
      
      expect(stats.tours.dashboard.started).toBe(2);
      expect(stats.tours.dashboard.completed).toBe(1);
      expect(stats.tours.dashboard.skipped).toBe(1);
    });

    it('should track last interaction timestamp', () => {
      const now = new Date().toISOString();
      trackTourEvent('dashboard', 'started', { total_steps: 5 });

      const stats = getTourStats();
      expect(stats.tours.dashboard.last_interaction).toBeDefined();
      expect(new Date(stats.tours.dashboard.last_interaction).getTime()).toBeGreaterThan(
        new Date(now).getTime() - 1000
      );
    });
  });

  describe('clearTourAnalytics', () => {
    it('should clear all tour analytics data', () => {
      trackTourEvent('dashboard', 'started', { total_steps: 5 });
      trackTourEvent('endoguard', 'completed', { total_steps: 6 });

      let events = JSON.parse(localStorage.getItem('tour_analytics_events'));
      expect(events).toHaveLength(2);

      clearTourAnalytics();

      events = localStorage.getItem('tour_analytics_events');
      expect(events).toBeNull();
    });
  });

  describe('User identification', () => {
    it('should use anonymous when no user is logged in', () => {
      trackTourEvent('dashboard', 'started', { total_steps: 5 });

      const events = JSON.parse(localStorage.getItem('tour_analytics_events'));
      expect(events[0].user_id).toBe('anonymous');
      expect(events[0].user_email).toBe('anonymous');
    });

    it('should use user info when user is logged in', () => {
      localStorage.setItem('user', JSON.stringify({
        id: 'user-123',
        email: 'test@example.com'
      }));

      trackTourEvent('dashboard', 'started', { total_steps: 5 });

      const events = JSON.parse(localStorage.getItem('tour_analytics_events'));
      expect(events[0].user_id).toBe('user-123');
      expect(events[0].user_email).toBe('test@example.com');
    });
  });

  describe('Edge cases', () => {
    it('should handle missing metadata gracefully', () => {
      expect(() => {
        trackTourEvent('dashboard', 'started');
      }).not.toThrow();

      const events = JSON.parse(localStorage.getItem('tour_analytics_events'));
      expect(events).toHaveLength(1);
    });

    it('should handle localStorage quota exceeded', () => {
      // Mock localStorage.setItem to throw quota exceeded error
      const originalSetItem = localStorage.setItem;
      localStorage.setItem = vi.fn(() => {
        throw new Error('QuotaExceededError');
      });

      // Should not throw error
      expect(() => {
        trackTourEvent('dashboard', 'started', { total_steps: 5 });
      }).not.toThrow();

      // Restore original setItem
      localStorage.setItem = originalSetItem;
    });

    it('should handle malformed JSON in localStorage', () => {
      localStorage.setItem('tour_analytics_events', 'invalid json {');

      // Should not throw error and return empty stats
      const stats = getTourStats();
      expect(stats).toBeNull();
    });
  });
});
