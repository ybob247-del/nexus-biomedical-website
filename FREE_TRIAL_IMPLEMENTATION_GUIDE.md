# 🎯 FREE TRIAL SYSTEM IMPLEMENTATION GUIDE

## Overview

This guide explains the complete free trial system for Nexus Biomedical Intelligence, including:
- **Platform-specific trials** - Each platform (RxGuard, PediCalc, etc.) gets its own separate trial
- **Beta tester special access** - 30-60 days free access to all platforms
- **Regular user trials** - 14-day trial per platform
- **Usage limits** - 100 checks for RxGuard, 50 for PediCalc, etc.
- **No credit card required** - Twilio-style signup

---

## 🏗️ Architecture

### **Key Differences from Original Design:**

**Original (Single Trial):**
- User gets ONE 14-day trial across all platforms
- After trial expires, must pay to access ANY platform
- Trial is user-level, not platform-level

**New (Platform-Specific Trials):**
- User gets SEPARATE trial for EACH platform
- Can trial RxGuard (14 days), then trial PediCalc (14 days), etc.
- Trial is platform-level, not user-level
- Beta testers get 60 days per platform (or unlimited access for beta period)

---

## 📊 Database Schema

### **New Tables:**

1. **`platform_trials`** - Tracks trials per platform per user
   - One row per platform per user
   - `trial_status`: 'active', 'expired', 'converted'
   - `trial_type`: 'regular' (14 days) or 'beta' (60 days)

2. **`usage_tracking`** - Tracks every action on every platform
   - Used to enforce usage limits (100 drug checks, 50 dosing calcs, etc.)
   - `is_trial_usage`: TRUE if during trial period
   - `is_beta_usage`: TRUE if by beta tester

3. **`trial_limits`** - Defines limits per platform
   - `regular_trial_days`: 14 days for regular users
   - `beta_trial_days`: 60 days for beta testers
   - `max_uses`: 100 for RxGuard, 50 for PediCalc, etc.

### **Updated Tables:**

1. **`users`** - Added beta tester fields
   - `is_beta_tester`: TRUE if user is beta tester
   - `beta_access_expires`: When beta access ends (30-60 days from signup)
   - `phone_number`, `phone_verified`: For phone verification

2. **`platform_access`** - Added trial_id
   - Links access to specific trial (or subscription)

---

## 🔄 User Flows

### **Flow 1: Regular User (14-Day Trial)**

1. User signs up → Creates account (email + password)
2. User verifies email → Clicks link in email
3. User verifies phone → Enters SMS code
4. User clicks "Try RxGuard Free" → Trial activated for RxGuard
5. User uses RxGuard for 14 days → Sees "13 days left, 87/100 checks used"
6. User clicks "Try PediCalc Free" → NEW trial activated for PediCalc
7. User uses PediCalc for 14 days → Separate trial, separate usage counter
8. RxGuard trial expires → Access blocked for RxGuard only
9. User clicks "Upgrade RxGuard" → Stripe checkout for RxGuard subscription
10. User pays → RxGuard access restored permanently
11. PediCalc trial still active → Can continue using PediCalc until trial expires

**Key Points:**
- ✅ Each platform has separate 14-day trial
- ✅ Can trial multiple platforms simultaneously
- ✅ Paying for one platform doesn't affect other trials
- ✅ Usage limits per platform (100 checks for RxGuard, 50 for PediCalc)

---

### **Flow 2: Beta Tester (60-Day Access)**

1. User signs up → Creates account
2. User verifies email → Clicks link in email
3. **Admin grants beta access** → `grant_beta_access(user_id, 60)`
4. User sees "Beta Tester: 60 days free access to all platforms"
5. User clicks "Launch RxGuard" → Access granted immediately (no separate trial)
6. User clicks "Launch PediCalc" → Access granted immediately
7. User uses all platforms for 60 days → Sees "57 days left" countdown
8. Day 58: Email reminder → "Your beta access ends in 2 days"
9. Day 60: Beta access expires → All platform access blocked
10. User clicks "Upgrade to Continue" → Stripe checkout
11. User pays → Access restored permanently

**Key Points:**
- ✅ Beta testers get 60 days access to ALL platforms
- ✅ No separate trials per platform (one beta period covers all)
- ✅ After beta expires, can still use regular trials if they haven't used them
- ✅ Usage limits still apply (prevents abuse)

---

### **Flow 3: Beta Tester → Paid Subscriber**

1. Beta tester uses platforms for 30 days
2. Beta tester loves RxGuard, wants to keep using it
3. Beta tester clicks "Subscribe to RxGuard" → Stripe checkout
4. Beta tester pays → RxGuard access permanent
5. Beta access still active for other platforms → Can continue using PediCalc, MedWatch, etc. for remaining 30 days
6. Day 60: Beta expires → Only RxGuard access remains (paid subscription)
7. Beta tester can subscribe to other platforms separately

