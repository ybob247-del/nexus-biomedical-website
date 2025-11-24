/**
 * Create Stripe Checkout Session for Platform Subscriptions
 */

import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { platform, userId, userEmail } = req.body;

    if (!platform || !userId || !userEmail) {
      return res.status(400).json({ 
        error: 'Missing required fields: platform, userId, userEmail' 
      });
    }

    // Define subscription products
    const products = {
      rxguard: {
        name: 'RxGuard™ - Drug Interaction Checker',
        price: 3900, // $39.00 in cents
        description: 'AI-powered drug interaction analysis with FDA data',
        successUrl: '/rxguard/dashboard',
        priceId: process.env.STRIPE_RXGUARD_PRICE_ID,
        trialDays: 14
      },
      endoguard: {
        name: 'EndoGuard™ - Hormone Health Platform',
        price: 9700, // $97.00 in cents
        description: 'Comprehensive hormone assessment and EDC exposure analysis',
        successUrl: '/endoguard/assessment',
        priceId: process.env.STRIPE_ENDOGUARD_PRICE_ID,
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

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: product.priceId,
          quantity: 1
        }
      ],
      subscription_data: {
        trial_period_days: product.trialDays, // 14 days for RxGuard, 30 days for EndoGuard
        metadata: {
          userId,
          platform
        }
      },
      success_url: `${process.env.VITE_APP_URL}${product.successUrl}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.VITE_APP_URL}/pricing?canceled=true`,
      metadata: {
        userId,
        platform
      }
    });

    return res.status(200).json({
      success: true,
      sessionId: session.id,
      url: session.url
    });

  } catch (error) {
    console.error('Stripe checkout error:', error);
    return res.status(500).json({ 
      error: 'Failed to create checkout session',
      message: error.message 
    });
  }
}
