# Stripe Integration Setup Instructions

## ✅ What's Already Done

1. **Stripe Products Created** (Test Mode):
   - RxGuard™ Subscription: $39/month with 14-day free trial
   - EndoGuard™ Subscription: $97/month with 30-day free trial

2. **Code Updated**:
   - SubscriptionGate component wraps both RxGuard and EndoGuard dashboards
   - Payment checkout flow configured
   - Trial periods set (14 days for RxGuard, 30 days for EndoGuard)

## 🔧 What You Need to Do

### Add Environment Variables in Manus Settings

1. **Open Manus Settings:**
   - Click the gear icon (⚙️) in the Management UI panel (right side)
   - Click "Secrets" in the left sidebar

2. **Add These 4 Secrets:**

   Click "Add Secret" button for each one:

   **Secret 1:**
   - Name: `STRIPE_SECRET_KEY`
   - Value: `sk_test_51SLg6qFPe0gPk8JcMuwMOwAjlKp4c5lEAG6DHs12bAptqjVe6MMnxxvuiC0QqukNcfXgWvpjPta4gRrlni2vV0tM00nOrxXrxZ`

   **Secret 2:**
   - Name: `VITE_STRIPE_PUBLISHABLE_KEY`
   - Value: `pk_test_51SLg6qFPe0gPk8Jcx5luQ4SvRxDSyImz4etezel3TPV6na6B19Ku6R98JguZxlFwWcA8sPF5PGBZlLbWwt2LcMDp00Qk9MzwUh`

   **Secret 3:**
   - Name: `STRIPE_RXGUARD_PRICE_ID`
   - Value: `price_1SVnjMFPe0gPk8JcvuGrTrHR`

   **Secret 4:**
   - Name: `STRIPE_ENDOGUARD_PRICE_ID`
   - Value: `price_1SVnjMFPe0gPk8JccBFn3Tlc`

3. **Save and Restart:**
   - After adding all 4 secrets, the dev server should automatically restart
   - If not, manually restart the server

## 🧪 Testing the Payment Flow

### Test Card Numbers (Stripe Test Mode)

Use these test cards to simulate payments:

- **Successful Payment:** `4242 4242 4242 4242`
- **Declined Payment:** `4000 0000 0000 0002`
- **Requires Authentication:** `4000 0025 0000 3155`

**For all test cards:**
- Expiration: Any future date (e.g., 12/25)
- CVC: Any 3 digits (e.g., 123)
- ZIP: Any 5 digits (e.g., 12345)

### Test Flow

1. **Sign up** for a new account at your website
2. Navigate to **RxGuard Dashboard** or **EndoGuard Assessment**
3. You should see the **SubscriptionGate** payment screen
4. Click "Start 14-Day Free Trial" (RxGuard) or "Start 30-Day Free Trial" (EndoGuard)
5. You'll be redirected to **Stripe Checkout**
6. Enter test card `4242 4242 4242 4242`
7. Complete checkout
8. You should be redirected back to the platform dashboard

## 📊 Monitoring Subscriptions

### Stripe Dashboard

View all test subscriptions at:
https://dashboard.stripe.com/test/subscriptions

### What You'll See

- Customer email
- Subscription status (trialing, active, canceled)
- Trial end date
- Next billing date
- Platform metadata (rxguard or endoguard)

## 🚀 Going Live (When Ready)

### Switch to Live Mode

1. **Get Live API Keys:**
   - Go to https://dashboard.stripe.com/apikeys
   - Toggle from "Test mode" to "Live mode"
   - Copy your live keys (start with `pk_live_` and `sk_live_`)

2. **Create Live Products:**
   - Run the setup script again with live keys
   - Or manually create products in Stripe Dashboard

3. **Update Environment Variables:**
   - Replace test keys with live keys
   - Update Price IDs to live versions

4. **Enable Payment Methods:**
   - Activate your Stripe account
   - Complete business verification
   - Enable desired payment methods (cards, Apple Pay, Google Pay)

## ⚠️ Important Notes

- **Test Mode:** No real money is charged. Use test cards only.
- **Trial Periods:** Users won't be charged until trial ends (14 or 30 days)
- **Webhooks:** You'll need to set up Stripe webhooks for production to handle subscription events
- **Cancellations:** Users can cancel anytime from their Stripe customer portal

## 🔗 Useful Links

- **Stripe Dashboard:** https://dashboard.stripe.com
- **Test Cards:** https://stripe.com/docs/testing
- **API Documentation:** https://stripe.com/docs/api
- **Webhooks Guide:** https://stripe.com/docs/webhooks

## ✅ Checklist

- [ ] Add all 4 environment variables in Manus Settings → Secrets
- [ ] Restart dev server
- [ ] Test RxGuard payment flow
- [ ] Test EndoGuard payment flow
- [ ] Verify trial periods show correctly (14 days vs 30 days)
- [ ] Check Stripe Dashboard for test subscriptions
- [ ] Test cancellation flow
- [ ] Deploy to production
- [ ] Switch to live mode when ready to accept real payments
