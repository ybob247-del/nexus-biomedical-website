/**
 * Vercel Serverless Function: Stripe Webhook Handler
 * 
 * This endpoint receives webhook events from Stripe to verify payments
 * and grant/revoke access to platforms.
 * 
 * Events handled:
 * - checkout.session.completed: Payment successful, grant access
 * - customer.subscription.deleted: Subscription cancelled, revoke access
 * - customer.subscription.updated: Subscription status changed
 */

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

module.exports = async (req, res) => {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    // Verify webhook signature
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      webhookSecret
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        
        console.log('Payment successful:', {
          sessionId: session.id,
          customerEmail: session.customer_email,
          userId: session.client_reference_id,
          subscriptionId: session.subscription,
          platform: session.metadata?.platform,
        });

        // TODO: Grant access to platform
        // This is where you would:
        // 1. Create user account in database
        // 2. Store subscription details
        // 3. Send welcome email
        // 4. Grant access to platform
        
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        
        console.log('Subscription cancelled:', {
          subscriptionId: subscription.id,
          customerId: subscription.customer,
          status: subscription.status,
        });

        // TODO: Revoke access to platform
        // This is where you would:
        // 1. Update user subscription status in database
        // 2. Revoke platform access
        // 3. Send cancellation confirmation email
        
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object;
        
        console.log('Subscription updated:', {
          subscriptionId: subscription.id,
          customerId: subscription.customer,
          status: subscription.status,
          cancelAtPeriodEnd: subscription.cancel_at_period_end,
        });

        // TODO: Update subscription status in database
        
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object;
        
        console.log('Payment failed:', {
          invoiceId: invoice.id,
          customerId: invoice.customer,
          amountDue: invoice.amount_due,
        });

        // TODO: Handle payment failure
        // This is where you would:
        // 1. Send payment failure notification
        // 2. Possibly suspend access after grace period
        
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    // Return a response to acknowledge receipt of the event
    res.json({ received: true });

  } catch (error) {
    console.error('Error handling webhook event:', error);
    return res.status(500).json({ 
      error: 'Webhook handler failed',
      message: error.message,
    });
  }
};

