# Stripe Test Sandbox Setup Guide

**Document Version:** 1.0  
**Date:** November 22, 2025  
**Author:** Manus AI  
**Purpose:** Quick guide for claiming and configuring Stripe test sandbox for payment testing

---

## What is the Stripe Test Sandbox?

The Stripe test sandbox is a fully isolated testing environment that allows you to simulate payment processing without handling real money or real credit cards. This sandbox was automatically created when your Nexus Biomedical Intelligence platform was initialized with Stripe integration. It provides all the functionality of a live Stripe account but operates in test mode, making it safe to experiment with subscriptions, payments, and customer management.

**Key Benefits:**
- Test payment flows without risk of charging real customers
- Simulate successful payments, failed payments, and various card scenarios
- Verify webhook integrations and subscription lifecycle events
- Practice using the Stripe Dashboard before going live

**Expiration Notice:** Your sandbox claim link expires on **January 21, 2026**. You must claim it before this date, or you'll need to create a new Stripe account manually.

---

## Step 1: Claim Your Stripe Test Sandbox

Navigate to the following URL in your web browser to claim your pre-configured test sandbox:

**Claim Link:** https://dashboard.stripe.com/claim_sandbox/YWNjdF8xU1ZrWnFESFFzdU5LS2k0LDE3NjQzODQ3NDMv100W30VLpsw

This link is unique to your Nexus Biomedical Intelligence project and contains the sandbox account credentials. When you click the link, you'll be directed to the Stripe website.

### What to Expect

**If you don't have a Stripe account:** You'll be prompted to create a new Stripe account. Fill in your email address, create a password, and complete the registration form. Stripe will ask for basic business information (business name, country, industry). Use "Nexus Biomedical Intelligence" as your business name and select "Healthcare" or "SaaS" as your industry.

**If you already have a Stripe account:** You'll be asked to log in with your existing credentials. After logging in, Stripe will add the test sandbox to your account as a new "test mode" environment. You can switch between live mode and test mode using the toggle in the Stripe Dashboard.

### Account Verification

Stripe may ask you to verify your email address by clicking a confirmation link sent to your inbox. Complete this step to gain full access to the dashboard. You do NOT need to provide bank account information or complete identity verification for test mode. These requirements only apply when you're ready to accept real payments in live mode.

---

## Step 2: Understand Test Mode vs. Live Mode

The Stripe Dashboard has two modes that you can toggle between using a switch in the top-right corner.

### Test Mode (Default)

Test mode is where you'll conduct all payment testing for the beta program and owner testing. In test mode, you use special test card numbers (like `4242 4242 4242 4242`) instead of real credit cards. No real money changes hands, and no real customers are charged. All transactions, subscriptions, and customer data in test mode are completely separate from live mode.

