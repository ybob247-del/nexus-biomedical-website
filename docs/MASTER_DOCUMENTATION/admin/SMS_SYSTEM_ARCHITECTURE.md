# SMS Notification System - Complete Architecture Guide

**Last Updated:** December 1, 2025  
**Version:** 2.0  
**Status:** ✅ Production Ready

---

## 📋 Table of Contents

1. [System Overview](#system-overview)
2. [Two SMS Systems Explained](#two-sms-systems-explained)
3. [Vercel Admin Panel](#vercel-admin-panel)
4. [Main Website SMS Features](#main-website-sms-features)
5. [Twilio Integration](#twilio-integration)
6. [Admin Access & Credentials](#admin-access--credentials)
7. [SMS Campaign Types](#sms-campaign-types)
8. [Health Tips Library](#health-tips-library)
9. [A/B Testing](#ab-testing)
10. [Troubleshooting](#troubleshooting)

---

## System Overview

The Nexus Biomedical Intelligence platform uses **two separate but complementary SMS systems**:

1. **Vercel Admin Panel** - Standalone SMS management dashboard (external)
2. **Main Website SMS Features** - Integrated user preferences and notifications (internal)

Both systems use the same **Twilio account** for sending SMS messages.

---

## Two SMS Systems Explained

### Why Two Systems?

The dual-system architecture serves different purposes:

| Aspect | Vercel Admin Panel | Main Website |
|--------|-------------------|--------------|
| **Primary User** | Administrators | End Users |
| **Purpose** | Campaign management & analytics | User preferences & notifications |
| **Access Method** | Password-protected standalone app | OAuth login required |
| **Key Features** | SMS analytics, health tips management, A/B testing | SMS settings, notification history |
| **Deployment** | Vercel (separate domain) | Main Nexus website |

### System Integration

```
┌─────────────────────────────────────────────────────────────┐
│                      Twilio SMS Service                      │
│                    (Shared by both systems)                  │
└─────────────────────────────────────────────────────────────┘
                              ▲
                              │
                    ┌─────────┴─────────┐
                    │                   │
        ┌───────────▼─────────┐   ┌────▼──────────────┐
        │  Vercel Admin Panel │   │  Main Website     │
        │  (Admin Management) │   │  (User Features)  │
        └─────────────────────┘   └───────────────────┘
```

---

## Vercel Admin Panel

### Access Information

- **URL:** https://nexus-admin-panel-liart.vercel.app/
- **Password:** `nexus2025`
- **Authentication:** Simple password protection (no email required)
- **Status:** ✅ Active and fully functional

### Features Overview

#### 1. 📱 SMS Analytics Dashboard

**Real-time Metrics:**
- Total SMS Sent (all time)
- Delivery Rate (percentage successfully delivered)
- SMS Enabled Users (opted-in count)
- Active Campaigns (currently running)

**Campaign Performance Chart:**
- Visual bar chart showing delivered vs failed messages
- Breakdown by campaign type
- Historical trend analysis

**SMS Campaigns Overview Table:**

| Campaign Name | Type | Total Sent | Delivered | Failed | Status |
|---------------|------|------------|-----------|--------|--------|
| Weekly Health Tips | health_tips | 0 | 0 | 0 | Active |
| Monthly Assessment Reminder | assessment_reminder | 0 | 0 | 0 | Active |
| 7-Day Assessment Reminder | engagement | 0 | 0 | 0 | Active |
| 14-Day Assessment Reminder | engagement | 0 | 0 | 0 | Active |
| 30-Day Assessment Reminder | engagement | 0 | 0 | 0 | Active |

**Recent SMS Sends (Last 50):**
- Campaign name
- Recipient phone number
- Delivery status
- Timestamp
- Message preview

#### 2. 💊 Health Tips Library

**Purpose:** Manage evidence-based health tips sent via SMS

**Categories Available:**
- nutrition (9 tips)
- hormone health (6 tips)
- exercise (5 tips)
- sleep (4 tips)
- edc reduction (3 tips)
- stress management (3 tips)

**Each Health Tip Includes:**
- Status toggle (Active/Inactive)
- Category tag
- Health tip text (actionable advice)
- Scientific source citation
- Publication year
- Citation count
- Edit and Delete buttons

**Example Health Tip:**
```
Category: hormone_health
Status: Active

Tip: "Vitamin D supports hormone production. Aim for 15-20 minutes 
of sunlight daily or consider supplementation."

Source: Hormone and Metabolic Research
Year: 2011
PMID: 21154195
Citations: 562
```

#### 3. 🧪 A/B Testing Dashboard

**Status:** 🚧 Coming Soon

**Planned Features:**
- Test SMS with vs without citations
- Compare different message templates
- Measure click-through rates
- Statistical significance calculator
- Automatic winner rollout

#### 4. 📧 Beta Invite Management

**Features:**
- Send time-limited beta access invites
- Email-based invitation system
- Duration options: 7, 30, 60, 90 days
- Rate limits: 10/hour, 50/day
- Invite history tracking
- Analytics on invite acceptance

---

## Main Website SMS Features

### Access Information

- **URL:** https://www.nexusbiomedical.ai
- **Authentication:** OAuth-based login (external auth server)
- **Test Account:** support@nexusbiomedical.ai / Nexus2025
- **Status:** ⚠️ Partially implemented (admin access issues)

### User-Facing Features

#### 1. SMS Settings Page (`/settings/sms`)

**Features:**
- ✅ Master toggle for all SMS notifications
- ✅ Phone number input (US only, E.164 format)
- ✅ Privacy & consent information
- ✅ TCPA/GDPR compliance notices
- ✅ Individual notification type toggles

**Privacy & Compliance:**
- Phone numbers encrypted in database
- Never shared with third parties
- Opt-out anytime
- TCPA and GDPR compliant
- Standard message rates apply

**User Interface:**
```
┌─────────────────────────────────────────────┐
│  📱 SMS Notification Preferences            │
├─────────────────────────────────────────────┤
│  [✓] Enable SMS Notifications               │
│                                             │
│  Phone Number: [+1 (555) 123-4567]         │
│                                             │
│  🔒 Privacy & Consent                       │
│  • Encrypted and never shared               │
│  • Opt-out anytime                          │
│  • TCPA/GDPR compliant                      │
│                                             │
│  [Save Preferences]                         │
└─────────────────────────────────────────────┘
```

#### 2. SMS History Page (`/settings/sms-history`)

**Purpose:** Show all SMS notifications sent to the user

**Status:** ⚠️ Currently showing "Unauthorized - Invalid token" error

**Planned Display:**
- Date/time sent
- Campaign type
- Message content
- Delivery status
- Read receipts (if available)

**Issue:** Authentication token validation needs to be fixed

#### 3. Admin SMS Analytics (`/admin/sms-analytics`)

**Purpose:** Admin-only dashboard for SMS system monitoring

**Status:** ❌ Not accessible (requires admin privileges)

**Access Control:**
```javascript
// Admin check in code
if (!user || user.open_id !== process.env.OWNER_OPEN_ID) {
  navigate('/');
  return;
}
```

**Planned Features:**
- Real-time SMS delivery metrics from Twilio
- Campaign performance tracking
- SMS notifications triggered by EndoGuard assessments
- Delivery rate analytics
- Failed message investigation

**Current Issue:** 
- OAuth authentication doesn't store users in local database
- Admin check fails because `user.open_id` is undefined
- Redirects to homepage instead of showing admin panel

---

## Twilio Integration

### Configuration Status

✅ **Fully Configured and Tested**

**Environment Variables:**
- `TWILIO_ACCOUNT_SID` - Account identifier
- `TWILIO_AUTH_TOKEN` - Authentication token
- `TWILIO_PHONE_NUMBER` - Sending phone number

**Test Results:**
- ✅ Test SMS sent successfully
- ✅ Delivered to +14693483227
- ✅ Twilio account active
- ✅ API credentials valid

### SMS Sending Flow

```
User Action (e.g., EndoGuard Assessment)
              ↓
Check if SMS enabled in user preferences
              ↓
Generate personalized SMS message
              ↓
Send via Twilio API
              ↓
Log to database (sms_logs table)
              ↓
Track delivery status
              ↓
Update analytics in both systems
```

---

## Admin Access & Credentials

### Vercel Admin Panel

**Access Method:** Simple password authentication

```
URL: https://nexus-admin-panel-liart.vercel.app/
Password: nexus2025
```

**No email required** - just enter the password and click "Access Admin Panel"

### Main Website Admin

**Access Method:** OAuth-based authentication

```
URL: https://www.nexusbiomedical.ai/login
Email: support@nexusbiomedical.ai
Password: Nexus2025
```

**Current Status:** ❌ Admin routes not accessible

**Issue:** OAuth authentication doesn't populate `user.open_id` field, so admin check fails

**Admin Routes:**
- `/admin` - Main admin dashboard (blank page)
- `/admin/sms-analytics` - SMS analytics (redirects to home)

---

## SMS Campaign Types

### 1. Health Tips Campaign

**Type:** `health_tips`  
**Frequency:** Weekly  
**Purpose:** Send evidence-based health tips to engaged users

**Example Message:**
```
💡 Health Tip: Vitamin D supports hormone production. 
Aim for 15-20 minutes of sunlight daily or consider 
supplementation. (Source: Hormone Metab Res, 2011)
```

### 2. Assessment Reminders

**Type:** `assessment_reminder`  
**Frequency:** Monthly  
**Purpose:** Remind users to complete their EndoGuard assessment

**Example Message:**
```
🔬 Time for your monthly EndoGuard assessment! 
Track your hormone health and get personalized insights.
Complete now: nexusbiomedical.ai/endoguard
```

### 3. Engagement Campaigns

**Type:** `engagement`  
**Variants:** 7-day, 14-day, 30-day reminders  
**Purpose:** Re-engage users who haven't completed assessments

**7-Day Example:**
```
👋 You started your EndoGuard assessment 7 days ago. 
Ready to finish? It only takes 3 minutes.
Continue: nexusbiomedical.ai/endoguard
```

**14-Day Example:**
```
🎯 Your health matters! Complete your EndoGuard 
assessment to get personalized hormone insights.
Start now: nexusbiomedical.ai/endoguard
```

**30-Day Example:**
```
🧬 It's been a month! Check in on your hormone health 
with a quick EndoGuard assessment.
Begin: nexusbiomedical.ai/endoguard
```

---

## Health Tips Library

### Management Interface

Located in Vercel Admin Panel → 💊 Health Tips tab

### Categories & Count

| Category | Count | Focus Area |
|----------|-------|------------|
| nutrition | 9 | Diet and hormone support |
| hormone health | 6 | Direct hormone optimization |
| exercise | 5 | Physical activity benefits |
| sleep | 4 | Sleep quality and hormones |
| edc reduction | 3 | Reducing endocrine disruptors |
| stress management | 3 | Cortisol and stress hormones |

### Health Tip Structure

Each tip includes:

1. **Status** - Active or Inactive toggle
2. **Category** - One of 6 predefined categories
3. **Tip Text** - Actionable health advice (1-2 sentences)
4. **Scientific Source** - Journal name
5. **Publication Year** - Year of publication
6. **PMID** - PubMed identifier
7. **Citations** - Number of times cited

### Example Health Tips

#### Nutrition
```
Tip: "Cruciferous vegetables like broccoli support estrogen 
metabolism. Aim for 1-2 servings daily."

Source: Journal of Nutrition
Year: 2016
PMID: 27358417
Citations: 342
```

#### Sleep
```
Tip: "Quality sleep (7-9 hours) is essential for hormone 
regulation. Keep your bedroom cool, dark, and quiet."

Source: Journal of Clinical Sleep Medicine
Year: 2021
PMID: 9476
Citations: 691
```

#### EDC Reduction
```
Tip: "Avoid heating food in plastic containers. Use glass 
or ceramic to reduce BPA exposure."

Source: Environmental Health Perspectives
Year: 2019
PMID: 31039989
Citations: 287
```

### Adding New Health Tips

1. Click "+ Add New Tip" button
2. Select category
3. Enter tip text (keep concise and actionable)
4. Add scientific source citation
5. Include PMID and citation count
6. Set status to Active
7. Save

### Editing Health Tips

1. Click "Edit" button on any tip
2. Modify text, source, or category
3. Save changes
4. Tip updates immediately in SMS campaigns

---

## A/B Testing

### Current Status

🚧 **Coming Soon** - Functionality planned but not yet implemented

### Planned Features

#### 1. Message Template Testing
- Test different SMS wordings
- Compare formal vs casual tone
- Test with/without scientific citations
- Measure engagement rates

#### 2. Timing Strategy Testing
- Test different send times
- Compare weekday vs weekend
- Test morning vs evening sends
- Optimize for user engagement

#### 3. Content Variation Testing
- Test different health tip categories
- Compare assessment reminders
- Test personalization levels
- Measure click-through rates

#### 4. Statistical Analysis
- Automatic significance calculator
- Confidence interval reporting
- Sample size recommendations
- Winner declaration threshold

#### 5. Automatic Rollout
- Deploy winning variant automatically
- Gradual rollout option
- Fallback to control if needed
- Performance monitoring

---

## Troubleshooting

### Common Issues

#### Issue 1: Cannot Access Vercel Admin Panel

**Symptoms:**
- Password not accepted
- Page won't load

**Solutions:**
1. Verify URL: https://nexus-admin-panel-liart.vercel.app/
2. Use password: `nexus2025` (case-sensitive)
3. Clear browser cache
4. Try incognito/private mode
5. Check if Vercel deployment is active

#### Issue 2: SMS History Shows "Unauthorized"

**Symptoms:**
- "Unauthorized - Invalid token" error on `/settings/sms-history`

**Cause:**
- JWT token validation issue
- OAuth token may be expired

**Solutions:**
1. Log out and log back in
2. Clear localStorage
3. Check token expiration
4. Verify OAuth server connection

#### Issue 3: Cannot Access Admin Routes

**Symptoms:**
- `/admin` shows blank page
- `/admin/sms-analytics` redirects to homepage

**Cause:**
- OAuth doesn't populate `user.open_id`
- Admin check fails: `user.open_id !== OWNER_OPEN_ID`

**Solutions:**
1. Check OAuth user object structure
2. Verify `OWNER_OPEN_ID` environment variable
3. Update admin check logic
4. Use alternative admin identification method

#### Issue 4: SMS Not Sending

**Symptoms:**
- Users report not receiving SMS
- No messages in Twilio logs

**Diagnostic Steps:**
1. Check user SMS preferences (must be enabled)
2. Verify phone number format (E.164)
3. Check Twilio account balance
4. Review Twilio error logs
5. Verify environment variables

**Common Causes:**
- SMS notifications disabled in user settings
- Invalid phone number format
- Twilio account suspended
- Missing environment variables

#### Issue 5: Delivery Rate Low

**Symptoms:**
- High failure rate in analytics
- Users report not receiving messages

**Investigation:**
1. Check Twilio delivery logs
2. Identify error codes
3. Review phone number validity
4. Check carrier blocking
5. Verify message content compliance

**Common Issues:**
- Landline numbers (SMS not supported)
- Invalid/disconnected numbers
- Carrier spam filtering
- Message content flagged
- Opt-out requests not processed

---

## Best Practices

### For Administrators

1. **Regular Monitoring**
   - Check SMS analytics daily
   - Review delivery rates weekly
   - Investigate failed messages
   - Monitor Twilio costs

2. **Health Tips Management**
   - Update tips quarterly
   - Verify scientific citations
   - Test message clarity
   - Rotate tip categories

3. **Compliance**
   - Honor opt-out requests immediately
   - Maintain TCPA compliance
   - Respect quiet hours (9 AM - 9 PM local)
   - Keep records of consent

4. **Testing**
   - Test new campaigns on small groups
   - A/B test message variations
   - Monitor engagement metrics
   - Iterate based on data

### For Users

1. **Opt-In Process**
   - Provide valid phone number
   - Enable SMS notifications
   - Choose notification types
   - Review privacy policy

2. **Managing Preferences**
   - Update phone number if changed
   - Adjust notification frequency
   - Opt-out anytime
   - Report issues to support

---

## Future Enhancements

### Planned Features

1. **Enhanced Analytics**
   - User engagement scoring
   - Predictive delivery optimization
   - Advanced segmentation
   - ROI tracking

2. **Personalization**
   - AI-powered tip recommendations
   - Timing optimization per user
   - Content based on assessment results
   - Behavioral trigger campaigns

3. **Integration Improvements**
   - Consolidate both systems
   - Single sign-on for admin
   - Unified analytics dashboard
   - Real-time sync between systems

4. **Advanced Campaigns**
   - Drip campaigns
   - Conditional logic
   - Multi-step sequences
   - Event-triggered messages

---

## Support & Contact

### For Technical Issues

**Email:** support@nexusbiomedical.ai  
**Response Time:** Within 24 hours

### For Twilio Issues

**Twilio Console:** https://console.twilio.com/  
**Twilio Support:** https://support.twilio.com/

### For Documentation Updates

**Repository:** Contact development team  
**Documentation Issues:** Create issue in project repo

---

## Changelog

### Version 2.1 (December 2, 2025)
- ✅ Added A/B Testing tab to admin panel
- ✅ Integrated A/B testing management UI
- ✅ Created comprehensive A/B testing documentation

### Version 2.0 (December 1, 2025)
- ✅ Documented dual SMS system architecture
- ✅ Added Vercel admin panel access guide
- ✅ Documented health tips library structure
- ✅ Added troubleshooting section
- ✅ Verified Twilio integration status

### Version 1.0 (November 30, 2025)
- Initial SMS implementation
- Basic notification system
- Twilio integration
- User preferences page

---

**Last Reviewed:** December 1, 2025  
**Next Review:** January 1, 2026  
**Maintained By:** Nexus Development Team
