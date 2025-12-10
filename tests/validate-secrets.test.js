/**
 * Validate Secrets Test
 * Tests that new API credentials are working correctly
 * This test runs in Node environment without browser dependencies
 */

import { describe, it, expect } from 'vitest';

describe('API Credentials Validation', () => {
  it('should validate OpenAI API key is working', async () => {
    expect(process.env.OPENAI_API_KEY).toBeDefined();
    expect(process.env.OPENAI_API_KEY).toMatch(/^sk-proj-/);
    
    // Test with direct HTTP request instead of SDK
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: 'Test' }],
        max_tokens: 5
      })
    });
    
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.choices).toBeDefined();
    expect(data.choices[0].message.content).toBeDefined();
  }, 15000);

  it('should validate Twilio credentials format', () => {
    expect(process.env.TWILIO_ACCOUNT_SID).toBeDefined();
    expect(process.env.TWILIO_AUTH_TOKEN).toBeDefined();
    expect(process.env.TWILIO_PHONE_NUMBER).toBeDefined();
    
    // Validate format
    expect(process.env.TWILIO_ACCOUNT_SID).toMatch(/^AC[a-f0-9]{32}$/);
    expect(process.env.TWILIO_AUTH_TOKEN).toMatch(/^[a-f0-9]{32}$/);
    expect(process.env.TWILIO_PHONE_NUMBER).toMatch(/^\+?\d{10,15}$/);
  });
});
