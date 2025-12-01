# Production Deployment Checklist - Nexus Biomedical Intelligence

**Document Version:** 1.0  
**Last Updated:** December 1, 2025  
**Author:** Manus AI

---

## Overview

This comprehensive checklist ensures all systems are properly configured and tested before deploying the Nexus Biomedical Intelligence platform to production. The platform includes two active AI-powered healthcare tools (EndoGuard™ and RxGuard™), SMS notification system, AI chatbot, and complete subscription management infrastructure.

---

## Pre-Deployment Requirements

### Environment Variables Verification

All required environment variables must be configured in the Vercel dashboard before deployment.

| Variable Name | Purpose | Status | Notes |
|--------------|---------|--------|-------|
| `DATABASE_URL` | PostgreSQL connection string | ✅ Configured | TiDB Cloud with SSL |
| `JWT_SECRET` | Authentication token signing | ✅ Configured | Secure random string |
| `TWILIO_ACCOUNT_SID` | SMS service account ID | ✅ Configured | Trial account - needs upgrade |
| `TWILIO_AUTH_TOKEN` | SMS service authentication | ✅ Configured | Keep secure |
| `TWILIO_PHONE_NUMBER` | SMS sender number | ✅ Configured | +1-888-440-2503 |
| `RESEND_API_KEY` | Email service for notifications | ✅ Configured | For trial reminders |
| `OPENAI_API_KEY` | AI chatbot and assessments | ✅ Configured | GPT-4 access |
| `STRIPE_SECRET_KEY` | Payment processing | ✅ Configured | Test mode active |
| `STRIPE_PUBLISHABLE_KEY` | Client-side Stripe | ✅ Configured | Test mode active |
| `STRIPE_WEBHOOK_SECRET` | Webhook verification | ✅ Configured | From Stripe dashboard |
| `CRON_SECRET` | Secure cron job execution | ⚠️ Needs verification | Random secure string |
| `OWNER_OPEN_ID` | Admin access control | ✅ Configured | Owner authentication |

### Database Migrations Required

The following database migrations must be executed in production before deployment:

#### 1. SMS Notification System Tables

```sql
-- notification_preferences column
ALTER TABLE users ADD COLUMN IF NOT EXISTS notification_preferences JSONB DEFAULT '{
  "sms_enabled": true,
  "assessment_completed": true,
  "high_risk_alert": true,
  "trial_expiring": true,
  "subscription_expiring": true,
  "subscription_activated": true,
  "assessment_reminder": true,
  "lab_reminder": true,
  "improvement_celebration": true,
  "weekly_tips": true,
  "monthly_reminder": true
}'::jsonb;

-- SMS campaigns table
CREATE TABLE IF NOT EXISTS sms_campaigns (
  id SERIAL PRIMARY KEY,
  campaign_name VARCHAR(255) NOT NULL UNIQUE,
  campaign_type VARCHAR(100) NOT NULL,
  message_template TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- SMS campaign sends tracking
CREATE TABLE IF NOT EXISTS sms_campaign_sends (
  id SERIAL PRIMARY KEY,
  campaign_id INTEGER REFERENCES sms_campaigns(id) ON DELETE CASCADE,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  phone_number VARCHAR(20) NOT NULL,
  message_content TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  twilio_message_sid VARCHAR(100),
  sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  error_message TEXT
);

-- SMS health tips library
CREATE TABLE IF NOT EXISTS sms_health_tips (
  id SERIAL PRIMARY KEY,
  tip_text TEXT NOT NULL,
  category VARCHAR(100) NOT NULL,
  citation TEXT,
  source_journal VARCHAR(255),
  publication_year INTEGER,
  times_sent INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- SMS message history
CREATE TABLE IF NOT EXISTS sms_message_history (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  phone_number VARCHAR(20) NOT NULL,
  message_type VARCHAR(100) NOT NULL,
  message_content TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  twilio_message_sid VARCHAR(100),
  sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  delivered_at TIMESTAMP,
  error_code VARCHAR(20),
  error_message TEXT
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_sms_campaign_sends_user ON sms_campaign_sends(user_id);
CREATE INDEX IF NOT EXISTS idx_sms_campaign_sends_campaign ON sms_campaign_sends(campaign_id);
CREATE INDEX IF NOT EXISTS idx_sms_message_history_user ON sms_message_history(user_id);
CREATE INDEX IF NOT EXISTS idx_sms_message_history_sent_at ON sms_message_history(sent_at);
CREATE INDEX IF NOT EXISTS idx_sms_message_history_status ON sms_message_history(status);
```

#### 2. Subscription System Tables

