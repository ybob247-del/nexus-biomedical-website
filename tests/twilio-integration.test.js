import { describe, it, expect } from 'vitest';

describe('Twilio Integration', () => {
  it('should have valid Twilio credentials configured', async () => {
    // Test that environment variables are set
    expect(process.env.TWILIO_ACCOUNT_SID).toBeDefined();
    expect(process.env.TWILIO_AUTH_TOKEN).toBeDefined();
    expect(process.env.TWILIO_PHONE_NUMBER).toBeDefined();
    
    // Test that credentials have correct format
    expect(process.env.TWILIO_ACCOUNT_SID).toMatch(/^AC[a-f0-9]{32}$/);
    expect(process.env.TWILIO_PHONE_NUMBER).toMatch(/^\d{11}$/);
  });

  it('should be able to validate Twilio account', async () => {
    const response = await fetch('http://localhost:3000/api/test-twilio');
    expect(response.ok).toBe(true);
    
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.accountStatus).toBe('active');
    expect(data.friendlyName).toBeDefined();
  });
});
