/**
 * Vercel Serverless Function: Create Stripe Checkout Session
 * 
 * This endpoint creates a user-specific, one-time Stripe checkout session
 * that cannot be shared or reused by other users.
 * 
 * Security features:
 * - User-specific session (tied to email)
 * - One-time use (expires after 24 hours or after payment)
 * - Cannot be shared (friend's email won't match)
 * - Webhook verification ensures payment completed
 */

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

module.exports = async (req, res) => {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { priceId, email, userId, platform, trialDays } = req.body;

    // Validate required fields
    if (!priceId || !email) {
      return res.status(400).json({ 
        error: 'Missing required fields: priceId and email are required' 
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      customer_email: email, // Tie to specific user email
      client_reference_id: userId || email, // Your internal user ID or email
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.FRONTEND_URL || 'https://nexusbiomedical.ai'}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL || 'https://nexusbiomedical.ai'}/`,
      subscription_data: trialDays ? {
        trial_period_days: trialDays,
      } : undefined,
      metadata: {
        userId: userId || email,
        platform: platform || 'unknown',
        created_at: new Date().toISOString(),
      },
      // Session expires after 24 hours
      expires_at: Math.floor(Date.now() / 1000) + (24 * 60 * 60),
    });

    // Return the checkout URL
    return res.status(200).json({ 
      url: session.url,
      sessionId: session.id,
    });

  } catch (error) {
    console.error('Error creating checkout session:', error);
    return res.status(500).json({ 
      error: 'Failed to create checkout session',
      message: error.message,
    });
  }
};

