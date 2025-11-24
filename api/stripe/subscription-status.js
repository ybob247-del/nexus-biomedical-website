/**
 * Check user's subscription status for a platform
 */

import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userEmail, platform } = req.query;

    if (!userEmail || !platform) {
      return res.status(400).json({ 
        error: 'Missing required parameters: userEmail, platform' 
      });
    }

    // Find customer by email
    const customers = await stripe.customers.list({
      email: userEmail,
      limit: 1
    });

    if (customers.data.length === 0) {
      return res.status(200).json({
        success: true,
        hasAccess: false,
        status: 'no_subscription',
        message: 'No subscription found'
      });
    }

    const customer = customers.data[0];

    // Get active subscriptions
    const subscriptions = await stripe.subscriptions.list({
      customer: customer.id,
      status: 'active',
      limit: 10
    });

    // Check if user has subscription for this platform
    const platformSubscription = subscriptions.data.find(sub => 
      sub.metadata.platform === platform.toLowerCase()
    );

    if (!platformSubscription) {
      // Check for trialing subscriptions
      const trialingSubscriptions = await stripe.subscriptions.list({
        customer: customer.id,
        status: 'trialing',
        limit: 10
      });

      const trialingPlatformSub = trialingSubscriptions.data.find(sub =>
        sub.metadata.platform === platform.toLowerCase()
      );

      if (trialingPlatformSub) {
        return res.status(200).json({
          success: true,
          hasAccess: true,
          status: 'trialing',
          subscription: {
            id: trialingPlatformSub.id,
            status: trialingPlatformSub.status,
            trialEnd: new Date(trialingPlatformSub.trial_end * 1000).toISOString(),
            currentPeriodEnd: new Date(trialingPlatformSub.current_period_end * 1000).toISOString()
          }
        });
      }

      return res.status(200).json({
        success: true,
        hasAccess: false,
        status: 'no_subscription',
        message: `No active subscription found for ${platform}`
      });
    }

    // User has active subscription
    return res.status(200).json({
      success: true,
      hasAccess: true,
      status: platformSubscription.status,
      subscription: {
        id: platformSubscription.id,
        status: platformSubscription.status,
        currentPeriodEnd: new Date(platformSubscription.current_period_end * 1000).toISOString(),
        cancelAtPeriodEnd: platformSubscription.cancel_at_period_end
      }
    });

  } catch (error) {
    console.error('Subscription status check error:', error);
    return res.status(500).json({ 
      error: 'Failed to check subscription status',
      message: error.message 
    });
  }
}
