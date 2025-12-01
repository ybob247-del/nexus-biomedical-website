# SMS Notification System v2.0 - Deployment Instructions

## ✅ What's Already Complete

All code for the SMS notification system has been implemented and is ready to use. The system includes:

### Phase 1: SMS Triggers ✅
- Assessment completion notifications (with high-risk alerts for score ≥70)
- Subscription activation SMS via Stripe webhook
- Trial/subscription expiration reminders (3 days, 1 day before)

### Phase 2: Granular Notification Preferences ✅
- 11 individual SMS preference toggles
- User-facing SMS settings page at `/settings/sms`
- API endpoints for managing preferences

### Phase 3: Automated SMS Campaigns ✅
- Weekly health tips (Mondays at 11am)
- Monthly assessment reminders (1st of month)
- 7/14/30-day engagement campaigns
- Vercel Cron job configured for daily execution

## 🔧 What Needs to Be Done

### Step 1: Run Database Migrations

The database tables need to be created in your production database. You have two options:

#### Option A: Using Database Management UI (Recommended)

1. Open the **Management UI** (right panel)
2. Click **Database** in the navigation
3. Look for the **SQL Query** or **Run Query** section
4. Copy and paste the contents of `/db/migrations/COMPLETE_SMS_SYSTEM_MIGRATION.sql`
5. Click **Execute** or **Run**

#### Option B: Using psql Command Line

If you have access to your database via command line:

```bash
# Get your DATABASE_URL from Settings → Secrets
# Then run:
psql $DATABASE_URL -f db/migrations/COMPLETE_SMS_SYSTEM_MIGRATION.sql
```

### Step 2: Verify Tables Were Created

Run this query to verify all tables exist:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('sms_campaigns', 'sms_campaign_sends', 'sms_health_tips');
```

You should see all 3 tables listed.

### Step 3: Verify User Preferences Column

Run this query to verify the notification_preferences column was added:

```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'users' 
AND column_name = 'notification_preferences';
```

You should see `notification_preferences` with type `jsonb`.

### Step 4: Deploy to Production

1. Click the **Publish** button in the Manus UI header (top-right)
2. Wait for Vercel deployment to complete (2-3 minutes)
3. Verify the deployment succeeded

### Step 5: Test the System

#### Test SMS Preferences Page
1. Log in to your account at www.nexusbiomedical.ai
2. Navigate to **Settings → SMS Notifications** (or `/settings/sms`)
3. Add your phone number in E.164 format: `+1XXXXXXXXXX`
4. Toggle SMS preferences on/off
5. Click **Save Settings**

#### Test Assessment Completion SMS
1. Complete an EndoGuard assessment
2. You should receive an SMS with your results
3. If score ≥70, you should also receive a high-risk alert SMS

#### Test Subscription Activation SMS
1. Subscribe to a platform (RxGuard or EndoGuard)
2. Complete Stripe checkout
3. You should receive a welcome SMS

## 📊 Monitoring

### View SMS Message History

Users can view their SMS history at:
- **URL:** `/settings/sms-history`
- **Shows:** All messages sent, delivery status, timestamps

### Admin Monitoring

Check the `sms_message_history` table for all SMS activity:

```sql
SELECT 
  user_id,
  message_type,
  status,
  sent_at,
  error_message
FROM sms_message_history
ORDER BY sent_at DESC
LIMIT 50;
```

### Campaign Performance

Check campaign sends:

```sql
SELECT 
  c.campaign_name,
  COUNT(s.id) as total_sends,
  SUM(CASE WHEN s.status = 'sent' THEN 1 ELSE 0 END) as successful,
  SUM(CASE WHEN s.status = 'failed' THEN 1 ELSE 0 END) as failed