**When to use Test Mode:**
- During owner testing (tomorrow's testing session)
- During the beta program with test participants
- When developing new features or testing integrations
- Anytime you want to experiment without risk

### Live Mode

Live mode is for real customers and real payments. You should NOT enable live mode until you've completed all testing, obtained legal review of your Privacy Policy and Terms of Service, and are ready to accept paying customers. Enabling live mode requires additional verification steps including providing bank account details for payouts and completing Stripe's identity verification process.

**When to use Live Mode:**
- After beta program completion and all testing is verified
- When launching publicly and accepting real customers
- Only after legal compliance is confirmed

**Important:** For tomorrow's owner testing, you will ONLY use test mode. Do not attempt to enable live mode yet.

---

## Step 3: Verify Pre-Configured Products and Prices

Your Nexus Biomedical Intelligence platform has been pre-configured with Stripe products and prices for RxGuard and EndoGuard subscriptions. Let's verify these are set up correctly.

### Access the Products Page

After claiming your sandbox and logging into the Stripe Dashboard, navigate to the **Products** section in the left sidebar. You should see two products listed:

**RxGuard Subscription**
- **Price:** $49.00 USD / month
- **Billing Interval:** Monthly recurring
- **Description:** AI-powered medication interaction checker for healthcare professionals

**EndoGuard Subscription**
- **Price:** $39.00 USD / month
- **Billing Interval:** Monthly recurring
- **Description:** Hormone disruption risk assessment platform

### Verify Price IDs

Click on each product to view its details. You'll see a **Price ID** that starts with `price_`. These IDs are already configured in your platform's environment variables (`STRIPE_RXGUARD_PRICE_ID` and `STRIPE_ENDOGUARD_PRICE_ID`). Verify that the Price IDs in the Stripe Dashboard match the ones in your environment variables.

If the Price IDs don't match or the products are missing, you may need to create them manually (see Troubleshooting section below).

---

## Step 4: Test a Payment Using Test Cards

Stripe provides special test card numbers that simulate different payment scenarios. Use these during owner testing to verify the payment flow works correctly.

### Successful Payment Test Card

**Card Number:** 4242 4242 4242 4242  
**Expiration Date:** Any future date (e.g., 12/25)  
**CVC:** Any 3 digits (e.g., 123)  
**ZIP Code:** Any 5 digits (e.g., 12345)

This card will always succeed and create a successful payment. Use it to test the happy path where a user subscribes to RxGuard or EndoGuard after their trial expires.

### Failed Payment Test Card

**Card Number:** 4000 0000 0000 0002  
**Expiration Date:** Any future date  
**CVC:** Any 3 digits  
**ZIP Code:** Any 5 digits

This card will always be declined with a generic decline message. Use it to test how your platform handles failed payments (e.g., showing an error message, prompting the user to try a different card).

### Additional Test Scenarios

Stripe provides test cards for many scenarios including insufficient funds, expired cards, incorrect CVC, and more. You can find the complete list in the Stripe documentation at https://stripe.com/docs/testing#cards.

### Testing the Subscription Flow

To test the complete subscription flow during owner testing:

1. Log into your Nexus platform with a test account
2. Manually expire your RxGuard trial by updating the database (set `trial_end_date` to yesterday)
3. Navigate to `/rxguard-dashboard` and verify the TrialGate blocks access
4. Click "Subscribe Now" or "View Pricing" to be redirected to Stripe Checkout
5. Enter the test card number `4242 4242 4242 4242` with any future expiration and CVC
6. Complete the checkout and verify you're redirected back to the platform
7. Check the database `subscriptions` table to confirm a new subscription was created with `status = 'active'`
8. Verify you now have access to RxGuard without the trial gate

---

## Step 5: Explore the Stripe Dashboard

The Stripe Dashboard provides powerful tools for managing payments, customers, and subscriptions. Familiarize yourself with these key sections.

### Payments

The **Payments** section shows all transactions processed through your account. In test mode, you'll see test payments made during owner testing and beta program. Each payment displays the amount, customer, payment method, and status (succeeded, failed, refunded).

Click on any payment to view detailed information including the customer's email, billing address, and a timeline of events (payment created, payment succeeded, invoice sent, etc.).

### Customers

The **Customers** section lists all customers who have made payments or subscriptions. Each customer record includes their email, payment methods on file, subscription status, and lifetime value. You can manually create customers, update their information, or delete them from this section.

During testing, you'll see test customers created when you complete Stripe Checkout. These customers are separate from the user accounts in your Nexus database but are linked by email address.

### Subscriptions

The **Subscriptions** section shows all active, past due, canceled, and trial subscriptions. You can view subscription details, change billing intervals, update prices, or cancel subscriptions manually. This is useful for testing subscription lifecycle events and verifying your platform handles them correctly.

### Webhooks

The **Webhooks** section allows you to configure webhook endpoints that receive real-time notifications when events occur (e.g., payment succeeded, subscription canceled, invoice paid). Your Nexus platform has a webhook endpoint at `/api/stripe/webhook` that handles these events.

Verify the webhook endpoint is configured correctly by checking the **Endpoints** tab. You should see an endpoint URL pointing to your platform (e.g., `https://yourdomain.manus.space/api/stripe/webhook`). If it's missing, you'll need to add it manually (see Troubleshooting section).

### Logs

The **Logs** section shows a real-time stream of all API requests made to Stripe from your platform. This is invaluable for debugging payment issues. If a payment fails or a subscription doesn't create correctly, check the logs to see the exact API request and response.

---

## Step 6: Configure Webhook Endpoint (If Missing)

Webhooks allow Stripe to notify your platform when important events occur, such as when a subscription is canceled or a payment fails. Your platform needs to receive these notifications to keep subscription statuses synchronized.

### Check Existing Webhooks

Navigate to **Developers → Webhooks** in the Stripe Dashboard. If you see an endpoint URL pointing to your platform (e.g., `https://yourdomain.manus.space/api/stripe/webhook`), webhooks are already configured and you can skip this section.

If no webhook endpoint exists, follow these steps to create one.

### Create Webhook Endpoint

1. Click **Add endpoint** in the Webhooks section
2. Enter your webhook URL: `https://yourdomain.manus.space/api/stripe/webhook` (replace `yourdomain` with your actual domain)
3. Click **Select events** and choose the following events to listen for:
   - `checkout.session.completed` (when a customer completes checkout)
   - `customer.subscription.created` (when a subscription is created)
   - `customer.subscription.updated` (when a subscription is modified)
   - `customer.subscription.deleted` (when a subscription is canceled)
   - `invoice.payment_succeeded` (when an invoice is paid)
   - `invoice.payment_failed` (when a payment fails)
4. Click **Add endpoint** to save

### Copy Webhook Signing Secret

After creating the endpoint, Stripe will display a **Signing secret** (starts with `whsec_`). This secret is used to verify that webhook requests actually come from Stripe and haven't been tampered with.

Copy the signing secret and update your environment variable `STRIPE_WEBHOOK_SECRET` with this value. This is already configured in your platform, but if you create a new webhook endpoint, you'll need to update it.

---

## Step 7: Test Webhook Delivery

Stripe provides a tool for testing webhook delivery without making real payments.

### Send Test Webhook

1. Navigate to **Developers → Webhooks** and click on your webhook endpoint
2. Click the **Send test webhook** button
3. Select an event type (e.g., `checkout.session.completed`)
4. Click **Send test webhook**

Stripe will send a test event to your platform's webhook endpoint. Check your server logs to verify the webhook was received and processed correctly. If the webhook fails, check the **Logs** section in the Stripe Dashboard for error details.

### Common Webhook Issues

**Webhook returns 401 Unauthorized:** The webhook signing secret may be incorrect. Verify `STRIPE_WEBHOOK_SECRET` matches the secret shown in the Stripe Dashboard.

**Webhook returns 500 Internal Server Error:** There's a bug in your webhook handler code. Check server logs for the specific error and debug the `/api/stripe/webhook` endpoint.

**Webhook times out:** The webhook handler is taking too long to respond (Stripe expects a response within 30 seconds). Optimize the webhook code to respond quickly, then process the event asynchronously.

---

## Step 8: Understanding Subscription Lifecycle

Subscriptions in Stripe go through several states during their lifecycle. Understanding these states helps you test the complete user journey.

### Subscription States

**Active:** The subscription is currently active and the customer has access to the platform. Invoices are generated and charged automatically according to the billing interval (monthly).

**Trialing:** The subscription is in a trial period. No charges are made during the trial. When the trial ends, Stripe automatically attempts to charge the customer and transitions the subscription to Active (if payment succeeds) or Past Due (if payment fails).

**Past Due:** A payment failed and Stripe is retrying. The customer may still have access depending on your platform's configuration. After several retry attempts, the subscription may be canceled automatically.

**Canceled:** The subscription has been canceled and the customer no longer has access. No future invoices will be generated.

**Incomplete:** The initial payment failed when creating the subscription. The subscription exists but is not active. Stripe will retry the payment according to your retry settings.

### Testing Subscription Lifecycle

During owner testing, simulate the subscription lifecycle by:

1. Creating a subscription with the successful test card (transitions to Active)
2. Canceling the subscription through the Stripe Customer Portal (transitions to Canceled)
3. Creating a subscription with the failed test card (transitions to Incomplete or Past Due)
4. Manually updating subscription status in the Stripe Dashboard to test different states

---

## Step 9: Customer Portal Configuration

The Stripe Customer Portal allows your customers to manage their own subscriptions without contacting support. They can view invoices, update payment methods, and cancel subscriptions.

### Enable Customer Portal

Navigate to **Settings → Customer Portal** in the Stripe Dashboard. Ensure the Customer Portal is enabled and configure the following settings:

**Allowed Actions:**
- ✅ Update payment method
- ✅ View invoice history
- ✅ Cancel subscription

**Cancellation Settings:**
- Choose whether cancellations take effect immediately or at the end of the billing period
- Optionally require a cancellation reason
- Configure a cancellation retention offer (e.g., "Get 25% off if you stay")

**Branding:**
- Upload your Nexus Biomedical Intelligence logo
- Customize the color scheme to match your platform's branding
- Add a custom headline (e.g., "Manage Your Subscription")

### Test Customer Portal

During owner testing, access the Customer Portal by clicking the "Manage Subscription" button in your platform (if implemented) or by navigating directly to the portal URL provided by Stripe. Verify you can view invoices, update payment methods, and cancel subscriptions.

---

## Step 10: Monitoring and Alerts

Set up monitoring to be notified of important events in your Stripe account.

### Email Notifications

Navigate to **Settings → Email notifications** and configure which events trigger email alerts. Recommended notifications include:

- Failed payments (so you can follow up with customers)
- Successful refunds (to track revenue impact)
- Disputes opened (to respond quickly and avoid chargebacks)
- Subscription cancellations (to understand churn)

### Radar for Fraud Detection

Stripe Radar is a built-in fraud detection system that blocks suspicious payments automatically. In test mode, Radar is always enabled but doesn't block test card transactions. In live mode, Radar will protect you from fraudulent payments.

Review the **Radar** section in the Stripe Dashboard to understand how fraud detection works and customize rules if needed (e.g., block payments from certain countries, require 3D Secure authentication for high-value transactions).

---

## Troubleshooting Common Issues

### Issue: Products or Prices Missing in Dashboard

**Solution:** If RxGuard or EndoGuard products don't appear in the Stripe Dashboard, you'll need to create them manually.

1. Navigate to **Products** and click **Add product**
2. Enter product name (e.g., "RxGuard Subscription")
3. Set price to $49.00 USD and billing interval to Monthly
4. Click **Save product**
5. Copy the Price ID (starts with `price_`) and update the environment variable `STRIPE_RXGUARD_PRICE_ID`
6. Repeat for EndoGuard ($39.00 USD monthly)

### Issue: Checkout Redirects to Error Page

**Solution:** Verify the following:
- `STRIPE_PUBLISHABLE_KEY` and `STRIPE_SECRET_KEY` are set correctly in environment variables
- Price IDs (`STRIPE_RXGUARD_PRICE_ID`, `STRIPE_ENDOGUARD_PRICE_ID`) match the Stripe Dashboard
- You're using test mode keys (start with `pk_test_` and `sk_test_`)
- The Stripe Checkout session is being created correctly (check server logs)

### Issue: Webhook Endpoint Not Receiving Events

**Solution:** Verify the following:
- Webhook endpoint URL is correct and accessible from the internet
- `STRIPE_WEBHOOK_SECRET` matches the signing secret in the Stripe Dashboard
- Your server is responding with a 200 status code within 30 seconds
- Firewall or security settings aren't blocking Stripe's webhook requests

### Issue: Subscription Not Created in Database

**Solution:** Check the webhook handler code in `/api/stripe/webhook` to ensure it's correctly processing `checkout.session.completed` events and creating subscription records in the database. Review server logs for errors during webhook processing.

---

## Security Best Practices

Protecting your Stripe credentials and customer data is critical.

### Never Expose Secret Keys

Your Stripe secret key (`sk_test_...` or `sk_live_...`) should NEVER be exposed in client-side code, committed to version control, or shared publicly. Always store it in environment variables and access it only from server-side code.

### Verify Webhook Signatures

Always verify webhook signatures using the `STRIPE_WEBHOOK_SECRET` to ensure requests actually come from Stripe. The webhook handler code in your platform already implements this verification.

### Use HTTPS

Stripe requires all webhook endpoints to use HTTPS (not HTTP). Your Nexus platform is already configured with HTTPS via the Manus deployment platform.

### Limit API Key Permissions

When you eventually create live mode API keys, consider using restricted keys that only have permissions for the specific operations your platform needs (e.g., creating subscriptions, processing payments). This limits damage if a key is compromised.

---

## Next Steps After Claiming Sandbox

Once you've claimed your Stripe test sandbox and verified the configuration, you're ready to test the payment flow during owner testing.

**Tomorrow's Testing:**
1. Complete Phase 5 of the Owner Testing Plan (Trial Expiration & Payment Flow)
2. Use test card `4242 4242 4242 4242` to simulate successful subscriptions
3. Verify subscriptions are created in both Stripe Dashboard and your database
4. Test the Stripe Customer Portal for subscription management
5. Document any issues or unexpected behaviors

**Before Going Live:**
1. Complete all owner testing and beta program testing
2. Obtain legal review of Privacy Policy and Terms of Service
3. Enable live mode in Stripe and complete identity verification
4. Replace test mode API keys with live mode keys in environment variables
5. Test one final transaction in live mode with a real card (then refund it)
6. Monitor the first few live transactions closely to ensure everything works correctly

---

## Conclusion

Your Stripe test sandbox is now ready for payment testing. By claiming the sandbox before the January 21, 2026 deadline, you've secured a fully configured testing environment for RxGuard and EndoGuard subscriptions. Use this sandbox extensively during owner testing and the beta program to ensure the payment flow is smooth, reliable, and ready for real customers.

**Remember:** Always use test mode for development and testing. Only enable live mode when you're ready to accept real payments from real customers.

---

**Document End**
