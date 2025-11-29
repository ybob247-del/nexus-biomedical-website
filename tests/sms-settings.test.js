/**
 * SMS Settings API Tests
 * Tests for SMS notification settings endpoints
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';

const API_BASE = process.env.VITE_API_URL || 'http://localhost:3006';

describe('SMS Settings API', () => {
  let authToken;
  let testUserId;

  // Create a test user and get auth token
  beforeAll(async () => {
    const timestamp = Date.now();
    const testEmail = `smstest${timestamp}@test.com`;
    
    // Signup test user
    const signupResponse = await fetch(`${API_BASE}/api/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmail,
        password: 'TestPass123!',
        firstName: 'SMS',
        lastName: 'Test'
      })
    });

    expect(signupResponse.ok).toBe(true);
    const signupData = await signupResponse.json();
    authToken = signupData.token;
    testUserId = signupData.user.id;
  });

  describe('GET /api/user/sms-settings', () => {
    it('should return SMS settings for authenticated user', async () => {
      const response = await fetch(`${API_BASE}/api/user/sms-settings`, {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });

      expect(response.ok).toBe(true);
      const data = await response.json();
      
      expect(data).toHaveProperty('phone_number');
      expect(data).toHaveProperty('sms_notifications_enabled');
      expect(typeof data.sms_notifications_enabled).toBe('boolean');
    });

    it('should return 401 without auth token', async () => {
      const response = await fetch(`${API_BASE}/api/user/sms-settings`);
      expect(response.status).toBe(401);
    });

    it('should return 401 with invalid token', async () => {
      const response = await fetch(`${API_BASE}/api/user/sms-settings`, {
        headers: {
          'Authorization': 'Bearer invalid-token-12345'
        }
      });
      expect(response.status).toBe(401);
    });
  });

  describe('POST /api/user/update-sms-settings', () => {
    it('should update SMS settings with valid phone number', async () => {
      const response = await fetch(`${API_BASE}/api/user/update-sms-settings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({
          phone_number: '+14155552671',
          sms_notifications_enabled: true
        })
      });

      expect(response.ok).toBe(true);
      const data = await response.json();
      
      expect(data.success).toBe(true);
      expect(data.phone_number).toBe('+14155552671');
      expect(data.sms_notifications_enabled).toBe(true);
    });

    it('should disable SMS notifications', async () => {
      const response = await fetch(`${API_BASE}/api/user/update-sms-settings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({
          phone_number: '+14155552671',
          sms_notifications_enabled: false
        })
      });

      expect(response.ok).toBe(true);
      const data = await response.json();
      
      expect(data.success).toBe(true);
      expect(data.sms_notifications_enabled).toBe(false);
    });

    it('should reject invalid phone number format', async () => {
      const response = await fetch(`${API_BASE}/api/user/update-sms-settings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({
          phone_number: '555-1234', // Invalid format
          sms_notifications_enabled: true
        })
      });

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.error).toContain('E.164');
    });

    it('should reject enabling SMS without phone number', async () => {
      const response = await fetch(`${API_BASE}/api/user/update-sms-settings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({
          phone_number: '',
          sms_notifications_enabled: true
        })
      });

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.error).toContain('required');
    });

    it('should return 401 without auth token', async () => {
      const response = await fetch(`${API_BASE}/api/user/update-sms-settings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          phone_number: '+14155552671',
          sms_notifications_enabled: true
        })
      });

      expect(response.status).toBe(401);
    });

    it('should persist SMS settings across requests', async () => {
      // Update settings
      await fetch(`${API_BASE}/api/user/update-sms-settings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({
          phone_number: '+14155559999',
          sms_notifications_enabled: true
        })
      });

      // Verify settings persisted
      const response = await fetch(`${API_BASE}/api/user/sms-settings`, {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });

      expect(response.ok).toBe(true);
      const data = await response.json();
      
      expect(data.phone_number).toBe('+14155559999');
      expect(data.sms_notifications_enabled).toBe(true);
    });

    it('should accept various E.164 phone formats', async () => {
      const validPhones = [
        '+14155552671',  // US
        '+442071234567', // UK
        '+61212345678',  // Australia
        '+81312345678'   // Japan
      ];

      for (const phone of validPhones) {
        const response = await fetch(`${API_BASE}/api/user/update-sms-settings`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
          },
          body: JSON.stringify({
            phone_number: phone,
            sms_notifications_enabled: true
          })
        });

        expect(response.ok).toBe(true);
      }
    });
  });

  describe('SMS Settings Integration', () => {
    it('should allow user to opt-in and opt-out multiple times', async () => {
      // Opt-in
      let response = await fetch(`${API_BASE}/api/user/update-sms-settings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({
          phone_number: '+14155552671',
          sms_notifications_enabled: true
        })
      });
      expect(response.ok).toBe(true);

      // Opt-out
      response = await fetch(`${API_BASE}/api/user/update-sms-settings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({
          phone_number: '+14155552671',
          sms_notifications_enabled: false
        })
      });
      expect(response.ok).toBe(true);

      // Opt-in again
      response = await fetch(`${API_BASE}/api/user/update-sms-settings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({
          phone_number: '+14155552671',
          sms_notifications_enabled: true
        })
      });
      expect(response.ok).toBe(true);

      // Verify final state
      const getResponse = await fetch(`${API_BASE}/api/user/sms-settings`, {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      const data = await getResponse.json();
      expect(data.sms_notifications_enabled).toBe(true);
    });
  });
});