FROM sms_campaigns c
LEFT JOIN sms_campaign_sends s ON c.id = s.campaign_id
GROUP BY c.campaign_name;
```

## 🔐 Security Notes

### CRON_SECRET
The CRON_SECRET you added in Settings → Secrets is used to authenticate:
- Vercel Cron jobs (automated campaigns)
- Admin API endpoints (migrations)

**Important:** This secret is only available in production after deployment. It's not available in the local development environment.

### Twilio Credentials
Your Twilio credentials are already configured:
- `TWILIO_ACCOUNT_SID`
- `TWILIO_AUTH_TOKEN`
- `TWILIO_PHONE_NUMBER`

These are used to send SMS messages via the Twilio API.

## 🚀 Vercel Cron Jobs

The system includes 3 Vercel Cron jobs configured in `vercel.json`:

1. **Trial Reminders** - Runs daily at 9 AM
   - Endpoint: `/api/cron/send-expiration-sms`
   - Sends 3-day and 1-day expiration warnings

2. **SMS Campaigns** - Runs daily at 11 AM
   - Endpoint: `/api/cron/send-sms-campaigns`
   - Sends weekly tips (Mondays), monthly reminders (1st), engagement campaigns

3. **SMS Reminders** - Runs daily at 10 AM
   - Endpoint: `/api/cron/send-sms-reminders`
   - Sends assessment reminders based on user activity

These cron jobs will automatically start working after you deploy to production.

## 📝 User Documentation

### For Users
Point users to the SMS settings page:
- **URL:** www.nexusbiomedical.ai/settings/sms
- **Features:**
  - Add/update phone number
  - Enable/disable SMS notifications
  - Choose which notification types to receive
  - View SMS history

### SMS Notification Types

Users can customize these 11 notification types:

1. **Assessment Completed** - Confirmation after completing assessment
2. **High Risk Alert** - Urgent notification for risk score ≥70
3. **Trial Expiring** - Reminder when free trial is ending
4. **Subscription Expiring** - Reminder when subscription is ending
5. **Subscription Activated** - Welcome message after subscribing
6. **Assessment Reminder** - Periodic reminders to take assessments
7. **Lab Reminder** - Reminders to get recommended lab tests
8. **Improvement Celebration** - Positive reinforcement for progress
9. **Weekly Tips** - Monday health tips
10. **Monthly Reminder** - Monthly check-in reminders

## 🐛 Troubleshooting

### SMS Not Sending

1. **Check user preferences:**
   ```sql
   SELECT notification_preferences 
   FROM users 
   WHERE id = [user_id];
   ```

2. **Check SMS history for errors:**
   ```sql
   SELECT * 
   FROM sms_message_history 
   WHERE user_id = [user_id] 
   AND status = 'failed'
   ORDER BY sent_at DESC;
   ```

3. **Verify Twilio credentials:**
   - Check Settings → Secrets for TWILIO_* variables
   - Test Twilio account at https://www.twilio.com/console

### Cron Jobs Not Running

1. **Check Vercel Dashboard:**
   - Go to your Vercel project
   - Click "Cron Jobs" tab
   - Verify jobs are scheduled and running

2. **Check CRON_SECRET:**
   - Verify it's set in Settings → Secrets
   - Verify it matches the value in Vercel environment variables

3. **Check cron job logs:**
   - Vercel Dashboard → Logs
   - Filter by function name (e.g., `/api/cron/send-sms-campaigns`)

## ✅ Success Checklist

- [ ] Database migrations completed successfully
- [ ] All 3 tables created (sms_campaigns, sms_campaign_sends, sms_health_tips)
- [ ] notification_preferences column added to users table
- [ ] 5 campaigns seeded
- [ ] 10 health tips seeded
- [ ] Deployed to production via Publish button
- [ ] SMS settings page accessible at /settings/sms
- [ ] Test SMS sent and received successfully
- [ ] Vercel Cron jobs visible in dashboard
- [ ] CRON_SECRET configured in production

## 📞 Support

If you encounter any issues:
1. Check the troubleshooting section above
2. Review Vercel deployment logs
3. Check database query errors in Vercel logs
4. Verify all environment variables are set correctly

---

**System Status:** ✅ Code Complete, ⏳ Database Migration Pending

Once you complete the database migration (Step 1), the entire SMS notification system will be fully operational!