**Key Points:**
- ✅ Beta testers can convert to paid anytime during beta period
- ✅ Paid subscriptions are permanent (not affected by beta expiration)
- ✅ Can subscribe to some platforms while keeping beta access to others

---

## 🔧 API Endpoints

### **1. Activate Platform Trial**
```
POST /api/trial/activate-platform
Body: { "platform": "RxGuard" }
Headers: { "Authorization": "Bearer <JWT_TOKEN>" }

Response:
{
  "success": true,
  "message": "Free trial activated successfully for RxGuard",
  "trial": {
    "platform": "RxGuard",
    "trialType": "regular",
    "trialDays": 14,
    "endDate": "2025-11-22T12:00:00Z",
    "daysRemaining": 14,
    "usageLimit": 100,
    "usageCount": 0
  }
}
```

### **2. Check Platform Access**
```
GET /api/trial/check-access?platform=RxGuard
Headers: { "Authorization": "Bearer <JWT_TOKEN>" }

Response:
{
  "platform": "RxGuard",
  "canAccess": true,
  "accessType": "trial", // or "paid", "beta", "none"
  "trialDaysRemaining": 13,
  "usageCount": 23,
  "usageLimit": 100,
  "message": "Free trial access"
}
```

### **3. Track Usage**
```
POST /api/trial/track-usage
Body: { 
  "platform": "RxGuard", 
  "action": "drug_check",
  "metadata": { "drug": "Warfarin", "interaction": "Aspirin" }
}
Headers: { "Authorization": "Bearer <JWT_TOKEN>" }

Response:
{
  "success": true,
  "message": "Usage tracked successfully",
  "stats": {
    "platform": "RxGuard",
    "action": "drug_check",
    "usageCount": 24,
    "usageLimit": 100,
    "usageRemaining": 76,
    "trialDaysRemaining": 13,
    "accessType": "trial"
  }
}
```

### **4. Grant Beta Access (Admin Only)**
```
POST /api/admin/grant-beta-access
Body: { 
  "userEmail": "pharmacist@hospital.com",
  "betaDays": 60
}
Headers: { "Authorization": "Bearer <ADMIN_JWT_TOKEN>" }

Response:
{
  "success": true,
  "message": "Beta access granted to pharmacist@hospital.com",
  "user": {
    "email": "pharmacist@hospital.com",
    "betaDays": 60,
    "betaExpiresAt": "2026-01-07T12:00:00Z",
    "daysRemaining": 60
  }
}
```

---

## 📝 Database Functions

### **1. `can_access_platform(user_id, platform)`**
Checks if user can access a platform. Returns:
- `can_access`: TRUE/FALSE
- `access_type`: 'paid', 'trial', 'beta', 'none'
- `trial_days_remaining`: Days left in trial
- `usage_count`: Number of uses
- `usage_limit`: Maximum uses allowed
- `message`: Human-readable message

**Logic:**
1. Check if user has paid subscription → Grant access
2. Check if user is beta tester with valid access → Grant access (if under usage limit)
3. Check if user has active trial for platform → Grant access (if under usage limit)
4. Otherwise → Deny access

### **2. `activate_platform_trial(user_id, platform, is_beta)`**
Activates a trial for a platform. Returns:
- `success`: TRUE/FALSE
- `trial_id`: ID of created trial
- `end_date`: When trial expires
- `message`: Human-readable message

**Logic:**
1. Check if trial already exists for this platform → Deny
2. Get trial duration (14 days for regular, 60 days for beta)
3. Create trial record in `platform_trials`
4. Grant access in `platform_access`
5. Log event in `audit_log`

### **3. `grant_beta_access(user_id, beta_days)`**
Marks user as beta tester with X days of access.

**Logic:**
1. Set `is_beta_tester = TRUE`
2. Set `beta_access_expires = NOW() + beta_days`
3. Log event in `audit_log`

### **4. `track_platform_usage(user_id, platform, action, metadata)`**
Tracks usage of a platform.

**Logic:**
1. Check if user is on trial for this platform
2. Check if user is beta tester
3. Insert record in `usage_tracking` with flags

### **5. `expire_platform_trials()`**
Expires trials that have passed their end date. Run via cron every hour.

**Logic:**
1. Find all active trials where `trial_end_date < NOW()`
2. Set `trial_status = 'expired'`
3. Revoke access in `platform_access` (only if no paid subscription)
4. Return count of expired trials

---

## 🚀 Implementation Steps

### **Step 1: Run Database Migration (15 min)**

1. Connect to Vercel Postgres database
2. Run `database-schema-free-trial-v2.sql`
3. Verify tables created:
   ```sql
   SELECT * FROM trial_limits;
   SELECT * FROM platform_trials;
   SELECT * FROM usage_tracking;
   ```

### **Step 2: Deploy API Endpoints (10 min)**

1. Copy API files to `/api/trial/` and `/api/admin/`
2. Deploy to Vercel
3. Test endpoints:
   ```bash
   curl -X POST https://nexusbiomedical.ai/api/trial/activate-platform \
     -H "Authorization: Bearer <TOKEN>" \
     -H "Content-Type: application/json" \
     -d '{"platform":"RxGuard"}'
   ```

