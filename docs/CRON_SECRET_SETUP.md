# CRON_SECRET Environment Variable Setup Guide

## 🔐 What is CRON_SECRET?

`CRON_SECRET` is a security token used to authenticate requests to your Vercel Cron job endpoints. This prevents unauthorized users from triggering your scheduled tasks (like sending SMS campaigns).

---

## ⚠️ Why It's Required

Without `CRON_SECRET`, anyone who knows your cron endpoint URLs could:
- Trigger SMS campaigns manually
- Spam users with notifications
- Drain your Twilio account balance
- Cause database performance issues

**Security Best Practice:** Always protect cron endpoints with authentication.

---

## 🚀 Setup Instructions

### Step 1: Generate a Secure Secret

Use one of these methods to generate a cryptographically secure random string:

#### Option A: Using OpenSSL (Recommended)
```bash
openssl rand -base64 32
```

Example output:
```
Kx7vZ9mN2pQ4wR8tY6uI3oP5aS1dF0gH7jK9lM2nB4vC6xZ8
```

#### Option B: Using Node.js
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

#### Option C: Using Python
```bash
python3 -c "import secrets; print(secrets.token_urlsafe(32))"
```

#### Option D: Using Online Generator
Visit: https://www.random.org/strings/
- Generate 1 string
- Length: 32 characters
- Character set: Alphanumeric + special characters

**⚠️ Important:** Save this secret securely! You'll need it for both Vercel and testing.

---

### Step 2: Add to Vercel Environment Variables

#### Via Vercel Dashboard (Recommended)

1. Go to your project: https://vercel.com/dashboard
2. Click on your project (nexus-biomedical-website)
3. Go to **Settings** → **Environment Variables**
4. Click **Add New**
5. Fill in:
   - **Name:** `CRON_SECRET`
   - **Value:** Paste your generated secret
   - **Environments:** Select all three:
     - ✅ Production
     - ✅ Preview
     - ✅ Development
6. Click **Save**

#### Via Vercel CLI (Alternative)

```bash
# Install Vercel CLI if not already installed
npm i -g vercel

# Login to Vercel
vercel login

# Add the secret
vercel env add CRON_SECRET

# When prompted:
# - Paste your generated secret
# - Select: Production, Preview, Development (all three)
```

---

### Step 3: Add to Local Development (.env.local)

For local testing, add the secret to your `.env.local` file:

```bash
# Navigate to project directory
cd /home/ubuntu/nexus-biomedical-website

# Add CRON_SECRET to .env.local
echo "CRON_SECRET=your-generated-secret-here" >> .env.local
```

**Example `.env.local` entry:**
```env
CRON_SECRET=Kx7vZ9mN2pQ4wR8tY6uI3oP5aS1dF0gH7jK9lM2nB4vC6xZ8
```

---

### Step 4: Verify Configuration

#### Test Locally

```bash
# Start development server
pnpm dev

# In another terminal, test the cron endpoint
curl -X POST http://localhost:5173/api/cron/send-health-tips \
  -H "Authorization: Bearer YOUR_CRON_SECRET_HERE"

# Expected response:
# {"success": true, "message": "Health tips campaign completed", ...}
```

#### Test on Vercel (After Deployment)

```bash
# Test production endpoint
curl -X POST https://your-domain.vercel.app/api/cron/send-health-tips \
  -H "Authorization: Bearer YOUR_CRON_SECRET_HERE"

# Expected response:
# {"success": true, "message": "Health tips campaign completed", ...}
```

---

## 🔍 How It Works

### Cron Endpoint Protection

All cron endpoints check for the `CRON_SECRET` in the `Authorization` header:

```javascript
// api/cron/send-health-tips.js
export default async function handler(req, res) {
  // Verify CRON_SECRET
  const authHeader = req.headers.authorization;
  const token = authHeader?.replace('Bearer ', '');
  
  if (token !== process.env.CRON_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  // Continue with cron job logic...
}
```

### Vercel Cron Configuration

Vercel automatically includes the `CRON_SECRET` in the `Authorization` header when triggering scheduled cron jobs:

```json
// vercel.json
{
  "crons": [
    {
      "path": "/api/cron/send-health-tips",
      "schedule": "0 10 * * 1"
    }
  ]
}
```

Vercel sends:
```
POST /api/cron/send-health-tips
Authorization: Bearer YOUR_CRON_SECRET
```

---

## 🛡️ Security Best Practices

### Do's ✅
- ✅ Use a cryptographically secure random string (32+ characters)
- ✅ Store in Vercel environment variables (encrypted at rest)
- ✅ Add to all environments (Production, Preview, Development)
- ✅ Rotate the secret periodically (every 90 days)
- ✅ Use different secrets for different environments (optional)
- ✅ Keep the secret in password manager (1Password, LastPass, etc.)

### Don'ts ❌
- ❌ Don't commit to Git repository
- ❌ Don't share in Slack/email/public channels
- ❌ Don't use simple passwords like "password123"
- ❌ Don't reuse secrets from other projects
- ❌ Don't hardcode in source code
- ❌ Don't log the secret value

---

## 🔄 Rotating the Secret

If you need to rotate the `CRON_SECRET` (recommended every 90 days):

### Step 1: Generate New Secret
```bash
openssl rand -base64 32
```

### Step 2: Update Vercel
1. Go to Vercel Dashboard → Settings → Environment Variables
2. Find `CRON_SECRET`
3. Click **Edit**
4. Paste new secret
5. Click **Save**

### Step 3: Update Local .env.local
```bash
# Replace old secret with new one
nano .env.local
# Update CRON_SECRET value
```

### Step 4: Redeploy
```bash
# Trigger new deployment to apply changes
vercel --prod
```

### Step 5: Verify
```bash
# Test with new secret
curl -X POST https://your-domain.vercel.app/api/cron/send-health-tips \
  -H "Authorization: Bearer NEW_CRON_SECRET_HERE"
```

---

## 🐛 Troubleshooting

### Issue: "Unauthorized" Error

**Symptom:** Cron endpoint returns `401 Unauthorized`

**Possible Causes:**
1. `CRON_SECRET` not set in Vercel
2. Wrong secret value in request
3. Typo in environment variable name
4. Secret not deployed to correct environment

**Solutions:**
1. Verify secret exists in Vercel Dashboard
2. Check secret value matches exactly (no extra spaces)
3. Ensure variable name is exactly `CRON_SECRET`
4. Redeploy to apply environment variable changes

### Issue: Cron Jobs Not Running

**Symptom:** Scheduled cron jobs don't execute

**Possible Causes:**
1. Vercel cron not configured in `vercel.json`
2. Wrong cron schedule syntax
3. Function timeout too short
4. Database connection issues

**Solutions:**
1. Verify `vercel.json` has correct cron configuration
2. Test cron schedule syntax: https://crontab.guru/
3. Increase function timeout in `vercel.json`
4. Check Vercel function logs for errors

### Issue: "Request Timeout" Error

**Symptom:** Cron endpoint times out after 25 seconds

**Possible Causes:**
1. Too many SMS to send in one batch
2. Database query too slow
3. Twilio API rate limiting
4. Network connectivity issues

**Solutions:**
1. Batch SMS sends (e.g., 100 at a time)
2. Optimize database queries with indexes
3. Add retry logic with exponential backoff
4. Check Vercel function logs for details

---

## 📋 Checklist

Before deploying to production:

- [ ] Generate secure `CRON_SECRET` (32+ characters)
- [ ] Add to Vercel environment variables (all environments)
- [ ] Add to local `.env.local` for testing
- [ ] Test cron endpoint locally
- [ ] Test cron endpoint on Vercel
- [ ] Verify Vercel cron jobs are scheduled
- [ ] Document secret in password manager
- [ ] Set reminder to rotate secret in 90 days

---

## 📞 Support

If you encounter issues:

1. **Check Vercel Logs:** https://vercel.com/dashboard → Your Project → Logs
2. **Test Manually:** Use curl to test endpoint with secret
3. **Review Documentation:** Vercel Cron Jobs docs
4. **Contact Support:** support@nexusbiomedical.ai

---

**Last Updated:** December 2, 2025  
**Version:** 1.0.0  
**Security Level:** Critical
