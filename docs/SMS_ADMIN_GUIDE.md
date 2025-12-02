# SMS Notification System - Admin User Guide

## 📱 Overview

The Nexus Biomedical SMS notification system provides automated, personalized health communications to users via text message. This guide covers how to manage, monitor, and optimize the SMS system.

---

## 🎯 Key Features

### Automated SMS Campaigns
- **Weekly Health Tips** - Send evidence-based health tips with scientific citations
- **Assessment Reminders** - Monthly reminders to complete health assessments
- **Trial Expiration Alerts** - 3-day and 1-day warnings before trial ends
- **High-Risk Alerts** - Immediate notifications for EndoGuard scores ≥70
- **Subscription Updates** - Welcome messages and renewal reminders

### User Preferences
- Users can opt-in/opt-out at `/settings/sms`
- Granular control over notification types
- SMS history available at `/settings/sms-history`

### Analytics & Monitoring
- Real-time delivery rate tracking
- Campaign performance metrics
- Cost monitoring (Twilio pricing)
- Failed message alerts

---

## 📊 Accessing SMS Analytics

### Dashboard Location
Navigate to: **Admin Dashboard → SMS Analytics**

Or directly: `https://your-domain.com/admin/sms-analytics`

### Key Metrics

#### Overview Cards
1. **Total Sent** - Total SMS messages sent
2. **Delivered** - Successfully delivered messages (with delivery rate %)
3. **Failed** - Failed deliveries requiring attention
4. **Estimated Cost** - Total cost at $0.0079 per SMS

#### User Engagement
- **SMS Opt-In Rate** - Percentage of users with SMS enabled
- **Health Tips Library** - Number of active health tips with citations

#### Campaign Performance Table
- Campaign name and type
- Total sends, delivered, failed counts
- Success rate percentage
- Active/Inactive status

#### Recent Messages
- Last 20 SMS messages sent
- Message type, content, phone number
- Delivery status and timestamp
- Error messages for failed sends

---

## 🔧 Managing SMS Campaigns

### 1. Weekly Health Tips Campaign

**Schedule:** Every Monday at 10:00 AM  
**Endpoint:** `/api/cron/send-health-tips`  
**Purpose:** Send rotating health tips to opted-in users

#### How It Works
1. Randomly selects a health tip from the database
2. Sends to all users with `sms_enabled: true` and `health_tips: true`
3. Tracks sends in `sms_campaign_sends` table
4. Logs all messages in `sms_message_history`

#### Managing Health Tips
- Navigate to: `/admin/health-tips` (if implemented)
- Or query database directly:

```sql
-- View all health tips
SELECT * FROM sms_health_tips WHERE is_active = true;

-- Add new health tip
INSERT INTO sms_health_tips (tip_text, category, citation, is_active)
VALUES (
  'Your health tip text here',
  'nutrition',
  'Source: Journal Name, Year',
  true
);

-- Disable a health tip
UPDATE sms_health_tips SET is_active = false WHERE id = ?;
```

### 2. Monthly Assessment Reminders

**Schedule:** 1st of every month at 9:00 AM  
**Endpoint:** `/api/cron/send-assessment-reminders`  
**Purpose:** Remind users to complete monthly health assessments

#### Target Users
- Users who haven't completed an assessment in 30+ days
- Users with `sms_enabled: true` and `assessment_reminders: true`

### 3. Trial Expiration Reminders

**Schedule:** Daily at 8:00 AM  
**Endpoint:** `/api/cron/check-trial-expirations`  
**Purpose:** Warn users before trial expires

#### Reminder Schedule
- **3 days before expiration** - First reminder
- **1 day before expiration** - Final reminder
- Includes link to upgrade to paid plan

---

## 🚨 Monitoring & Troubleshooting

### Common Issues

#### Low Delivery Rate (<90%)

**Possible Causes:**
- Invalid phone numbers (not in E.164 format)
- Carrier blocking (spam filters)
- Insufficient Twilio account balance
- Phone numbers on DNC (Do Not Call) list