```sql
-- Subscriptions table (if not exists)
CREATE TABLE IF NOT EXISTS subscriptions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  platform VARCHAR(100) NOT NULL,
  stripe_subscription_id VARCHAR(255),
  stripe_customer_id VARCHAR(255),
  stripe_price_id VARCHAR(255),
  status VARCHAR(50) DEFAULT 'trialing',
  trial_start TIMESTAMP,
  trial_end TIMESTAMP,
  current_period_start TIMESTAMP,
  current_period_end TIMESTAMP,
  cancel_at_period_end BOOLEAN DEFAULT false,
  canceled_at TIMESTAMP,
  selected_plan VARCHAR(50) DEFAULT 'monthly',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, platform)
);

-- Platform access table
CREATE TABLE IF NOT EXISTS platform_access (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  platform VARCHAR(100) NOT NULL,
  subscription_id INTEGER REFERENCES subscriptions(id) ON DELETE CASCADE,
  is_active BOOLEAN DEFAULT true,
  access_granted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  access_expires_at TIMESTAMP,
  UNIQUE(user_id, platform)
);
```

#### 3. Seed Data for SMS Campaigns

```sql
-- Insert SMS campaigns
INSERT INTO sms_campaigns (campaign_name, campaign_type, message_template) VALUES
('weekly_health_tips', 'recurring', 'Hi {name}! 💡 Health Tip: {tip_content} - Nexus Biomedical Intelligence'),
('monthly_assessment_reminder', 'recurring', 'Hi {name}! 📊 It''s time for your monthly hormone health assessment. Track your progress: {assessment_link}'),
('7_day_engagement', 'engagement', 'Hi {name}! It''s been 7 days since your last assessment. Ready to check in on your hormone health? {assessment_link}'),
('14_day_engagement', 'engagement', 'Hi {name}! It''s been 2 weeks since your last assessment. Let''s see how you''re doing: {assessment_link}'),
('30_day_engagement', 'engagement', 'Hi {name}! It''s been 30 days! Time for a comprehensive hormone health check-in: {assessment_link}')
ON CONFLICT (campaign_name) DO NOTHING;

-- Insert 30 health tips (sample - full list in migration file)
INSERT INTO sms_health_tips (tip_text, category, citation, source_journal, publication_year) VALUES
('Vitamin D plays a crucial role in hormone production. Aim for 15-20 minutes of sunlight daily or consider supplementation if deficient.', 'hormone_health', 'PMID: 21154195, Cited by 562', 'Hormone and Metabolic Research', 2011),
('Chronic stress elevates cortisol, disrupting hormone balance. Practice daily stress management through meditation, deep breathing, or yoga.', 'stress_management', 'PMC10706127, Cited by 415', 'Frontiers in Endocrinology', 2023),
('Quality sleep (7-9 hours) is essential for hormone regulation. Poor sleep disrupts growth hormone, cortisol, and reproductive hormones.', 'sleep', 'PMID: 9476, Cited by 691', 'Journal of Clinical Sleep Medicine', 2021)
ON CONFLICT DO NOTHING;
```

---

## Twilio SMS System Configuration

### Critical Issue: Trial Account Restrictions

**Current Status:** Twilio account is in **Trial mode** with Error 30044 blocking SMS delivery.

**Error 30044 Explanation:** "Message blocked - SMS to this destination is not allowed." This occurs because trial accounts can only send SMS to verified phone numbers, and even verified numbers may experience carrier-level blocking.

**Required Action Before Production:**

1. **Upgrade Twilio Account to Full Account**
   - Navigate to: https://console.twilio.com/us1/billing/manage-billing/billing-overview
   - Add minimum $20 credit to account
   - This automatically upgrades from Trial to Full account
   - Removes all sending restrictions

2. **Verify Account Upgrade**
   ```bash
   node check-twilio-account.js
   ```
   - Account Type should show "Full" instead of "Trial"
   - Recent messages should show "delivered" status instead of "failed"

3. **Test SMS Delivery**
   ```bash
   node test-sms.js
   ```
   - Should receive test message within 1-2 minutes
   - Message SID should show "delivered" status in Twilio console

### SMS System Testing Checklist

- [ ] Twilio account upgraded to Full (not Trial)
- [ ] Test SMS sent successfully to owner phone (+14693483227)
- [ ] SMS message history table populated correctly
- [ ] Assessment completion triggers SMS notification
- [ ] High-risk alert (score ≥70) sends immediate SMS
- [ ] Subscription activation sends welcome SMS
- [ ] Trial expiration reminders (3-day, 1-day) working
- [ ] Weekly health tips campaign scheduled (Mondays 11 AM)
- [ ] Monthly assessment reminders scheduled (1st of month)
- [ ] SMS preferences UI functional at /settings/sms
- [ ] SMS history page displays sent messages at /settings/sms-history
- [ ] User can opt-out of SMS notifications

---

## Vercel Cron Jobs Configuration

The following cron jobs must be configured in `vercel.json` and verified in Vercel dashboard:

