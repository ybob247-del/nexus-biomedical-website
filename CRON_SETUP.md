# Trial Reminder Cron Job Setup

This document explains how to set up the automated trial reminder email system.

---

## Overview

The trial reminder cron job runs daily to check all active trials and send reminder emails at specific milestones:

**RxGuard (14-day trial):**
- 7 days remaining (50%)
- 3 days remaining (25%)
- 1 day remaining (final reminder)

**EndoGuard (30-day trial):**
- 15 days remaining (50%)
- 7 days remaining (25%)
- 1 day remaining (final reminder)

---

## Prerequisites

1. **Database tables created:**
   - `platform_trials` (already exists)
   - `trial_reminders` (run migration: `database-trial-reminders.sql`)
   - `users` (already exists)

2. **Environment variables configured:**
   - `DATABASE_URL` - PostgreSQL connection string
   - `BUILT_IN_FORGE_API_URL` - Email notification API URL
   - `BUILT_IN_FORGE_API_KEY` - Email notification API key

---

## Manual Testing

Before setting up the cron job, test the script manually:

```bash
cd /home/ubuntu/nexus-biomedical-website
node scripts/check-trials-cron.mjs
```

**Expected output:**
```
[Trial Cron] Starting trial check... 2025-11-22T09:00:00.000Z
[Trial Cron] Found 5 active trials
[Trial Cron] RxGuard for user@example.com: 7 days remaining
[Trial Cron] Sent reminder email to user@example.com (7 days remaining)
[Trial Cron] Complete: 1 reminders sent, 0 expiration notifications sent
[Trial Cron] Job completed successfully
```

---

## Cron Job Setup

### Option 1: System Crontab (Recommended for Production)

1. **Open crontab editor:**
   ```bash
   crontab -e
   ```

2. **Add the following line:**
   ```cron
   0 9 * * * cd /home/ubuntu/nexus-biomedical-website && /usr/bin/node scripts/check-trials-cron.mjs >> /var/log/trial-cron.log 2>&1
   ```

   This runs the script every day at 9:00 AM and logs output to `/var/log/trial-cron.log`.

3. **Save and exit** (Ctrl+X, then Y, then Enter in nano)

4. **Verify cron job is scheduled:**
   ```bash
   crontab -l
   ```

### Option 2: PM2 Cron (Alternative)

If you're using PM2 to manage your Node.js processes:

```bash
pm2 start scripts/check-trials-cron.mjs --cron "0 9 * * *" --name trial-reminder
pm2 save
```

---

## Monitoring

### Check Cron Logs

```bash
tail -f /var/log/trial-cron.log
```

### Check Database for Sent Reminders

```sql
SELECT 
  tr.id,
  tr.days_remaining,
  tr.created_at,
  pt.platform,
  u.email
FROM trial_reminders tr
JOIN platform_trials pt ON pt.id = tr.trial_id
JOIN users u ON u.id = pt.user_id
ORDER BY tr.created_at DESC
LIMIT 10;
```

### Check Active Trials

```sql
SELECT 
  pt.id,
  pt.platform,
  pt.trial_end_date,
  EXTRACT(DAY FROM (pt.trial_end_date - CURRENT_TIMESTAMP)) as days_remaining,
  u.email
FROM platform_trials pt
JOIN users u ON u.id = pt.user_id
WHERE pt.trial_status = 'active'
ORDER BY pt.trial_end_date ASC;
```

---

## Troubleshooting

### Emails Not Sending

1. **Check environment variables:**
   ```bash
   echo $BUILT_IN_FORGE_API_URL
   echo $BUILT_IN_FORGE_API_KEY
   ```

2. **Test email API manually:**
   ```bash
   curl -X POST $BUILT_IN_FORGE_API_URL/notifications/email \
     -H "Authorization: Bearer $BUILT_IN_FORGE_API_KEY" \
     -H "Content-Type: application/json" \
     -d '{
       "to": "test@example.com",
       "subject": "Test Email",
       "html": "<p>This is a test</p>"
     }'
   ```

3. **Check cron logs for errors:**
   ```bash
   grep "error" /var/log/trial-cron.log
   ```

### Duplicate Reminders

The script prevents duplicates using the `trial_reminders` table. If you see duplicates:

1. **Check for duplicate cron jobs:**
   ```bash
   crontab -l
   ```

2. **Verify unique constraint exists:**
   ```sql
   SELECT constraint_name, constraint_type 
   FROM information_schema.table_constraints 
   WHERE table_name = 'trial_reminders';
   ```

### Cron Job Not Running

1. **Check cron service status:**
   ```bash
   sudo systemctl status cron
   ```

2. **Check cron logs:**
   ```bash
   grep CRON /var/log/syslog
   ```

3. **Verify Node.js path:**
   ```bash
   which node
   ```
   Update crontab if path is different.

---

## Email Template Customization

To modify email templates, edit `api/utils/emailService.js`:

- `sendTrialReminderEmail()` - Reminder email template
- `sendTrialExpiredEmail()` - Expiration email template

After making changes, test manually before deploying:

```bash
node scripts/check-trials-cron.mjs
```

---

## Production Deployment Checklist

- [ ] Database migrations run successfully
- [ ] Environment variables configured
- [ ] Manual test completed successfully
- [ ] Cron job scheduled
- [ ] Log file permissions set correctly
- [ ] Monitoring alerts configured
- [ ] Email templates reviewed and approved
- [ ] Test emails sent to real addresses
- [ ] Backup cron job documented

---

## Support

For issues or questions, contact the development team or refer to:
- Email service documentation: `api/utils/emailService.js`
- Cron script: `scripts/check-trials-cron.mjs`
- Database schema: `database-trial-reminders.sql`
