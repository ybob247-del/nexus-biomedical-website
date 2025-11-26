# Stripe Webhook Setup Guide

**Last Updated:** November 26, 2025  
**Platform:** Nexus Biomedical Intelligence  
**Purpose:** Configure Stripe webhooks to sync subscription status with your database

---

## Overview

Stripe webhooks notify your application when subscription events occur (payments, cancellations, etc.). This guide shows you how to configure the webhook endpoint using the current Stripe Dashboard interface.

---

## Prerequisites

✅ Stripe account created and logged in  
✅ Test mode enabled (for testing) or Live mode (for production)  
✅ Your production domain: `https://www.nexusbiomedical.ai`  
✅ Webhook endpoint already built: `/api/stripe/webhook`

---

## Step-by-Step Setup

### Step 1: Navigate to Webhooks Section

1. Log in to [Stripe Dashboard](https://dashboard.stripe.com)
2. Click **Developers** in the left sidebar (bottom of menu)
3. Click **Webhooks** tab at the top
4. Click **+ Add endpoint** button (top right)

### Step 2: Configure Endpoint URL

In the "Create an event destination" dialog:

1. **Endpoint URL:** Enter your webhook endpoint
   ```
   https://www.nexusbiomedical.ai/api/stripe/webhook
   ```

2. Click **Continue** button

### Step 3: Select Events to Listen To

You'll see the "Select events" screen with expandable categories. Select the following events:

#### **Subscription Schedule Events** (Expand this section)

Select these 7 events:

- ✅ `subscription_schedule.aborted` - Subscription schedule canceled due to delinquency
- ✅ `subscription_schedule.canceled` - Subscription schedule canceled
- ✅ `subscription_schedule.completed` - New subscription schedule completed
- ✅ `subscription_schedule.created` - New subscription schedule created
- ✅ `subscription_schedule.expiring` - 7 days before subscription schedule expires
- ✅ `subscription_schedule.released` - New subscription schedule released
- ✅ `subscription_schedule.updated` - Subscription schedule updated

#### **Additional Required Events** (Other categories)

Also select these critical events from other categories:

**Checkout:**
- ✅ `checkout.session.completed` - Customer completed checkout (CRITICAL)

**Customer Subscription:**
- ✅ `customer.subscription.created` - Subscription created
- ✅ `customer.subscription.updated` - Subscription updated (plan changes, renewals)
- ✅ `customer.subscription.deleted` - Subscription canceled/expired

**Invoice:**
- ✅ `invoice.payment_succeeded` - Subscription payment successful
- ✅ `invoice.payment_failed` - Subscription payment failed

### Step 4: Complete Setup

1. After selecting all events, click **Continue** button (bottom right)
2. Review your selections
3. Click **Add endpoint** to finalize

### Step 5: Get Webhook Signing Secret

After creating the endpoint:

1. You'll see your new webhook endpoint listed
2. Click on the endpoint to view details
3. Find the **Signing secret** section
4. Click **Reveal** to show the secret
5. Copy the signing secret (starts with `whsec_...`)

### Step 6: Add Signing Secret to Environment Variables

**Option A: Via Vercel Dashboard** (Recommended)

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project: `nexus-biomedical-website`
3. Go to **Settings** → **Environment Variables**
4. Add new variable:
   - **Key:** `STRIPE_WEBHOOK_SECRET`
   - **Value:** `whsec_...` (paste your signing secret)
   - **Environments:** Select all (Production, Preview, Development)
5. Click **Save**
6. **Redeploy** your application for changes to take effect

**Option B: Via Manus Settings Panel**

1. In Manus UI, click **Settings** icon (top right)
2. Navigate to **Secrets** panel
3. Click **Add Secret**
4. Enter:
   - **Key:** `STRIPE_WEBHOOK_SECRET`
   - **Value:** `whsec_...` (paste your signing secret)
5. Click **Save**
6. Click **Publish** button to deploy with new secret

---

## Testing Your Webhook

### Test with Stripe CLI (Recommended)

1. Install Stripe CLI: https://stripe.com/docs/stripe-cli
2. Login to Stripe CLI:
   ```bash
   stripe login
   ```
3. Forward webhook events to your local server:
   ```bash
   stripe listen --forward-to localhost:3000/api/stripe/webhook
   ```
4. Trigger a test event:
   ```bash
   stripe trigger checkout.session.completed
   ```
5. Check your application logs to verify webhook received

### Test with Real Subscription (Test Mode)

1. Ensure Stripe is in **Test mode** (toggle in top right)
2. Create a test account on your site
3. Click "Start Free Trial" on RxGuard or EndoGuard
4. Use test card: `4242 4242 4242 4242`
5. Complete checkout
6. Check Stripe Dashboard → **Webhooks** → Click your endpoint → View **Recent deliveries**
7. Verify `checkout.session.completed` event was sent and succeeded (200 response)

---

## Verifying Webhook is Working

### Check Stripe Dashboard

1. Go to **Developers** → **Webhooks**
2. Click on your webhook endpoint
3. Scroll to **Recent deliveries** section
4. You should see events with:
   - ✅ Green checkmark = Success (200 response)
   - ❌ Red X = Failed (check error message)

### Check Your Database

After a successful test subscription:

1. Connect to your database
2. Query the `subscriptions` table:
   ```sql
   SELECT * FROM subscriptions ORDER BY created_at DESC LIMIT 5;
   ```
3. Verify new subscription record exists with:
   - `stripe_subscription_id` populated
   - `stripe_customer_id` populated
   - `status` = 'trialing' or 'active'
   - `current_period_end` set correctly

### Check Application Logs

In Vercel Dashboard:

1. Go to your project → **Deployments**
2. Click on latest deployment
3. Click **Functions** tab
4. Find `/api/stripe/webhook` function
5. View logs to see webhook events being processed

---

## Troubleshooting

### Webhook Returns 500 Error

**Cause:** Database connection issue or missing environment variables

**Fix:**
1. Verify `DATABASE_URL` is set correctly in Vercel
2. Verify `STRIPE_WEBHOOK_SECRET` is set
3. Check function logs for specific error message

### Webhook Returns 400 Error (Invalid Signature)

**Cause:** Wrong webhook signing secret

**Fix:**
1. Go to Stripe Dashboard → Webhooks → Your endpoint
2. Reveal and copy the signing secret again
3. Update `STRIPE_WEBHOOK_SECRET` in Vercel
4. Redeploy application

### Events Not Creating Subscriptions

**Cause:** Missing event types or webhook handler not processing correctly

**Fix:**
1. Verify all required events are selected (see Step 3)
2. Check `/api/stripe/webhook.mjs` code for event handling
3. Test with Stripe CLI to see detailed error messages

### Subscription Shows in Stripe but Not in Database

**Cause:** Webhook not configured or failing silently

**Fix:**
1. Check **Recent deliveries** in Stripe Dashboard
2. If no deliveries, webhook URL may be wrong
3. If deliveries failed, check error message and application logs

---

## Event Descriptions

Here's what each webhook event does:

| Event | Description | Action |
|-------|-------------|--------|
| `checkout.session.completed` | Customer completed checkout | Create subscription record, grant platform access |
| `customer.subscription.created` | New subscription created | Backup for checkout completion |
| `customer.subscription.updated` | Subscription changed | Update subscription status, period dates |
| `customer.subscription.deleted` | Subscription canceled | Revoke platform access, update status to 'canceled' |
| `invoice.payment_succeeded` | Renewal payment successful | Extend access period, update status to 'active' |
| `invoice.payment_failed` | Renewal payment failed | Update status to 'past_due', send payment reminder |
| `subscription_schedule.*` | Schedule events | Handle trial-to-paid transitions, schedule changes |

---

## Security Best Practices

### Always Verify Webhook Signatures

Your webhook handler should verify the signature:

```javascript
const sig = req.headers['stripe-signature'];
const event = stripe.webhooks.constructEvent(
  req.body,
  sig,
  process.env.STRIPE_WEBHOOK_SECRET
);
```

This prevents malicious requests from fake webhook calls.

### Use HTTPS Only

Webhook endpoint MUST use HTTPS (not HTTP). Stripe will reject HTTP endpoints.

### Keep Signing Secret Private

Never commit `STRIPE_WEBHOOK_SECRET` to Git. Always use environment variables.

---

## Going Live (Production Mode)

When ready to accept real payments:

1. **Switch to Live Mode** in Stripe Dashboard (toggle top right)
2. **Create new webhook endpoint** (repeat Steps 1-5 above)
   - Live mode and Test mode have separate webhook endpoints
3. **Get new signing secret** for live mode
4. **Update environment variable** `STRIPE_WEBHOOK_SECRET` with live secret
5. **Test with real card** (use your own card, then refund)
6. **Monitor webhook deliveries** closely for first few days

---

## Support

**Stripe Documentation:**
- [Webhooks Guide](https://stripe.com/docs/webhooks)
- [Webhook Events Reference](https://stripe.com/docs/api/events/types)
- [Testing Webhooks](https://stripe.com/docs/webhooks/test)

**Nexus Biomedical Support:**
- Email: support@nexusbiomedical.ai
- Documentation: `/docs` folder in project

---

## Summary Checklist

Before marking webhook setup as complete:

- [ ] Webhook endpoint created in Stripe Dashboard
- [ ] All 14 required events selected (7 subscription_schedule + 7 others)
- [ ] Signing secret copied and added to environment variables
- [ ] Application redeployed with new secret
- [ ] Test subscription completed successfully
- [ ] Webhook shows green checkmarks in Recent deliveries
- [ ] Subscription appears in database with correct data
- [ ] Platform access granted after successful checkout

Once all items are checked, your Stripe webhook integration is complete! 🎉