| Cron Job | Schedule | Endpoint | Purpose |
|----------|----------|----------|---------|
| Trial Reminders | Daily 9 AM UTC | `/api/cron/check-trial-reminders` | Email reminders for expiring trials |
| Expiration SMS | Daily 9 AM UTC | `/api/cron/send-expiration-sms` | SMS for trial/subscription expiration |
| SMS Campaigns | Daily 11 AM UTC | `/api/cron/send-sms-campaigns` | Weekly tips, monthly reminders |

**Verification Steps:**

1. Check `vercel.json` contains all cron configurations
2. After deployment, verify in Vercel dashboard → Cron Jobs
3. Monitor first execution for each cron job
4. Check logs for successful execution

---

## Stripe Payment System

### Test Mode vs Live Mode

**Current Status:** Stripe is in **Test Mode**

**Before Accepting Real Payments:**

1. **Switch to Live Mode**
   - Obtain live API keys from Stripe dashboard
   - Update environment variables in Vercel
   - Test with real payment method

2. **Webhook Configuration**
   - Production webhook URL: `https://www.nexusbiomedical.ai/api/stripe/webhook`
   - Events to listen for:
     - `checkout.session.completed`
     - `customer.subscription.created`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
     - `invoice.payment_succeeded`
     - `invoice.payment_failed`

3. **Product Verification**
   - RxGuard™ Monthly: $39/month (14-day trial)
   - RxGuard™ Yearly: $374/year (14-day trial, 20% savings)
   - EndoGuard™ Premium: $49/month (14-day trial)
   - EndoGuard™ Premium Plus: $97/month (14-day trial)

### Subscription Flow Testing

- [ ] User can start 14-day free trial (RxGuard)
- [ ] User can start 14-day free trial (EndoGuard Premium)
- [ ] Trial countdown displays correctly
- [ ] Trial expiration banner appears at 3 days remaining
- [ ] Stripe checkout pre-fills with selected plan
- [ ] Webhook processes subscription creation
- [ ] Platform access granted after payment
- [ ] Subscription management page functional

---

## Authentication System

### Critical Fixes Applied

The following authentication issues were resolved and must be verified in production:

1. **Login API** - Returns JSON even on errors (not HTML)
2. **Signup API** - Returns JSON even on errors (not HTML)
3. **Database Connection** - 10-second connection timeout, 20-second query timeout
4. **Vercel Function Timeout** - Increased from 10s to 30s in `vercel.json`

### Authentication Testing Checklist

- [ ] User can create new account
- [ ] Email validation works correctly
- [ ] Password strength requirements enforced
- [ ] Login with correct credentials succeeds
- [ ] Login with incorrect credentials shows proper error
- [ ] JWT token generated and stored
- [ ] Protected routes require authentication
- [ ] Dashboard loads after login (no blank screen)
- [ ] Logout clears session correctly
- [ ] Password reset flow functional

---

## Platform Testing

### EndoGuard™ Assessment

- [ ] Assessment accessible without login (freemium model)
- [ ] Gender selection affects symptom display (male vs female)
- [ ] All 6 steps complete without errors
- [ ] Risk score calculated correctly (0-100 scale)
- [ ] Severity algorithm uses 5-domain weighted calculation
- [ ] Test recommendations display with citations
- [ ] Personalized roadmap generated
- [ ] Provider dashboard shows ICD-10 codes
- [ ] Signup prompt appears after results
- [ ] PDF export works (requires login)
- [ ] Assessment history saved for logged-in users
- [ ] Comparison feature shows multiple assessments
- [ ] Social media sharing cards generate correctly

### RxGuard™ Drug Interaction Checker

- [ ] Trial activation works automatically
- [ ] Medication search autocomplete functional
- [ ] Drug information displays from FDA OpenFDA API
- [ ] Multi-drug interaction analysis works
- [ ] Risk scoring displays (LOW/MODERATE/HIGH)
- [ ] Clinical recommendations provided
- [ ] Alternative medications suggested
- [ ] Mitigation strategies displayed
- [ ] AI analysis output shows confidence scores
- [ ] Medication list saves to database
- [ ] Data persists across login sessions
- [ ] PDF export functional

---

## AI Chatbot Integration

### Chatbot Configuration

- [ ] Floating chat button visible on all pages
- [ ] Chatbot modal opens/closes correctly
- [ ] FAQ database connected (75+ Q&A pairs)
- [ ] Text similarity matching working
- [ ] Contextual responses generated
- [ ] Confidence scoring displayed
- [ ] Source attribution shown
- [ ] Suggested questions appear for new users
- [ ] Conversation history maintained
- [ ] Mobile responsive design

---

## Performance & Security

### Performance Checks