### **Step 3: Update Frontend (2 hours)**

1. **Dashboard Page** - Show trial status for each platform
2. **Platform Pages** - Show usage counter and days remaining
3. **Trial Activation Flow** - Add "Start Free Trial" button
4. **Upgrade Prompts** - Show when trial expires or usage limit reached

### **Step 4: Set Up Cron Job (10 min)**

1. Create Vercel cron job to expire trials:
   ```json
   {
     "crons": [{
       "path": "/api/cron/expire-trials",
       "schedule": "0 * * * *"
     }]
   }
   ```

2. Create `/api/cron/expire-trials.js`:
   ```javascript
   import { query } from '../db.js';
   
   export default async function handler(req, res) {
     const result = await query('SELECT expire_platform_trials()');
     return res.json({ expired: result.rows[0].expire_platform_trials });
   }
   ```

### **Step 5: Test Complete Flow (1 hour)**

1. **Test Regular User:**
   - Sign up → Verify email/phone
   - Activate RxGuard trial → Use 10 times
   - Check access → Should show 10/100 uses
   - Activate PediCalc trial → Use 5 times
   - Check access → Should show separate counters

2. **Test Beta Tester:**
   - Sign up → Verify email
   - Admin grants beta access (60 days)
   - Launch RxGuard → Access granted immediately
   - Launch PediCalc → Access granted immediately
   - Check access → Should show "beta" type

3. **Test Trial Expiration:**
   - Manually set trial end date to past
   - Run `expire_platform_trials()`
   - Check access → Should be denied

---

## 📊 Usage Limits Per Platform

| Platform | Regular Trial | Beta Trial | Max Uses |
|----------|--------------|------------|----------|
| RxGuard | 14 days | 60 days | 100 drug checks |
| PediCalc | 14 days | 60 days | 50 dosing calculations |
| MedWatch | 14 days | 60 days | 100 guideline searches |
| ElderWatch | 14 days | 60 days | 100 risk assessments |
| ReguReady | 14 days | 60 days | 50 document generations |
| ClinicalIQ | 14 days | 60 days | 100 protocol searches |

**Note:** These limits can be adjusted in the `trial_limits` table.

---

## 🎯 Beta Tester Workflow

### **How to Grant Beta Access:**

1. User signs up on website
2. User comments "BETA" on your LinkedIn post
3. You DM them beta signup link
4. User fills out beta form (Google Form)
5. You receive notification with their email
6. **You run this command:**
   ```sql
   SELECT grant_beta_access(
     (SELECT id FROM users WHERE email = 'pharmacist@hospital.com'),
     60  -- 60 days of beta access
   );
   ```
7. User receives email: "You've been accepted to the beta program!"
8. User logs in → Sees "Beta Tester: 60 days free access"
9. User can access all platforms immediately

### **Beta Tester Email Template:**

```
Subject: Welcome to Nexus Biomedical Beta Program! 🎉

Hi [Name],

Congratulations! You've been accepted to the Nexus Biomedical Intelligence beta program.

You now have 60 days of FREE access to all 6 platforms:
✅ RxGuard™ - Drug interaction detection
✅ PediCalc™ - Pediatric dosing calculator
✅ MedWatch™ - Clinical guideline search
✅ ElderWatch™ - Geriatric risk assessment
✅ ReguReady™ - FDA compliance assistant
✅ ClinicalIQ™ - Evidence-based protocol search

Your beta access expires on: [DATE]

What we need from you:
1. Use the platforms in your daily workflow
2. Report any bugs or issues
3. Provide honest feedback (what works, what doesn't)
4. Optional: Testimonial if you love it

Login here: https://nexusbiomedical.ai/login

Questions? Reply to this email.

Thank you for being an early adopter!

Dr. Pamela Tebebi
Founder, Nexus Biomedical Intelligence
```

---

## ⏱️ Total Implementation Time

| Task | Time | Status |
|------|------|--------|
| Database migration | 15 min | ✅ Complete |
| API endpoints | 10 min | ✅ Complete |
| Frontend updates | 2 hours | ⏳ Pending |
| Cron job setup | 10 min | ⏳ Pending |
| Testing | 1 hour | ⏳ Pending |
| **TOTAL** | **4 hours** | **40% Complete** |

---

## 🚨 Next Steps

1. **Run database migration** (15 min)
2. **Deploy API endpoints** (10 min)
3. **Update frontend** (2 hours)
4. **Test complete flow** (1 hour)
5. **Launch beta program** (announce on LinkedIn)

---

## 📞 Support

If you have questions about this implementation, refer to:
- `database-schema-free-trial-v2.sql` - Complete database schema
- `/api/trial/` - Trial management APIs
- `/api/admin/` - Admin APIs (beta access)

**Ready to implement?** Let's start with Step 1 (database migration)!

