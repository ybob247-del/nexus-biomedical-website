# SMS Notification System - Implementation Guide

**Date**: November 29, 2025  
**Version**: 2.0 (Enhanced with Preferences & Campaigns)

---

## 🎯 Overview

The Nexus Biomedical Intelligence SMS notification system now includes:
1. **Automated Triggers** - Event-driven SMS for assessments, subscriptions, trials
2. **Granular Preferences** - 11 individual notification type toggles
3. **Automated Campaigns** - Weekly tips, monthly reminders, engagement SMS

---

## 📋 Table of Contents

1. [Architecture](#architecture)
2. [Database Schema](#database-schema)
3. [API Endpoints](#api-endpoints)
4. [SMS Triggers](#sms-triggers)
5. [Notification Preferences](#notification-preferences)
6. [Automated Campaigns](#automated-campaigns)
7. [Testing](#testing)
8. [Deployment Checklist](#deployment-checklist)

---

## 🏗️ Architecture

### Components

```
┌─────────────────────────────────────────────────────────────┐
│                    SMS NOTIFICATION SYSTEM                   │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   TRIGGERS   │  │ PREFERENCES  │  │  CAMPAIGNS   │     │
│  │              │  │              │  │              │     │
│  │ • Assessment │  │ • 11 Types   │  │ • Weekly     │     │
│  │ • Trial      │  │ • Granular   │  │ • Monthly    │     │
│  │ • Subscription│  │ • User UI   │  │ • Reminders  │     │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘     │
│         │                  │                  │             │
│         └──────────────────┼──────────────────┘             │
│                            │                                │
│                    ┌───────▼────────┐                       │
│                    │  smsHelper.js  │                       │
│                    │  (Central Hub) │                       │
│                    └───────┬────────┘                       │
│                            │                                │
│                    ┌───────▼────────┐                       │
│                    │  Twilio API    │                       │
│                    └────────────────┘                       │
└─────────────────────────────────────────────────────────────┘
```

### File Structure

```
/api
├── utils/
│   └── smsHelper.js                    # Central SMS sending logic
├── sms/
│   ├── send-notification.js            # Manual SMS API
│   └── notification-preferences.js     # Preferences CRUD API
├── endoguard/
│   └── save-assessment.js              # Trigger: Assessment complete
├── stripe/
│   └── webhook.js                      # Trigger: Subscription activated
└── cron/
    ├── send-expiration-sms.js          # Trigger: Trial/subscription expiring
    └── send-sms-campaigns.js           # Campaigns: Weekly/monthly

/src
├── components/
│   └── SMSNotificationSettingsEnhanced.jsx  # Preferences UI
└── pages/
    └── SMSSettings.jsx                      # Settings page wrapper

/db
├── schema/
│   ├── sms-message-history.sql         # SMS log table
│   └── sms-campaigns.sql               # Campaign tables
└── migrations/
    └── add-notification-preferences.sql # Preferences column
```

---

## 🗄️ Database Schema

### 1. `users` table (updated)

```sql
ALTER TABLE users ADD COLUMN notification_preferences JSONB DEFAULT '{
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
```

### 2. `sms_message_history` table

```sql
CREATE TABLE sms_message_history (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  phone_number VARCHAR(20),
  message_type VARCHAR(100),
  message_content TEXT,
  status VARCHAR(50),
  twilio_sid VARCHAR(255),
  error_message TEXT,
  sent_at TIMESTAMP DEFAULT NOW()
);
```

### 3. `sms_campaigns` table

```sql
CREATE TABLE sms_campaigns (
  id SERIAL PRIMARY KEY,
  campaign_name VARCHAR(255) UNIQUE,
  campaign_type VARCHAR(100),
  message_template TEXT,
  is_active BOOLEAN DEFAULT true,
  schedule_cron VARCHAR(100),
  target_audience JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 4. `sms_campaign_sends` table

```sql
CREATE TABLE sms_campaign_sends (
  id SERIAL PRIMARY KEY,
  campaign_id INTEGER REFERENCES sms_campaigns(id),
  user_id INTEGER REFERENCES users(id),
  phone_number VARCHAR(20),
  message_content TEXT,
  status VARCHAR(50),
  twilio_sid VARCHAR(255),
  sent_at TIMESTAMP
);
```

### 5. `sms_health_tips` table

```sql
CREATE TABLE sms_health_tips (
  id SERIAL PRIMARY KEY,
  tip_content TEXT,
  category VARCHAR(100),
  is_active BOOLEAN DEFAULT true,
  last_sent_at TIMESTAMP
);
```

---

## 🔌 API Endpoints

### 1. Send Manual SMS

**POST** `/api/sms/send-notification`

```json
{
  "phoneNumber": "+14155552671",
  "templateType": "highRiskAlert",
  "templateData": ["John", 85]
}
```

### 2. Get Notification Preferences

**GET** `/api/sms/notification-preferences`

**Headers**: `Authorization: Bearer <token>`

**Response**:
```json
{
  "success": true,
  "preferences": {
    "sms_enabled": true,
    "assessment_completed": true,
    "high_risk_alert": true,
    "trial_expiring": false,
    ...
  },
  "phoneNumber": "+14155552671",
  "smsEnabled": true
}
```

### 3. Update Notification Preferences

**POST** `/api/sms/notification-preferences`

**Headers**: `Authorization: Bearer <token>`

**Body**:
```json
{
  "preferences": {
    "sms_enabled": true,
    "assessment_completed": true,
    "high_risk_alert": true,
    "trial_expiring": false,
    "weekly_tips": false
  }
}
```

---

## 🔔 SMS Triggers

### 1. Assessment Completion

**File**: `/api/endoguard/save-assessment.js`

**Trigger**: When user completes EndoGuard assessment

**Logic**:
- Always sends "Assessment Completed" SMS with risk score
- If risk score ≥ 70, sends additional "High Risk Alert" SMS

**Code**:
```javascript
await sendSMSToUser(userId, 'assessmentCompleted', [userName, riskScore]);

if (riskScore >= 70) {
  await sendSMSToUser(userId, 'highRiskAlert', [userName, riskScore]);
}
```

### 2. Subscription Activated

**File**: `/api/stripe/webhook.js`

**Trigger**: When Stripe subscription is successfully created

**Logic**:
- Sends welcome SMS with platform name and dashboard link

**Code**:
```javascript
await sendSMSToUser(userId, 'subscriptionActivated', [userName, platform]);
```

### 3. Trial/Subscription Expiring

**File**: `/api/cron/send-expiration-sms.js`

**Trigger**: Vercel Cron (daily at 8am)

**Logic**:
- Checks trials expiring in 3 days → sends reminder
- Checks trials expiring in 1 day → sends urgent reminder
- Checks subscriptions expiring in 3 days → sends renewal reminder
- Checks subscriptions expiring in 1 day → sends urgent renewal

**Cron Schedule**: `0 8 * * *` (8am daily)

---

## ⚙️ Notification Preferences

### Preference Keys

| Key | Description | Default |
|-----|-------------|---------|
| `sms_enabled` | Master toggle | `true` |
| `assessment_completed` | Assessment completion notifications | `true` |
| `high_risk_alert` | High-risk health alerts (≥70) | `true` |
| `trial_expiring` | Trial expiration reminders | `true` |
| `subscription_expiring` | Subscription expiration | `true` |
| `subscription_activated` | Subscription confirmation | `true` |
| `assessment_reminder` | Periodic assessment reminders | `true` |
| `lab_reminder` | Lab test reminders | `true` |
| `improvement_celebration` | Progress celebrations | `true` |
| `weekly_tips` | Weekly health tips | `true` |
| `monthly_reminder` | Monthly check-ins | `true` |

### Preference Checking Logic

**File**: `/api/utils/smsHelper.js`

```javascript
export async function sendSMSToUser(userId, messageType, templateData = []) {
  // 1. Check if user has SMS enabled
  const smsSettings = await getUserSMSSettings(userId);
  if (!smsSettings) return { skipped: true };

  // 2. Check specific preference for this message type
  const preferenceKey = getPreferenceKey(messageType);
  if (preferences[preferenceKey] === false) {
    return { skipped: true, reason: 'User disabled this notification type' };
  }

  // 3. Send SMS
  return await sendSMS(userId, phoneNumber, messageType, templateData);
}
```

### UI Component

**File**: `/src/components/SMSNotificationSettingsEnhanced.jsx`

**Features**:
- Master SMS toggle
- Phone number input with E.164 validation
- 10 individual notification type toggles
- Icons and descriptions for each type
- "RECOMMENDED" badge for high-risk alerts
- Privacy notice
- Save button with loading state

---

## 📢 Automated Campaigns

### Campaign Types

#### 1. Weekly Health Tips 💡

**Schedule**: Every Monday at 11am  
**Cron**: `0 11 * * 1`

**Logic**:
- Selects random health tip not sent in last 30 days
- Sends to users with `weekly_tips` preference enabled
- Updates `last_sent_at` timestamp

**Health Tip Categories**:
- Hormone health
- Nutrition
- Exercise
- Sleep
- Stress management

#### 2. Monthly Assessment Reminder 📆

**Schedule**: 1st of every month at 11am  
**Cron**: `0 11 1 * *`

**Logic**:
- Sends to users with `monthly_reminder` preference enabled
- Encourages monthly check-in assessment

#### 3. Assessment Reminders (7/14/30 days) 📅

**Schedule**: Daily at 11am  
**Cron**: `0 11 * * *`

**Logic**:
- Checks users who haven't taken assessment in exactly 7, 14, or 30 days
- Sends personalized reminder
- Respects `assessment_reminder` preference

### Campaign Cron Job

**File**: `/api/cron/send-sms-campaigns.js`

**Vercel Cron Configuration** (`vercel.json`):
```json
{
  "crons": [
    {
      "path": "/api/cron/send-sms-campaigns",
      "schedule": "0 11 * * *"
    }
  ]
}
```

**Daily Logic**:
```javascript
const currentDay = new Date().getDay(); // 0=Sunday, 1=Monday
const currentDate = new Date().getDate(); // Day of month

if (currentDay === 1) {
  await sendWeeklyHealthTips(results);
}

if (currentDate === 1) {
  await sendMonthlyReminders(results);
}

await sendAssessmentReminders(results); // Always check
```

---

## 🧪 Testing

### Manual Testing Checklist

#### 1. SMS Triggers

- [ ] Complete EndoGuard assessment → Receive completion SMS
- [ ] Complete assessment with risk ≥70 → Receive high-risk alert
- [ ] Activate Stripe subscription → Receive activation SMS
- [ ] Trial expires in 3 days → Receive reminder
- [ ] Trial expires in 1 day → Receive urgent reminder

#### 2. Notification Preferences

- [ ] Navigate to `/settings/sms`
- [ ] Toggle master SMS switch → Save successfully
- [ ] Enter phone number → Validate E.164 format
- [ ] Disable "Weekly Tips" → Save successfully
- [ ] Complete assessment → Should NOT receive SMS if disabled

#### 3. Automated Campaigns

- [ ] Manually trigger cron job:
  ```bash
  curl -X POST https://your-domain.com/api/cron/send-sms-campaigns \
    -H "Authorization: Bearer $CRON_SECRET"
  ```
- [ ] Check `sms_campaign_sends` table for logged sends
- [ ] Verify SMS received on test phone number

### Database Queries for Testing

```sql
-- Check user preferences
SELECT id, email, notification_preferences 
FROM users 
WHERE email = 'test@example.com';

-- Check SMS history
SELECT * FROM sms_message_history 
WHERE user_id = 1 
ORDER BY sent_at DESC 
LIMIT 10;

-- Check campaign sends
SELECT * FROM sms_campaign_sends 
ORDER BY sent_at DESC 
LIMIT 10;

-- Check health tips rotation
SELECT * FROM sms_health_tips 
ORDER BY last_sent_at DESC NULLS FIRST;
```

---

## 🚀 Deployment Checklist

### Pre-Deployment

- [ ] Run database migrations:
  ```bash
  # Add notification_preferences column
  node api/admin/run-notification-preferences-migration.js
  
  # Create campaign tables
  psql $DATABASE_URL < db/schema/sms-campaigns.sql
  ```

- [ ] Verify environment variables:
  - `TWILIO_ACCOUNT_SID`
  - `TWILIO_AUTH_TOKEN`
  - `TWILIO_PHONE_NUMBER`
  - `CRON_SECRET`
  - `VITE_OAUTH_PORTAL_URL`

- [ ] Test Twilio credentials:
  ```bash
  curl -X POST http://localhost:3006/api/sms/send-notification \
    -H "Content-Type: application/json" \
    -d '{"phoneNumber":"+14155552671","templateType":"welcomeSMS","templateData":["Test"]}'
  ```

### Post-Deployment

- [ ] Verify Vercel Cron jobs are scheduled:
  - `/api/cron/send-expiration-sms` (8am daily)
  - `/api/cron/send-sms-campaigns` (11am daily)

- [ ] Check Vercel logs for cron execution

- [ ] Test SMS preferences UI at `/settings/sms`

- [ ] Monitor `sms_message_history` table for errors

- [ ] Set up alerts for failed SMS sends

### Monitoring

**Key Metrics**:
- SMS delivery rate (sent vs failed)
- User opt-out rate
- Campaign engagement (clicks, assessments completed)
- Twilio costs

**Queries**:
```sql
-- SMS delivery rate (last 7 days)
SELECT 
  status,
  COUNT(*) as count,
  ROUND(COUNT(*)::numeric / SUM(COUNT(*)) OVER () * 100, 2) as percentage
FROM sms_message_history
WHERE sent_at >= NOW() - INTERVAL '7 days'
GROUP BY status;

-- Campaign performance
SELECT 
  c.campaign_name,
  COUNT(cs.id) as total_sends,
  SUM(CASE WHEN cs.status = 'sent' THEN 1 ELSE 0 END) as successful,
  SUM(CASE WHEN cs.status = 'failed' THEN 1 ELSE 0 END) as failed
FROM sms_campaigns c
LEFT JOIN sms_campaign_sends cs ON c.id = cs.campaign_id
GROUP BY c.campaign_name;
```

---

## 📞 Support & Troubleshooting

### Common Issues

**Issue**: SMS not received  
**Solutions**:
1. Check user's `sms_notifications_enabled` flag
2. Verify phone number is in E.164 format
3. Check notification preferences for specific message type
4. Review `sms_message_history` for error messages
5. Verify Twilio account balance

**Issue**: Cron job not running  
**Solutions**:
1. Check Vercel Cron logs
2. Verify `CRON_SECRET` environment variable
3. Test cron endpoint manually with correct auth header

**Issue**: Database migration fails  
**Solutions**:
1. Check DATABASE_URL SSL configuration
2. Use API endpoint: `/api/admin/run-notification-preferences-migration`
3. Manually run SQL via database management UI

---

## 📝 Future Enhancements

- [ ] Admin UI for campaign management
- [ ] A/B testing for message templates
- [ ] SMS analytics dashboard
- [ ] Multi-language support
- [ ] MMS support for images
- [ ] Two-way SMS (reply handling)
- [ ] SMS opt-in double confirmation
- [ ] Rate limiting per user

---

## 📄 License & Credits

**Built by**: Manus AI  
**Date**: November 29, 2025  
**Twilio Integration**: SMS delivery  
**Framework**: Vercel Serverless Functions + Cron Jobs

---

**End of Documentation**
