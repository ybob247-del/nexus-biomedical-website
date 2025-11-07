# Stripe Security Setup - Vercel Configuration

## ✅ COMPLETED
- [x] Created Stripe webhook endpoint
- [x] Created API routes for secure checkout
- [x] Updated frontend code
- [x] Configured vercel.json

## 🔧 NEXT STEP: Add Secrets to Vercel

You need to add the Stripe API keys to your Vercel project so they're available in production.

### **Step 1: Go to Vercel Dashboard**

1. Go to https://vercel.com/dashboard
2. Click on your **"nexus-biomedical-website"** project
3. Click on **"Settings"** tab (top navigation)
4. Click on **"Environment Variables"** in the left sidebar

### **Step 2: Add STRIPE_SECRET_KEY**

1. Click **"Add New"** button
2. **Name:** `STRIPE_SECRET_KEY`
3. **Value:** `sk_test_51SLg6qFPe0gPk8JcMuwMOwAjlKp4c5lEAG6DHs12bAptqjVe6MMnxxvuiC0QqukNcfXgWvpjPta4gRrlni2vV0tM00nOrxXrxZ`
4. **Environments:** Check all three (Production, Preview, Development)
5. Click **"Save"**

### **Step 3: Add STRIPE_WEBHOOK_SECRET**

1. Click **"Add New"** button again
2. **Name:** `STRIPE_WEBHOOK_SECRET`
3. **Value:** `whsec_2fndxAqzPjD7We3SZHwjicJoKYdJ4k2y`
4. **Environments:** Check all three (Production, Preview, Development)
5. Click **"Save"**

### **Step 4: Add FRONTEND_URL**

1. Click **"Add New"** button again
2. **Name:** `FRONTEND_URL`
3. **Value:** `https://nexusbiomedical.ai`
4. **Environments:** Check all three (Production, Preview, Development)
5. Click **"Save"**

### **Step 5: Redeploy**

After adding the environment variables:
1. Go back to the **"Deployments"** tab
2. Click on the latest deployment
3. Click the **"..."** menu (three dots)
4. Click **"Redeploy"**
5. Wait for the deployment to complete

---

## 🧪 TESTING

After redeployment, test the secure checkout:

1. Go to https://nexusbiomedical.ai
2. Click on any "Start Free Trial" or pricing button
3. You should be prompted for your email
4. After entering email, you'll be redirected to Stripe checkout
5. The checkout session will be tied to your email (cannot be shared)

**Test card numbers:**
- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`
- Requires authentication: `4000 0025 0000 3155`

Use any future expiration date, any 3-digit CVC, and any ZIP code.

---

## 🔒 SECURITY FEATURES IMPLEMENTED

✅ **User-specific checkout sessions** - Tied to email address  
✅ **One-time use** - Sessions expire after 24 hours or after payment  
✅ **Cannot be shared** - Friend's email won't match the session  
✅ **Webhook verification** - Ensures payment completed before granting access  
✅ **Secure API endpoints** - Backend-powered, not client-side  

---

## 📝 NOTES

- Currently using **TEST mode** keys (sk_test_...)
- No real payments will be processed
- Switch to LIVE keys when ready for production
- Webhook is already configured in Stripe dashboard

---

## ❓ TROUBLESHOOTING

**If checkout doesn't work:**
1. Check Vercel logs: https://vercel.com/dashboard → Your Project → "Logs" tab
2. Check Stripe webhook logs: https://dashboard.stripe.com/test/webhooks
3. Verify environment variables are set correctly in Vercel
4. Make sure you redeployed after adding environment variables

**If webhook fails:**
1. Go to Stripe Dashboard → Developers → Webhooks
2. Click on your webhook endpoint
3. Check "Event deliveries" tab for errors
4. Verify the endpoint URL is correct: `https://nexusbiomedical.ai/api/stripe-webhook`

---

## 🚀 READY TO DEPLOY

Once you've added the environment variables to Vercel and redeployed, your Stripe security will be fully implemented!