- [ ] Homepage loads in < 3 seconds
- [ ] Dashboard loads in < 2 seconds
- [ ] Assessment completes without lag
- [ ] API responses < 1 second average
- [ ] Images optimized and lazy-loaded
- [ ] CSS/JS minified for production
- [ ] Lighthouse score > 90

### Security Verification

- [ ] All API endpoints require authentication where appropriate
- [ ] JWT tokens expire after 24 hours
- [ ] SQL injection protection (parameterized queries)
- [ ] XSS protection enabled
- [ ] CORS configured correctly
- [ ] Environment variables not exposed to client
- [ ] HTTPS enforced on all pages
- [ ] Stripe webhook signature verified

---

## Legal & Compliance

### Required Pages

- [ ] Privacy Policy accessible at /privacy
- [ ] Terms of Service accessible at /terms
- [ ] Security & Privacy page at /security-privacy
- [ ] Cookie consent banner displays
- [ ] GDPR data export functional
- [ ] GDPR account deletion functional
- [ ] Medical disclaimers on all platforms
- [ ] FDA disclaimer on assessment results

### HIPAA Compliance Messaging

- [ ] Clear statement: "We are NOT a HIPAA-covered entity"
- [ ] Explanation of pseudonymous data model
- [ ] No PHI/PII collection emphasized
- [ ] Clinician guidance documents available

---

## Monitoring & Analytics

### Post-Deployment Monitoring

1. **Vercel Logs**
   - Monitor for errors in first 24 hours
   - Check function execution times
   - Verify cron jobs execute successfully

2. **Database Monitoring**
   - Query performance
   - Connection pool status
   - Table sizes and growth

3. **Twilio Dashboard**
   - SMS delivery rates
   - Error codes
   - Cost tracking

4. **Stripe Dashboard**
   - Subscription creations
   - Payment success rate
   - Webhook delivery

5. **User Analytics**
   - Signup conversion rate
   - Trial activation rate
   - Assessment completion rate
   - Trial-to-paid conversion rate

---

## Deployment Steps

### 1. Pre-Deployment

- [ ] All database migrations executed
- [ ] Twilio account upgraded to Full
- [ ] All environment variables verified
- [ ] Code committed to GitHub
- [ ] Checkpoint created in Manus

### 2. Deploy to Vercel

- [ ] Click "Publish" button in Manus UI
- [ ] Wait for Vercel deployment to complete
- [ ] Verify deployment status in Vercel dashboard
- [ ] Check deployment logs for errors

### 3. Post-Deployment Verification

- [ ] Visit production URL: https://www.nexusbiomedical.ai
- [ ] Test authentication flow (signup, login, logout)
- [ ] Complete EndoGuard assessment
- [ ] Activate RxGuard trial
- [ ] Send test SMS to owner phone
- [ ] Verify cron jobs scheduled in Vercel
- [ ] Check Stripe webhook receiving events
- [ ] Test chatbot functionality

### 4. User Acceptance Testing

- [ ] Owner tests all critical flows
- [ ] Beta testers invited (if applicable)
- [ ] Feedback collected and documented
- [ ] Critical bugs fixed before public launch

---

## Rollback Plan

If critical issues are discovered post-deployment:

1. **Immediate Rollback**
   ```bash
   # In Manus UI, use webdev_rollback_checkpoint tool
   # Specify previous stable version ID
   ```

2. **Notify Users**
   - Post status update on homepage
   - Send email to active users
   - Update social media

3. **Fix Issues**
   - Identify root cause
   - Apply fixes in development
   - Test thoroughly before redeployment

---

## Success Criteria

Deployment is considered successful when:

✅ All authentication flows work correctly  
✅ EndoGuard assessment completes without errors  
✅ RxGuard trial activation successful  
✅ SMS system sends and delivers messages  
✅ Stripe payments process correctly  
✅ AI chatbot responds to queries  
✅ No critical errors in logs for 24 hours  
✅ Performance metrics meet targets  
✅ Owner confirms all features working  

---

## Support & Troubleshooting

### Common Issues

**Issue:** SMS not delivering  
**Solution:** Verify Twilio account is upgraded to Full, check error codes in Twilio console

**Issue:** Database connection timeout  
**Solution:** Check DATABASE_URL, verify SSL configuration, increase timeout if needed

**Issue:** Stripe webhook not receiving events  
**Solution:** Verify webhook URL in Stripe dashboard, check STRIPE_WEBHOOK_SECRET

**Issue:** Dashboard blank after login  
**Solution:** Check browser console for errors, verify /dashboard route exists, check authentication state

### Contact Information

- **Technical Support:** support@nexusbiomedical.ai
- **Twilio Support:** https://support.twilio.com
- **Stripe Support:** https://support.stripe.com
- **Vercel Support:** https://vercel.com/support

---

**Document End**

This checklist should be reviewed and updated after each major deployment or feature addition.
