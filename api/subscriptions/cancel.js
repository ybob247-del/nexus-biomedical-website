/**
 * Cancel Subscription API
 * POST /api/subscriptions/cancel
 * Cancels user's subscription at the end of the billing period
 */

import Stripe from 'stripe';
import { query } from '../utils/db.js';
import { extractToken, verifyToken } from '../utils/auth.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { platform } = req.body;

    if (!platform) {
      return res.status(400).json({ error: 'Platform is required' });
    }

    // Extract and verify token
    const token = extractToken(req);
    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    const userId = decoded.userId;

    // Get current subscription
    const subscriptionResult = await query(
      `SELECT id, stripe_subscription_id
       FROM subscriptions
       WHERE user_id = $1 AND platform = $2 AND status = 'active'`,
      [userId, platform]
    );

    if (subscriptionResult.rows.length === 0) {
      return res.status(404).json({ error: 'No active subscription found for this platform' });
    }

    const subscription = subscriptionResult.rows[0];

    // Cancel subscription in Stripe (at period end)
    const updatedSubscription = await stripe.subscriptions.update(
      subscription.stripe_subscription_id,
      {
        cancel_at_period_end: true
      }
    );

    // Update database
    await query(
      `UPDATE subscriptions
       SET cancel_at_period_end = true, updated_at = NOW()
       WHERE id = $1`,
      [subscription.id]
    );

    return res.status(200).json({
      success: true,
      message: 'Subscription will be canceled at the end of the billing period',
      endsAt: new Date(updatedSubscription.current_period_end * 1000)
    });

  } catch (error) {
    console.error('Cancel subscription error:', error);
    return res.status(500).json({
      error: 'Failed to cancel subscription',
      message: error.message
    });
  }
}
