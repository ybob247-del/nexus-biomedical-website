/**
 * Vercel Serverless Function: Stripe Checkout Session
 *
 * POST creates a user-specific Checkout session. The mode follows the price:
 * a recurring price opens a subscription checkout, a one-time price opens a
 * payment checkout, so every existing subscription caller keeps working.
 *
 * GET ?session_id=cs_... reports whether a one-time purchase was paid. The site
 * calls it when the buyer returns from Stripe, so access is checked against
 * Stripe directly and needs no database record.
 *
 * FRONTEND_URL decides where Stripe sends the buyer back. Set it per Vercel
 * project so each brand returns to its own domain.
 *
 * Written as an ES module. The project declares "type": "module", and the
 * previous CommonJS version (require / module.exports) crashed on load, so
 * this endpoint had never answered a request in production.
 */

import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const FRONTEND_URL = (process.env.FRONTEND_URL || 'https://nexusbiomedical.ai').replace(/\/$/, '');

// Same-site paths only, so a request cannot send a buyer to another site.
function safePath(path, fallback) {
  if (typeof path !== 'string') return fallback;
  if (!path.startsWith('/') || path.startsWith('//')) return fallback;
  // Reject query strings, fragments, backslashes and whitespace. (An earlier
  // version escaped this wrong and matched a literal "s", so every path with
  // one, such as /assessment, fell back to "/" and buyers never returned to
  // the page that unlocks their purchase.)
  if (/[?#\\\s]/.test(path)) return fallback;
  return path;
}

async function verifyPurchase(req, res) {
  const sessionId = req.query && req.query.session_id;
  if (typeof sessionId !== 'string' || !/^cs_(test|live)_[A-Za-z0-9]+$/.test(sessionId)) {
    return res.status(400).json({ paid: false, error: 'Invalid session id' });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    return res.status(200).json({
      // A 100%-off promotion code completes checkout with nothing to charge,
      // which Stripe reports as 'no_payment_required' rather than 'paid'.
      paid:
        session.mode === 'payment' &&
        session.status === 'complete' &&
        (session.payment_status === 'paid' || session.payment_status === 'no_payment_required'),
      sku: (session.metadata && session.metadata.sku) || null,
    });
  } catch (error) {
    console.error('Error verifying checkout session:', error.message);
    return res.status(404).json({ paid: false, error: 'Session not found' });
  }
}

export default async function handler(req, res) {
  if (req.method === 'GET') {
    return verifyPurchase(req, res);
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { priceId, email, userId, platform, trialDays, sku, successPath, cancelPath, language } = req.body || {};

    if (!priceId || !email) {
      return res.status(400).json({
        error: 'Missing required fields: priceId and email are required'
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // The price decides the checkout mode. Stripe rejects a one-time price in a
    // subscription checkout.
    const price = await stripe.prices.retrieve(priceId);
    const isOneTime = !price.recurring;

    const common = {
      customer_email: email,
      client_reference_id: userId || email,
      // Show Stripe's checkout page in the visitor's language.
      locale: String(language || '').startsWith('es') ? 'es' : 'auto',
      line_items: [{ price: priceId, quantity: 1 }],
      metadata: {
        userId: userId || email,
        platform: platform || 'unknown',
        sku: typeof sku === 'string' ? sku.slice(0, 100) : '',
        created_at: new Date().toISOString(),
      },
      // Stripe allows at most 24 hours; stay just under it.
      expires_at: Math.floor(Date.now() / 1000) + (23 * 60 * 60),
    };

    const session = isOneTime
      ? await stripe.checkout.sessions.create({
          ...common,
          mode: 'payment',
          // The consumer brand accepts promotion codes (launch discounts, free
          // copies for testing and reviewers). Nexus checkout is unchanged.
          allow_promotion_codes: (process.env.VITE_BRAND || '').toLowerCase() === 'notimaginingit' || undefined,
          success_url: `${FRONTEND_URL}${safePath(successPath, '/')}?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${FRONTEND_URL}${safePath(cancelPath, '/')}`,
        })
      : await stripe.checkout.sessions.create({
          ...common,
          mode: 'subscription',
          success_url: `${FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${FRONTEND_URL}/`,
          subscription_data: trialDays ? { trial_period_days: trialDays } : undefined,
        });

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
}
