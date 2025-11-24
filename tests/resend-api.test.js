import { describe, it, expect } from 'vitest';
import { Resend } from 'resend';

describe('Resend API Key Validation', () => {
  it('should successfully validate RESEND_API_KEY', async () => {
    const resend = new Resend(process.env.RESEND_API_KEY);
    
    // Test API key by fetching API keys list (lightweight endpoint)
    try {
      const response = await fetch('https://api.resend.com/api-keys', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
      });
      
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data).toBeDefined();
      expect(Array.isArray(data.data)).toBe(true);
    } catch (error) {
      throw new Error(`Resend API key validation failed: ${error.message}`);
    }
  }, 10000); // 10 second timeout
});
