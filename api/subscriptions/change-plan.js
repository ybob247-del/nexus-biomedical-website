/**
 * Change Subscription Plan API
 * POST /api/subscriptions/change-plan
 * Changes user's subscription from monthly to yearly or vice versa
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
    const { platform, newPlan } = req.body;

    if (!platform || !newPlan) {
      return res.status(400).json({ error: 'Platform and newPlan are required' });
    }

    if (!['monthly', 'yearly'].includes(newPlan)) {
      return res.status(400).json({ error: 'Invalid plan. Must be monthly or yearly' });
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
      `SELECT id, stripe_subscription_id, selected_plan
       FROM subscriptions
       WHERE user_id = $1 AND platform = $2 AND status = 'active'`,
      [userId, platform]
    );

    if (subscriptionResult.rows.length === 0) {
      return res.status(404).json({ error: 'No active subscription found for this platform' });
    }

    const subscription = subscriptionResult.rows[0];

    if (subscription.selected_plan === newPlan) {
      return res.status(400).json({ error: 'You are already on this plan' });
    }

    // Define Stripe price IDs
    const stripePriceIds = {
      rxguard: {
        monthly: process.env.STRIPE_RXGUARD_MONTHLY_PRICE_ID || process.env.STRIPE_RXGUARD_PRICE_ID,
        yearly: process.env.STRIPE_RXGUARD_YEARLY_PRICE_ID
      },
      endoguard: {
        monthly: process.env.STRIPE_ENDOGUARD_MONTHLY_PRICE_ID || process.env.STRIPE_ENDOGUARD_PRICE_ID,
        yearly: process.env.STRIPE_ENDOGUARD_YEARLY_PRICE_ID
      }
    };

    const newPriceId = stripePriceIds[platform.toLowerCase()]?.[newPlan];

    if (!newPriceId) {
      return res.status(400).json({ error: `No Stripe price configured for ${platform} ${newPlan} plan` });
    }

    // Update subscription in Stripe
    const stripeSubscription = await stripe.subscriptions.retrieve(subscription.stripe_subscription_id);
    
    const updatedSubscription = await stripe.subscriptions.update(
      subscription.stripe_subscription_id,
      {
        items: [{
          id: stripeSubscription.items.data[0].id,
          price: newPriceId
        }],
        proration_behavior: 'create_prorations', // Prorate the change
        metadata: {
          ...stripeSubscription.metadata,
          selectedPlan: newPlan
        }
      }
    );

    // Update database
    await query(
      `UPDATE subscriptions
       SET selected_plan = $1, updated_at = NOW()
       WHERE id = $2`,
      [newPlan, subscription.id]
    );

    return res.status(200).json({
      success: true,
      message: `Plan changed to ${newPlan} successfully`,
      newPlan,
      proration: updatedSubscription.latest_invoice
    });

  } catch (error) {
    console.error('Change plan error:', error);
    return res.status(500).json({
      error: 'Failed to change plan',
      message: error.message
    });
  }
}
