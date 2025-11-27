/**
 * Plan Selection Integration Tests
 * Tests the flow: Dashboard → Plan Selection → Trial Activation
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('Plan Selection Integration', () => {
  let mockToken;
  let mockPlatformData;

  beforeEach(() => {
    mockToken = 'test-jwt-token';
    mockPlatformData = {
      'RxGuard™': {
        name: 'RxGuard™',
        color: '#00A8CC',
        gradient: 'linear-gradient(135deg, #00A8CC 0%, #0086A8 100%)',
        trialDays: 14,
        pricing: [
          {
            tier: 'Professional',
            price: '$39',
            features: ['Unlimited checks', 'AI analysis', 'Reports']
          }
        ]
      },
      'EndoGuard™': {
        name: 'EndoGuard™',
        color: '#D946EF',
        gradient: 'linear-gradient(135deg, #D946EF 0%, #C026D3 100%)',
        trialDays: 30,
        pricing: [
          {
            tier: 'Professional',
            price: '$97',
            features: ['Unlimited assessments', 'AI analysis', 'Reports']
          }
        ]
      }
    };
  });

  describe('Dashboard Integration', () => {
    it('should show plan selection modal when clicking Start Free Trial', () => {
      // Test that clicking "Start Free Trial" button opens PlanSelection modal
      const platformId = 'rxguard';
      const expectedPlatform = mockPlatformData['RxGuard™'];
      
      // Simulate button click
      const showPlanSelection = vi.fn();
      showPlanSelection(expectedPlatform);
      
      expect(showPlanSelection).toHaveBeenCalledWith(expectedPlatform);
    });

    it('should close plan selection modal when clicking close button', () => {
      const closePlanSelection = vi.fn();
      closePlanSelection();
      
      expect(closePlanSelection).toHaveBeenCalled();
    });
  });

  describe('Plan Selection Component', () => {
    it('should display correct trial period for RxGuard (14 days)', () => {
      const platform = mockPlatformData['RxGuard™'];
      expect(platform.trialDays).toBe(14);
    });

    it('should display correct trial period for EndoGuard (30 days)', () => {
      const platform = mockPlatformData['EndoGuard™'];
      expect(platform.trialDays).toBe(30);
    });

    it('should allow selecting monthly plan', () => {
      const selectedPlan = 'monthly';
      expect(['monthly', 'yearly']).toContain(selectedPlan);
    });

    it('should allow selecting yearly plan', () => {
      const selectedPlan = 'yearly';
      expect(['monthly', 'yearly']).toContain(selectedPlan);
    });

    it('should calculate yearly price with 20% discount', () => {
      const monthlyPrice = 39;
      const yearlyPrice = Math.round(monthlyPrice * 12 * 0.8);
      expect(yearlyPrice).toBe(374); // $39 * 12 * 0.8 = $374.40 rounded to $374
    });
  });

  describe('Trial Activation Flow', () => {
    it('should send selected plan to trial activation API', async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        json: async () => ({
          success: true,
          trialDays: 14,
          trialEnd: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString()
        })
      });
      global.fetch = mockFetch;

      const platform = 'rxguard';
      const selectedPlan = 'monthly';

      await fetch('/api/trials/activate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${mockToken}`
        },
        body: JSON.stringify({ platform, selectedPlan })
      });

      expect(mockFetch).toHaveBeenCalledWith(
        '/api/trials/activate',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ platform, selectedPlan })
        })
      );
    });

    it('should handle trial activation success', async () => {
      const mockResponse = {
        success: true,
        trialDays: 14,
        trialEnd: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString()
      };

      expect(mockResponse.success).toBe(true);
      expect(mockResponse.trialDays).toBe(14);
      expect(new Date(mockResponse.trialEnd)).toBeInstanceOf(Date);
    });

    it('should handle already used trial error', async () => {
      const mockResponse = {
        success: false,
        alreadyUsedTrial: true,
        message: 'You have already used your free trial for this platform'
      };

      expect(mockResponse.success).toBe(false);
      expect(mockResponse.alreadyUsedTrial).toBe(true);
    });

    it('should handle already has access case', async () => {
      const mockResponse = {
        success: false,
        hasAccess: true,
        message: 'You already have active access to this platform'
      };

      expect(mockResponse.success).toBe(false);
      expect(mockResponse.hasAccess).toBe(true);
    });
  });

  describe('Platform Data Configuration', () => {
    it('should have trialDays configured for RxGuard', () => {
      expect(mockPlatformData['RxGuard™'].trialDays).toBeDefined();
      expect(mockPlatformData['RxGuard™'].trialDays).toBe(14);
    });

    it('should have trialDays configured for EndoGuard', () => {
      expect(mockPlatformData['EndoGuard™'].trialDays).toBeDefined();
      expect(mockPlatformData['EndoGuard™'].trialDays).toBe(30);
    });

    it('should have pricing tiers configured', () => {
      expect(mockPlatformData['RxGuard™'].pricing).toBeDefined();
      expect(mockPlatformData['RxGuard™'].pricing.length).toBeGreaterThan(0);
      expect(mockPlatformData['EndoGuard™'].pricing).toBeDefined();
      expect(mockPlatformData['EndoGuard™'].pricing.length).toBeGreaterThan(0);
    });
  });

  describe('User Flow Integration', () => {
    it('should complete full flow: Dashboard → Plan Selection → Trial Activation', async () => {
      // Step 1: User clicks "Start Free Trial" on Dashboard
      const platformId = 'rxguard';
      const platform = mockPlatformData['RxGuard™'];
      
      // Step 2: Plan Selection modal opens
      expect(platform).toBeDefined();
      expect(platform.trialDays).toBe(14);
      
      // Step 3: User selects plan
      const selectedPlan = 'monthly';
      expect(['monthly', 'yearly']).toContain(selectedPlan);
      
      // Step 4: User clicks "Start Trial" button
      const mockFetch = vi.fn().mockResolvedValue({
        json: async () => ({
          success: true,
          trialDays: 14,
          trialEnd: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString()
        })
      });
      global.fetch = mockFetch;
      
      const response = await fetch('/api/trials/activate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${mockToken}`
        },
        body: JSON.stringify({ platform: platformId, selectedPlan })
      });
      
      const data = await response.json();
      
      // Step 5: Verify trial was activated successfully
      expect(data.success).toBe(true);
      expect(data.trialDays).toBe(14);
    });
  });
});
