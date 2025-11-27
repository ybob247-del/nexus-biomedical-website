/**
 * Create Stripe Checkout Session for Platform Subscriptions
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
    const { platform, userId, userEmail, selectedPlan } = req.body;

    if (!platform || !userId || !userEmail) {
      return res.status(400).json({ 
        error: 'Missing required fields: platform, userId, userEmail' 
      });
    }

    // Get user's selected plan from subscription if not provided
    let planToUse = selectedPlan;
    if (!planToUse && userId) {
      const subscriptionResult = await query(
        `SELECT selected_plan FROM subscriptions 
         WHERE user_id = $1 AND platform = $2 
         ORDER BY created_at DESC LIMIT 1`,
        [userId, platform]
      );

      if (subscriptionResult.rows.length > 0) {
        planToUse = subscriptionResult.rows[0].selected_plan || 'monthly';
      } else {
        planToUse = 'monthly'; // Default to monthly
      }
    } else if (!planToUse) {
      planToUse = 'monthly';
    }

    // Define subscription products with monthly/yearly pricing
    const products = {
      rxguard: {
        name: 'RxGuard™ - Drug Interaction Checker',
        description: 'AI-powered drug interaction analysis with FDA data',
        successUrl: '/rxguard/dashboard',
        priceIds: {
          monthly: process.env.STRIPE_RXGUARD_MONTHLY_PRICE_ID || process.env.STRIPE_RXGUARD_PRICE_ID,
          yearly: process.env.STRIPE_RXGUARD_YEARLY_PRICE_ID
        },
        trialDays: 14
      },
      endoguard: {
        name: 'EndoGuard™ - Hormone Health Platform',
        description: 'Comprehensive hormone assessment and EDC exposure analysis',
        successUrl: '/endoguard/assessment',
        priceIds: {
          monthly: process.env.STRIPE_ENDOGUARD_MONTHLY_PRICE_ID || process.env.STRIPE_ENDOGUARD_PRICE_ID,
          yearly: process.env.STRIPE_ENDOGUARD_YEARLY_PRICE_ID
        },
        trialDays: 30
      }
    };

    const product = products[platform.toLowerCase()];

    if (!product) {
      return res.status(400).json({ 
        error: 'Invalid platform. Must be "rxguard" or "endoguard"' 
      });
    }

    // Create or retrieve customer
    const customers = await stripe.customers.list({
      email: userEmail,
      limit: 1
    });

    let customer;
    if (customers.data.length > 0) {
      customer = customers.data[0];
    } else {
      customer = await stripe.customers.create({
        email: userEmail,
        metadata: {
          userId,
          platform
        }
      });
    }

    // Get the appropriate price ID based on selected plan
    const priceId = product.priceIds[planToUse];

    if (!priceId) {
      return res.status(400).json({ 
        error: `No Stripe price configured for ${platform} ${planToUse} plan` 
      });
    }

    // Create checkout session with selected plan
    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1
        }
      ],
      subscription_data: {
        metadata: {
          userId,
          platform,
          selectedPlan: planToUse
        }
      },
      success_url: `${process.env.VITE_APP_URL}${product.successUrl}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.VITE_APP_URL}/pricing?canceled=true`,
      metadata: {
        userId,
        platform,
        selectedPlan: planToUse
      }
    });

    return res.status(200).json({
      success: true,
      sessionId: session.id,
      url: session.url,
      selectedPlan: planToUse
    });

  } catch (error) {
    console.error('Stripe checkout error:', error);
    return res.status(500).json({ 
      error: 'Failed to create checkout session',
      message: error.message 
    });
  }
}
