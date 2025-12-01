# Database Migration Guide - Nexus Biomedical Intelligence

**Document Version:** 1.0  
**Last Updated:** December 1, 2025  
**Author:** Manus AI

---

## Overview

This guide provides step-by-step instructions for executing all required database migrations before deploying the Nexus Biomedical Intelligence platform to production. The database uses **TiDB Cloud** (MySQL-compatible) with SSL enabled.

---

## Database Connection Information

### Production Database

- **Provider:** TiDB Cloud (Serverless)
- **Protocol:** MySQL-compatible
- **SSL:** Required
- **Connection String:** Stored in `DATABASE_URL` environment variable
- **Management UI:** Available in Manus Settings → Database panel

### Connection Parameters

```
Host: gateway01.us-west-2.prod.aws.tidbcloud.com
Port: 4000
Database: nexus_biomedical
SSL Mode: Required
Connection Timeout: 10 seconds
Query Timeout: 20 seconds
```

---

## Migration Files Overview

The following migration files must be executed in order:

| File | Purpose | Status | Priority |
|------|---------|--------|----------|
| `COMPLETE_SMS_SYSTEM_MIGRATION.sql` | SMS notification system tables | ⚠️ Pending | HIGH |
| `SMS_HEALTH_TIPS_CITATIONS_UPDATE.sql` | Add scientific citations to health tips | ⚠️ Pending | MEDIUM |
| `add-notification-preferences.sql` | User notification preferences | ⚠️ Pending | HIGH |
| `subscriptions-and-access.sql` | Subscription and platform access tables | ✅ Completed | HIGH |
| `email_campaigns.sql` | Email drip campaign system | ✅ Completed | MEDIUM |

---

## Pre-Migration Checklist

Before executing migrations, verify:

- [ ] Database connection working (test in Manus Database UI)
- [ ] SSL connection enabled
- [ ] Backup of current database taken
- [ ] All environment variables configured
- [ ] Database user has CREATE TABLE, ALTER TABLE, INSERT permissions

---

## Migration 1: Complete SMS System

### File: `COMPLETE_SMS_SYSTEM_MIGRATION.sql`

This migration creates all tables required for the SMS notification system.

**Tables Created:**
1. `notification_preferences` column in `users` table
2. `sms_campaigns` - Campaign definitions
3. `sms_campaign_sends` - Campaign send tracking
4. `sms_health_tips` - Health tip library

**Execution Steps:**

#### Option A: Using Manus Database UI

1. Open Manus Management UI → Database panel
2. Click "Execute SQL" button
3. Copy contents of `/home/ubuntu/nexus-biomedical-website/db/migrations/COMPLETE_SMS_SYSTEM_MIGRATION.sql`
4. Paste into SQL editor
5. Click "Run Query"
6. Verify success message

#### Option B: Using Command Line

```bash
cd /home/ubuntu/nexus-biomedical-website
node -e "
const { query } = require('./api/utils/db.js');
const fs = require('fs');

(async () => {
  try {
    const sql = fs.readFileSync('./db/migrations/COMPLETE_SMS_SYSTEM_MIGRATION.sql', 'utf8');
    await query(sql);
    console.log('✅ SMS system migration completed successfully');
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  }
  process.exit(0);
})();
"
```

**Verification:**

```sql
-- Check if tables were created
SHOW TABLES LIKE 'sms_%';

-- Verify notification_preferences column
DESCRIBE users;

-- Check seeded campaigns
SELECT campaign_name, campaign_type, is_active FROM sms_campaigns;

-- Check seeded health tips
SELECT COUNT(*) as tip_count FROM sms_health_tips;
```

**Expected Results:**
- 3 tables created: `sms_campaigns`, `sms_campaign_sends`, `sms_health_tips`
- `users.notification_preferences` column exists (JSONB type)
- 5 campaigns seeded
- 10+ health tips seeded

---

## Migration 2: SMS Health Tips with Citations

### File: `SMS_HEALTH_TIPS_CITATIONS_UPDATE.sql`

This migration adds scientific citations and research references to health tips, making them more credible and authoritative.

**Schema Changes:**
- Adds `citation` column (PMID or PMC reference)
- Adds `source_journal` column
- Adds `publication_year` column
- Adds `times_sent` tracking column
- Updates existing tips with research citations

**Execution:**

```bash
cd /home/ubuntu/nexus-biomedical-website
node -e "
const { query } = require('./api/utils/db.js');
const fs = require('fs');

(async () => {
  try {
    const sql = fs.readFileSync('./db/migrations/SMS_HEALTH_TIPS_CITATIONS_UPDATE.sql', 'utf8');
    await query(sql);
    console.log('✅ Health tips citations migration completed');
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  }
  process.exit(0);
})();
"
```

**Verification:**

```sql
-- Check new columns exist
DESCRIBE sms_health_tips;

-- Verify citations were added
SELECT tip_content, citation, source_journal, publication_year 
FROM sms_health_tips 
LIMIT 5;

-- Count tips with citations
SELECT 
  COUNT(*) as total_tips,
  COUNT(citation) as tips_with_citations
FROM sms_health_tips;
```

---

## Migration 3: SMS Message History Table

### File: `sms-message-history.sql`

This migration creates a comprehensive audit log for all SMS messages sent through the system.

**Table Schema:**

```sql
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
```

**Indexes:**
- `idx_sms_message_history_user` - Fast user lookup
- `idx_sms_message_history_sent_at` - Time-based queries
- `idx_sms_message_history_status` - Status filtering

