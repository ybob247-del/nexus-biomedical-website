import { describe, it, expect } from 'vitest';

describe('Stripe API Key Validation', () => {
  it('should validate Stripe secret key by retrieving account info', async () => {
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    
    expect(stripeSecretKey).toBeDefined();
    expect(stripeSecretKey).toMatch(/^sk_(test|live)_/);

    // Test the key by making a simple API call to Stripe
    const response = await fetch('https://api.stripe.com/v1/account', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${stripeSecretKey}`,
      },
    });

    expect(response.ok).toBe(true);
    
    const account = await response.json();
    expect(account).toHaveProperty('id');
    expect(account.id).toMatch(/^acct_/);
  });

  it('should validate Stripe publishable key format', () => {
    const stripePublishableKey = process.env.STRIPE_PUBLISHABLE_KEY;
    
    expect(stripePublishableKey).toBeDefined();
    expect(stripePublishableKey).toMatch(/^pk_(test|live)_/);
  });
});
