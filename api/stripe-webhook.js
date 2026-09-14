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

        // Grant access to platform
        const { query } = require('./utils/db');
        
        try {
          // Find or create user
          let user;
          const userResult = await query(
            'SELECT id FROM users WHERE email = $1',
            [session.customer_email.toLowerCase()]
          );
          
          if (userResult.rows.length > 0) {
            user = userResult.rows[0];
          } else {
            // Create user account (they paid before signing up)
            const { hashPassword } = require('./utils/auth');
            const tempPassword = await hashPassword(Math.random().toString(36).slice(-8));
            
            const newUserResult = await query(
              `INSERT INTO users (email, password_hash)
               VALUES ($1, $2)
               RETURNING id`,
              [session.customer_email.toLowerCase(), tempPassword]
            );
            user = newUserResult.rows[0];
          }
          
          // Get subscription details from Stripe
          const subscription = await stripe.subscriptions.retrieve(session.subscription);
          
          // Store subscription in database
          await query(
            `INSERT INTO subscriptions (
              user_id, stripe_customer_id, stripe_subscription_id, stripe_price_id,
              platform, status, current_period_start, current_period_end, trial_end
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            ON CONFLICT (stripe_subscription_id) DO UPDATE SET
              status = EXCLUDED.status,
              current_period_start = EXCLUDED.current_period_start,
              current_period_end = EXCLUDED.current_period_end`,
            [
              user.id,
              session.customer,
              session.subscription,
              subscription.items.data[0].price.id,
              session.metadata?.platform || 'Unknown',
              subscription.status,
              new Date(subscription.current_period_start * 1000),
              new Date(subscription.current_period_end * 1000),
              subscription.trial_end ? new Date(subscription.trial_end * 1000) : null
            ]
          );
          
          // Grant platform access
          await query(
            `INSERT INTO platform_access (user_id, platform, subscription_id, access_expires_at)
             SELECT $1, $2, id, $3
             FROM subscriptions WHERE stripe_subscription_id = $4
             ON CONFLICT (user_id, platform) DO UPDATE SET
               is_active = true,
               access_expires_at = EXCLUDED.access_expires_at`,
            [
              user.id,
              session.metadata?.platform || 'Unknown',
              new Date(subscription.current_period_end * 1000),
              session.subscription
            ]
          );
          
          console.log('Access granted successfully');
          
          // Send subscription confirmation email
          try {
            const { sendEmail } = require('./utils/emailService');
            const { subscriptionConfirmationEmail } = require('../src/utils/emailTemplates');
            
            // Get user language preference
            const userLangResult = await query(
              'SELECT first_name, language FROM users WHERE id = $1',
              [user.id]
            );
            const userLanguage = userLangResult.rows[0]?.language || 'en';
            const platform = session.metadata?.platform || 'Unknown';
            const planName = subscription.items.data[0].price.nickname || 'Premium';
            
            // Define features based on platform
            const features = {
              en: [
                'Unlimited assessments and health monitoring',
                'Advanced AI-powered risk analysis',
                'Personalized health recommendations',
                'Priority customer support',
                'Export reports and share with healthcare providers'
              ],
              es: [
                'Evaluaciones ilimitadas y monitoreo de salud',
                'Análisis de riesgo avanzado con IA',
                'Recomendaciones de salud personalizadas',
                'Soporte al cliente prioritario',
                'Exportar informes y compartir con proveedores de atención médica'
              ]
            };
            
            const emailTemplate = subscriptionConfirmationEmail[userLanguage] || subscriptionConfirmationEmail.en;
            const emailHtml = typeof emailTemplate.html === 'function'
              ? emailTemplate.html(planName, features[userLanguage] || features.en)
              : emailTemplate.html;
            
            await sendEmail({
              to: session.customer_email,
              subject: emailTemplate.subject.replace('{plan}', planName),
              html: emailHtml
            });
            
            console.log(`Subscription confirmation email sent to ${session.customer_email} in ${userLanguage}`);
          } catch (emailError) {
            console.error('Failed to send subscription confirmation email:', emailError);
            // Don't fail webhook if email fails
          }
          
          // Send subscription activation SMS
          try {
            const { sendSMSToUser } = require('./utils/smsHelper');
            await sendSMSToUser(user.id, 'subscriptionActivated', [planName]);
            console.log(`Subscription activation SMS sent to user ${user.id}`);
          } catch (smsError) {
            console.error('Failed to send subscription activation SMS:', smsError);
            // Don't fail webhook if SMS fails
          }
        } catch (error) {
          console.error('Error granting access:', error);
        }
        
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        
        console.log('Subscription cancelled:', {
          subscriptionId: subscription.id,
          customerId: subscription.customer,
          status: subscription.status,
        });

        // Revoke access to platform
        const { query } = require('./utils/db');
        
        try {
          // Update subscription status
          await query(
            `UPDATE subscriptions
             SET status = 'canceled'
             WHERE stripe_subscription_id = $1`,
            [subscription.id]
          );
          
          // Revoke platform access
          await query(
            `UPDATE platform_access
             SET is_active = false
             WHERE subscription_id IN (
               SELECT id FROM subscriptions WHERE stripe_subscription_id = $1
             )`,
            [subscription.id]
          );
          
          console.log('Access revoked successfully');
        } catch (error) {
          console.error('Error revoking access:', error);
        }
        
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

        // Update subscription status
        const { query: queryUpdate } = require('./utils/db');
        
        try {
          // Update subscription details
          await queryUpdate(
            `UPDATE subscriptions
             SET status = $1,
                 current_period_start = $2,
                 current_period_end = $3,
                 cancel_at_period_end = $4
             WHERE stripe_subscription_id = $5`,
            [
              subscription.status,
              new Date(subscription.current_period_start * 1000),
              new Date(subscription.current_period_end * 1000),
              subscription.cancel_at_period_end,
              subscription.id
            ]
          );
          
          // Update platform access based on status
          if (subscription.status === 'active' || subscription.status === 'trialing') {
            await queryUpdate(
              `UPDATE platform_access
               SET is_active = true,
                   access_expires_at = $1
               WHERE subscription_id IN (
                 SELECT id FROM subscriptions WHERE stripe_subscription_id = $2
               )`,
              [
                new Date(subscription.current_period_end * 1000),
                subscription.id
              ]
            );
          } else if (subscription.status === 'past_due' || subscription.status === 'unpaid') {
            // Temporarily revoke access for past_due subscriptions
            await queryUpdate(
              `UPDATE platform_access
               SET is_active = false
               WHERE subscription_id IN (
                 SELECT id FROM subscriptions WHERE stripe_subscription_id = $1
               )`,
              [subscription.id]
            );
          }
          
          console.log('Subscription updated successfully');
        } catch (error) {
          console.error('Error updating subscription:', error);
        }
        
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

