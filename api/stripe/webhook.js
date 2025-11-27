/**
 * Stripe Webhook Handler
 * Handles subscription lifecycle events from Stripe
 * Events: checkout.session.completed, customer.subscription.updated, customer.subscription.deleted
 */

import Stripe from 'stripe';
import { query } from '../utils/db.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export const config = {
  api: {
    bodyParser: false, // Disable body parsing, need raw body for signature verification
  },
};

async function buffer(readable) {
  const chunks = [];
  for await (const chunk of readable) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const buf = await buffer(req);
  const sig = req.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  console.log('Received Stripe webhook event:', event.type);

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object);
        break;

      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object);
        break;

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object);
        break;

      case 'invoice.payment_succeeded':
        await handlePaymentSucceeded(event.data.object);
        break;

      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data.object);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.status(200).json({ received: true });
  } catch (error) {
    console.error('Webhook handler error:', error);
    res.status(500).json({ error: 'Webhook handler failed' });
  }
}

/**
 * Handle checkout session completed
 * Creates initial subscription and platform access records
 */
async function handleCheckoutCompleted(session) {
  const { customer, subscription: subscriptionId, metadata } = session;
  const { userId, platform, selectedPlan } = metadata;

  if (!userId || !platform) {
    console.error('Missing userId or platform in checkout session metadata');
    return;
  }

  console.log(`Checkout completed for user ${userId}, platform ${platform}`);

  // Fetch full subscription details from Stripe
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);

  // Create or update subscription record
  await upsertSubscription(userId, platform, customer, subscription, selectedPlan);

  // Grant platform access
  await grantPlatformAccess(userId, platform, subscription);
}

/**
 * Handle subscription updated
 * Updates subscription status and access
 */
async function handleSubscriptionUpdated(subscription) {
  const { customer, metadata } = subscription;
  const { userId, platform, selectedPlan } = metadata;

  if (!userId || !platform) {
    console.log('Missing userId or platform in subscription metadata');
    return;
  }

  console.log(`Subscription updated for user ${userId}, platform ${platform}`);

  // Update subscription record
  await upsertSubscription(userId, platform, customer, subscription, selectedPlan);

  // Update platform access based on subscription status
  if (subscription.status === 'active' || subscription.status === 'trialing') {
    await grantPlatformAccess(userId, platform, subscription);
  } else {
    await revokePlatformAccess(userId, platform);
  }
}

/**
 * Handle subscription deleted/canceled
 * Revokes platform access
 */
async function handleSubscriptionDeleted(subscription) {
  const { metadata } = subscription;
  const { userId, platform } = metadata;

  if (!userId || !platform) {
    console.log('Missing userId or platform in subscription metadata');
    return;
  }

  console.log(`Subscription deleted for user ${userId}, platform ${platform}`);

  // Update subscription status to canceled
  await query(
    `UPDATE subscriptions 
     SET status = 'canceled', 
         canceled_at = NOW(),
         updated_at = NOW()
     WHERE user_id = $1 AND platform = $2`,
    [userId, platform]
  );

  // Revoke platform access
  await revokePlatformAccess(userId, platform);
}

/**
 * Handle successful payment
 * Ensures subscription and access are active
 */
async function handlePaymentSucceeded(invoice) {
  const { customer, subscription: subscriptionId } = invoice;

  if (!subscriptionId) return;

  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  const { metadata } = subscription;
  const { userId, platform } = metadata;

  if (!userId || !platform) return;

  console.log(`Payment succeeded for user ${userId}, platform ${platform}`);

  // Ensure subscription is active
  const { selectedPlan } = subscription.metadata;
  await upsertSubscription(userId, platform, customer, subscription, selectedPlan);
  await grantPlatformAccess(userId, platform, subscription);
}

/**
 * Handle failed payment
 * May need to revoke access depending on grace period
 */
