# Vercel Environment Variables Setup Instructions

## 🎯 Goal
Import all required environment variables to Vercel so your website works on any domain (Vercel's or custom).

---

## 📋 Step-by-Step Instructions

### Step 1: Get Your OpenAI API Key

1. Go to: https://platform.openai.com/api-keys
2. Find the key named **"Nexus Biomedical - Production"** (shows `sk-...IQN`)
3. Click the **edit/view icon** (pencil)
4. Click to **reveal the full key**
5. **Copy the entire key** (starts with `sk-proj-...`)

---

### Step 2: Edit the Environment File

1. Open the file: `VERCEL_ENV_IMPORT.env` (in your project folder)
2. Find this line:
   ```
   OPENAI_API_KEY=YOUR_OPENAI_API_KEY_HERE
   ```
3. Replace `YOUR_OPENAI_API_KEY_HERE` with your actual OpenAI key
4. Save the file

**Example:**
```
OPENAI_API_KEY=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
```

---

### Step 3: Import to Vercel

1. Go to: https://vercel.com/ybob247-gmailcoms-projects/nexus-biomedical-website/settings/environment-variables

2. Click the **"Import .env"** button (top right area)

3. Upload the `VERCEL_ENV_IMPORT.env` file

4. **Important:** Select **"All Environments"**:
   - ✅ Production
   - ✅ Preview
   - ✅ Development

5. Click **"Import"**

6. You should see all variables added (about 25+ variables)

---

### Step 4: Verify Import

After import, scroll down and verify these critical variables are present:

- ✅ `OPENAI_API_KEY` - Starts with `sk-proj-...`
- ✅ `STRIPE_SECRET_KEY` - Starts with `sk_test_...`
- ✅ `TWILIO_AUTH_TOKEN`
- ✅ `RESEND_API_KEY`
- ✅ `JWT_SECRET`
- ✅ All `VITE_*` variables (for frontend)

---

### Step 5: Trigger New Deployment

After importing environment variables:

1. Go to: https://vercel.com/ybob247-gmailcoms-projects/nexus-biomedical-website/deployments

2. Click the **"..."** menu on the latest deployment

3. Click **"Redeploy"**

4. Select **"Use existing Build Cache"** (faster)

5. Click **"Redeploy"**

---

## ✅ Success Criteria

After redeployment, your website should have:

- ✅ AI Chatbot working (powered by OpenAI)
- ✅ Stripe payments working
- ✅ SMS notifications working (Twilio)
- ✅ Email notifications working (Resend)
- ✅ All features work on **any domain** (Vercel or custom)

---

## 🆘 Troubleshooting

### If AI Chatbot Still Doesn't Work:

1. Check OpenAI billing: https://platform.openai.com/settings/organization/billing/overview
2. Verify you have credits ($99.93 as of Dec 7, 2025)
3. Check the API key is correct in Vercel environment variables

### If Deployment Fails:

1. Check deployment logs in Vercel
2. Look for missing environment variable errors
3. Verify all variables were imported correctly

---

## 📞 Need Help?

If you encounter issues, let me know and I can help troubleshoot!