**Solutions:**
1. Check Twilio error logs: [Twilio Console](https://console.twilio.com/us1/monitor/logs/sms)
2. Verify phone number format: `+1234567890` (E.164)
3. Check Twilio account balance
4. Review failed messages in SMS Analytics
5. Contact Twilio support if persistent issues

#### High Opt-Out Rate (>10%)

**Possible Causes:**
- Too frequent messaging
- Irrelevant content
- Poor timing (late night sends)
- Unclear opt-out instructions

**Solutions:**
1. Review campaign frequency
2. Analyze which message types have highest opt-outs
3. A/B test message content and timing
4. Ensure opt-out instructions are clear
5. Survey users who opt-out

#### Cron Jobs Not Running

**Possible Causes:**
- Missing `CRON_SECRET` environment variable
- Incorrect cron schedule syntax
- Vercel function timeout
- Database connection issues

**Solutions:**
1. Verify `CRON_SECRET` is set in Vercel
2. Check Vercel cron logs in dashboard
3. Test endpoint manually with curl:
```bash
curl -X POST https://your-domain.com/api/cron/send-health-tips \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```
4. Review Vercel function logs for errors

---

## 💰 Cost Management

### Twilio Pricing
- **US/Canada SMS:** $0.0079 per message
- **International SMS:** Varies by country (typically $0.05-0.15)

### Cost Estimation

| Users | SMS/Month | Monthly Cost |
|-------|-----------|--------------|
| 100   | 400       | $3.16        |
| 500   | 2,000     | $15.80       |
| 1,000 | 4,000     | $31.60       |
| 5,000 | 20,000    | $158.00      |
| 10,000| 40,000    | $316.00      |

**Assumptions:** 4 SMS per user per month (1 health tip, 1 assessment reminder, 2 transactional)

### Cost Optimization Tips
1. **Segment Users** - Only send relevant messages
2. **Batch Campaigns** - Combine multiple messages when possible
3. **Monitor Opt-Outs** - Don't send to users who opt-out
4. **Use Email for Long Content** - SMS for alerts, email for details
5. **A/B Test Frequency** - Find optimal send frequency

---

## 📈 Best Practices

### Message Content
- **Keep it short** - Under 160 characters when possible
- **Clear CTA** - Include a clear call-to-action
- **Personalize** - Use user's first name
- **Add value** - Every message should provide value
- **Include opt-out** - "Reply STOP to unsubscribe"

### Timing
- **Avoid late night** - No messages after 9 PM local time
- **Avoid early morning** - No messages before 8 AM local time
- **Consider time zones** - Schedule based on user's timezone
- **Test different times** - A/B test send times for engagement

### Compliance
- **CAN-SPAM Act** - Include opt-out mechanism
- **TCPA** - Obtain explicit consent before sending
- **HIPAA** - Don't include PHI in SMS messages
- **Carrier Guidelines** - Follow Twilio's best practices

### Testing
- **Test before launch** - Send to test numbers first
- **Monitor first 24 hours** - Watch for issues after launch
- **A/B test content** - Test different message variations
- **Track metrics** - Monitor delivery rate, opt-outs, engagement

---

## 🧪 A/B Testing SMS Campaigns

### Using the A/B Test System

1. Navigate to: `/admin/ab-tests`
2. Click "Create New Test"
3. Fill in test details:
   - **Test Name:** "Health Tips - Short vs Long"
   - **Tour Name:** Select campaign type
   - **Traffic Split:** 50/50 recommended
   - **Variant A Config:** `{"message_length": "short"}`
   - **Variant B Config:** `{"message_length": "long"}`

4. Monitor results in real-time
5. Stop test when statistically significant
6. Implement winning variant

### Metrics to Track
- **Delivery Rate** - Did the message get delivered?
- **Opt-Out Rate** - Did users unsubscribe?
- **Click-Through Rate** - Did users click links? (if using short links)
- **Engagement Rate** - Did users take desired action?

---

## 📞 Support & Resources

### Twilio Console
- **SMS Logs:** https://console.twilio.com/us1/monitor/logs/sms
- **Account Balance:** https://console.twilio.com/billing
- **Phone Numbers:** https://console.twilio.com/phone-numbers

### Internal Tools
- **SMS Analytics:** `/admin/sms-analytics`
- **A/B Tests:** `/admin/ab-tests`
- **User Settings:** `/settings/sms`
- **SMS History:** `/settings/sms-history`

### Documentation
- [Twilio SMS API](https://www.twilio.com/docs/sms)
- [Twilio Best Practices](https://www.twilio.com/docs/sms/best-practices)
- [TCPA Compliance](https://www.twilio.com/docs/glossary/what-is-tcpa)
- [Vercel Cron Jobs](https://vercel.com/docs/cron-jobs)

### Getting Help
- **Technical Issues:** support@nexusbiomedical.ai
- **Twilio Support:** https://support.twilio.com
- **Vercel Support:** https://vercel.com/support

---

## 🔐 Security & Privacy

### Data Protection
- Phone numbers encrypted at rest
- SMS content logged for debugging only
- User preferences stored securely
- HIPAA-compliant infrastructure

### Access Control
- Only admin users (OWNER_OPEN_ID) can access analytics
- Cron endpoints protected with CRON_SECRET
- User data isolated per account
- Audit logs for all SMS sends

### Compliance Checklist
- [x] Explicit opt-in required
- [x] Clear opt-out mechanism (Reply STOP)
- [x] No PHI in SMS messages
- [x] Audit trail for all sends
- [x] User can view SMS history
- [x] User can delete account and data

---

## 📅 Maintenance Schedule

### Daily
- [ ] Check SMS delivery rate (should be >95%)
- [ ] Review failed messages
- [ ] Monitor Twilio account balance

### Weekly
- [ ] Review campaign performance
- [ ] Check opt-out rate trends
- [ ] Analyze user engagement

### Monthly
- [ ] Review cost vs budget
- [ ] Update health tips library
- [ ] A/B test new message variants
- [ ] Review compliance with regulations

### Quarterly
- [ ] Audit all SMS campaigns
- [ ] Review user feedback
- [ ] Update documentation
- [ ] Train new admin users

---

**Last Updated:** December 2, 2025  
**Version:** 1.0.0  
**Maintained By:** Nexus Biomedical Engineering Team