async function handlePaymentFailed(invoice) {
  const { customer, subscription: subscriptionId } = invoice;

  if (!subscriptionId) return;

  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  const { metadata } = subscription;
  const { userId, platform } = metadata;

  if (!userId || !platform) return;

  console.log(`Payment failed for user ${userId}, platform ${platform}`);

  // Update subscription status
  const { selectedPlan } = subscription.metadata;
  await upsertSubscription(userId, platform, customer, subscription, selectedPlan);

  // If subscription is past_due or unpaid, revoke access
  if (subscription.status === 'past_due' || subscription.status === 'unpaid') {
    await revokePlatformAccess(userId, platform);
  }
}

/**
 * Create or update subscription record in database
 */
async function upsertSubscription(userId, platform, customerId, subscription, selectedPlan) {
  try {
    await query(
      `INSERT INTO subscriptions (
        user_id, 
        platform, 
        stripe_subscription_id, 
        stripe_customer_id, 
        status,
        current_period_start,
        current_period_end,
        trial_start,
        trial_end,
        cancel_at_period_end,
        canceled_at,
        selected_plan,
        created_at,
        updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, NOW(), NOW())
      ON CONFLICT (user_id, platform) 
      DO UPDATE SET
        stripe_subscription_id = $3,
        stripe_customer_id = $4,
        status = $5,
        current_period_start = $6,
        current_period_end = $7,
        trial_start = $8,
        trial_end = $9,
        cancel_at_period_end = $10,
        canceled_at = $11,
        selected_plan = $12,
        updated_at = NOW()`,
      [
        userId,
        platform,
        subscription.id,
        customerId,
        subscription.status,
        new Date(subscription.current_period_start * 1000),
        new Date(subscription.current_period_end * 1000),
        subscription.trial_start ? new Date(subscription.trial_start * 1000) : null,
        subscription.trial_end ? new Date(subscription.trial_end * 1000) : null,
        subscription.cancel_at_period_end,
        subscription.canceled_at ? new Date(subscription.canceled_at * 1000) : null,
        selectedPlan || 'monthly',
      ]
    );
    console.log(`Subscription upserted for user ${userId}, platform ${platform}`);
  } catch (error) {
    console.error('Error upserting subscription:', error);
    throw error;
  }
}

/**
 * Grant platform access to user
 */
async function grantPlatformAccess(userId, platform, subscription) {
  try {
    // Get subscription ID from database
    const subResult = await query(
      `SELECT id FROM subscriptions WHERE user_id = $1 AND platform = $2`,
      [userId, platform]
    );

    if (subResult.rows.length === 0) {
      console.error('Subscription not found in database');
      return;
    }

    const subscriptionId = subResult.rows[0].id;

    // Calculate access expiration (end of current period)
    const expiresAt = new Date(subscription.current_period_end * 1000);

    await query(
      `INSERT INTO platform_access (
        user_id,
        subscription_id,
        platform,
        is_active,
        access_granted_at,
        access_expires_at,
        created_at,
        updated_at
      ) VALUES ($1, $2, $3, true, NOW(), $4, NOW(), NOW())
      ON CONFLICT (user_id, platform, subscription_id)
      DO UPDATE SET
        is_active = true,
        access_expires_at = $4,
        updated_at = NOW()`,
      [userId, subscriptionId, platform, expiresAt]
    );

    console.log(`Platform access granted for user ${userId}, platform ${platform}`);
  } catch (error) {
    console.error('Error granting platform access:', error);
    throw error;
  }
}

/**
 * Revoke platform access from user
 */
async function revokePlatformAccess(userId, platform) {
  try {
    await query(
      `UPDATE platform_access 
       SET is_active = false, updated_at = NOW()
       WHERE user_id = $1 AND platform = $2`,
      [userId, platform]
    );
    console.log(`Platform access revoked for user ${userId}, platform ${platform}`);
  } catch (error) {
    console.error('Error revoking platform access:', error);
    throw error;
  }
}
