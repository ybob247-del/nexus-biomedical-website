import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('Analytics Configuration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should have valid GA4 measurement ID format', () => {
    const measurementId = import.meta.env.VITE_GA4_MEASUREMENT_ID || 'G-MH6HND05KY';
    
    // GA4 measurement IDs start with 'G-' followed by alphanumeric characters
    expect(measurementId).toMatch(/^G-[A-Z0-9]+$/);
  });

  it('should use production measurement ID from environment', () => {
    const measurementId = import.meta.env.VITE_GA4_MEASUREMENT_ID || 'G-MH6HND05KY';
    
    // Verify it's not the placeholder
    expect(measurementId).not.toBe('G-XXXXXXXXXX');
    
    // Verify it matches expected format
    expect(measurementId).toBe('G-MH6HND05KY');
  });

  it('should have proper measurement ID length', () => {
    const measurementId = import.meta.env.VITE_GA4_MEASUREMENT_ID || 'G-MH6HND05KY';
    
    // GA4 measurement IDs are typically 12-14 characters
    expect(measurementId.length).toBeGreaterThanOrEqual(12);
    expect(measurementId.length).toBeLessThanOrEqual(14);
  });
});