**Execution:**

```bash
cd /home/ubuntu/nexus-biomedical-website
node -e "
const { query } = require('./api/utils/db.js');
const fs = require('fs');

(async () => {
  try {
    const sql = fs.readFileSync('./db/schema/sms-message-history.sql', 'utf8');
    await query(sql);
    console.log('✅ SMS message history table created');
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  }
  process.exit(0);
})();
"
```

---

## Migration 4: Email Campaigns System

### File: `email_campaigns.sql`

Creates tables for email drip campaigns (7/14/30-day follow-ups).

**Tables Created:**
1. `email_campaigns` - Campaign definitions
2. `email_campaign_sends` - Send tracking
3. `email_templates` - Reusable templates

**Status:** ✅ Already executed in previous deployment

**Verification:**

```sql
SELECT campaign_name, trigger_type, delay_days 
FROM email_campaigns 
ORDER BY delay_days;
```

---

## Post-Migration Verification

After all migrations are complete, run this comprehensive verification script:

```bash
cd /home/ubuntu/nexus-biomedical-website
node verify-migrations.js
```

### Manual Verification Checklist

- [ ] All SMS tables exist and are accessible
- [ ] `users.notification_preferences` column exists
- [ ] SMS campaigns seeded (5 campaigns)
- [ ] Health tips seeded with citations (30+ tips)
- [ ] Indexes created on all tables
- [ ] Foreign key constraints working
- [ ] No orphaned records
- [ ] Sample SMS can be sent successfully

---

## Rollback Procedures

If a migration fails or causes issues, use these rollback scripts:

### Rollback SMS System

```sql
-- Remove SMS tables (WARNING: Data loss!)
DROP TABLE IF EXISTS sms_campaign_sends CASCADE;
DROP TABLE IF EXISTS sms_campaigns CASCADE;
DROP TABLE IF EXISTS sms_health_tips CASCADE;
DROP TABLE IF EXISTS sms_message_history CASCADE;

-- Remove notification_preferences column
ALTER TABLE users DROP COLUMN IF EXISTS notification_preferences;
```

### Rollback Health Tips Citations

```sql
-- Remove citation columns
ALTER TABLE sms_health_tips 
DROP COLUMN IF EXISTS citation,
DROP COLUMN IF EXISTS source_journal,
DROP COLUMN IF EXISTS publication_year,
DROP COLUMN IF EXISTS times_sent;
```

---

## Common Migration Errors

### Error: "There was an error establishing an SSL connection"

**Cause:** SSL configuration mismatch between local and production database.

**Solution:**
1. Check `DATABASE_URL` includes `ssl=true` parameter
2. Verify TiDB Cloud requires SSL (it does)
3. Update `api/utils/db.js` to force SSL:

```javascript
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});
```

### Error: "Table already exists"

**Cause:** Migration was partially executed or run multiple times.

**Solution:** All migrations use `IF NOT EXISTS` clauses, so this should be safe to ignore. Verify table contents:

```sql
SELECT COUNT(*) FROM sms_campaigns;
SELECT COUNT(*) FROM sms_health_tips;
```

### Error: "Foreign key constraint fails"

**Cause:** Referenced table doesn't exist or has different schema.

**Solution:**
1. Verify `users` table exists
2. Check `users.id` is INTEGER type
3. Run migrations in correct order

---

## Migration Monitoring

After executing migrations, monitor these metrics:

### Database Performance

```sql
-- Check table sizes
SELECT 
  table_name,
  table_rows,
  ROUND(((data_length + index_length) / 1024 / 1024), 2) AS size_mb
FROM information_schema.TABLES
WHERE table_schema = 'nexus_biomedical'
ORDER BY (data_length + index_length) DESC;
```

### Index Usage

```sql
-- Verify indexes are being used
SHOW INDEX FROM sms_campaigns;
SHOW INDEX FROM sms_campaign_sends;
SHOW INDEX FROM sms_health_tips;
SHOW INDEX FROM sms_message_history;
```

### Data Integrity

```sql
-- Check for orphaned records
SELECT COUNT(*) as orphaned_sends
FROM sms_campaign_sends
WHERE campaign_id NOT IN (SELECT id FROM sms_campaigns);

-- Verify all users have notification preferences
SELECT COUNT(*) as users_without_prefs
FROM users
WHERE notification_preferences IS NULL;
```

---

## Next Steps After Migration

1. **Test SMS System**
   ```bash
   node test-sms.js
   ```

2. **Verify Cron Jobs**
   - Check `vercel.json` for cron configuration
   - Deploy to Vercel
   - Verify cron jobs appear in Vercel dashboard

3. **Test User Flows**
   - Complete EndoGuard assessment
   - Verify SMS notification sent
   - Check SMS preferences UI at `/settings/sms`
   - Test opt-out functionality

4. **Monitor First 24 Hours**
   - Check SMS delivery rates
   - Monitor Twilio costs
   - Review error logs
   - Track user engagement

---

## Support & Resources

- **TiDB Cloud Documentation:** https://docs.pingcap.com/tidbcloud/
- **Twilio SMS API:** https://www.twilio.com/docs/sms
- **Database Management UI:** Manus Settings → Database
- **Migration Files Location:** `/home/ubuntu/nexus-biomedical-website/db/migrations/`

---

**Document End**

All migrations should be executed in a maintenance window with database backups taken before and after execution.
