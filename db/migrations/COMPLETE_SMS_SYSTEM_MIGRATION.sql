-- ============================================
-- COMPLETE SMS NOTIFICATION SYSTEM MIGRATION
-- Date: Nov 29, 2025
-- Purpose: Set up all database tables for SMS notification system v2.0
-- ============================================

-- STEP 1: Add notification_preferences column to users table
-- ============================================
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS notification_preferences JSONB DEFAULT '{
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

-- Add index for faster queries
CREATE INDEX IF NOT EXISTS idx_users_notification_preferences 
ON users USING gin(notification_preferences);

-- Update existing users to have default preferences
UPDATE users 
SET notification_preferences = '{
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
}'::jsonb
WHERE notification_preferences IS NULL;

-- STEP 2: Create SMS campaigns table
-- ============================================
CREATE TABLE IF NOT EXISTS sms_campaigns (
  id SERIAL PRIMARY KEY,
  campaign_name VARCHAR(255) NOT NULL UNIQUE,
  campaign_type VARCHAR(100) NOT NULL,
  message_template TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  schedule_cron VARCHAR(100),
  target_audience JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- STEP 3: Create SMS campaign sends table
-- ============================================
CREATE TABLE IF NOT EXISTS sms_campaign_sends (
  id SERIAL PRIMARY KEY,
  campaign_id INTEGER REFERENCES sms_campaigns(id) ON DELETE CASCADE,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  phone_number VARCHAR(20) NOT NULL,
  message_content TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  twilio_sid VARCHAR(255),
  error_message TEXT,
  sent_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- STEP 4: Create SMS health tips table
-- ============================================
CREATE TABLE IF NOT EXISTS sms_health_tips (
  id SERIAL PRIMARY KEY,
  tip_content TEXT NOT NULL,
  category VARCHAR(100),
  is_active BOOLEAN DEFAULT true,
  last_sent_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- STEP 5: Create indexes for performance
-- ============================================
CREATE INDEX IF NOT EXISTS idx_sms_campaigns_active ON sms_campaigns(is_active);
CREATE INDEX IF NOT EXISTS idx_sms_campaigns_type ON sms_campaigns(campaign_type);
CREATE INDEX IF NOT EXISTS idx_sms_campaign_sends_campaign ON sms_campaign_sends(campaign_id);
CREATE INDEX IF NOT EXISTS idx_sms_campaign_sends_user ON sms_campaign_sends(user_id);
CREATE INDEX IF NOT EXISTS idx_sms_campaign_sends_status ON sms_campaign_sends(status);
CREATE INDEX IF NOT EXISTS idx_sms_campaign_sends_sent_at ON sms_campaign_sends(sent_at);

-- STEP 6: Seed default campaigns
-- ============================================
INSERT INTO sms_campaigns (campaign_name, campaign_type, message_template, is_active, schedule_cron, target_audience) VALUES
(
  'Weekly Health Tips',
  'weekly_tips',
  'Hi {firstName}! 💡 Weekly Health Tip: {tipContent} Stay proactive about your hormone health! View your dashboard: {dashboardUrl}',
  true,
  '0 10 * * 1',
  '{"sms_enabled": true, "notification_preferences.weekly_tips": true}'
),
(
  'Monthly Assessment Reminder',
  'monthly_reminder',
  'Hi {firstName}! 📆 It''s been a month since your last assessment. Track your progress with a new EndoGuard assessment: {assessmentUrl}',
  true,
  '0 9 1 * *',
  '{"sms_enabled": true, "notification_preferences.monthly_reminder": true}'
),
(
  '7-Day Assessment Reminder',
  'assessment_reminder',
  'Hi {firstName}! 📅 It''s been 7 days since your last assessment. Ready to track your hormone health progress? {assessmentUrl}',
  true,
  null,
  '{"sms_enabled": true, "notification_preferences.assessment_reminder": true}'
),
(
  '14-Day Assessment Reminder',
  'assessment_reminder',
  'Hi {firstName}! 📅 It''s been 2 weeks since your last assessment. Let''s check in on your hormone health: {assessmentUrl}',
  true,
  null,
  '{"sms_enabled": true, "notification_preferences.assessment_reminder": true}'
),
(
  '30-Day Assessment Reminder',
  'assessment_reminder',
  'Hi {firstName}! 📅 It''s been 30 days since your last assessment. Time for a monthly check-in! {assessmentUrl}',
  true,
  null,
  '{"sms_enabled": true, "notification_preferences.assessment_reminder": true}'
)
ON CONFLICT (campaign_name) DO NOTHING;

-- STEP 7: Seed health tips
-- ============================================
INSERT INTO sms_health_tips (tip_content, category) VALUES
('Vitamin D supports hormone production. Aim for 15-20 minutes of sunlight daily or consider supplementation.', 'hormone_health'),
('Chronic stress elevates cortisol, which can disrupt other hormones. Try 10 minutes of meditation today.', 'stress'),
('Quality sleep (7-9 hours) is crucial for hormone regulation. Keep your bedroom cool and dark.', 'sleep'),
('Omega-3 fatty acids support hormone balance. Add fatty fish, walnuts, or flaxseeds to your diet.', 'nutrition'),
('Regular exercise helps regulate insulin and cortisol levels. Aim for 30 minutes of movement daily.', 'exercise'),
('Limit processed foods and sugar - they can spike insulin and disrupt hormone balance.', 'nutrition'),
('Magnesium supports over 300 hormone reactions. Consider foods like spinach, almonds, and dark chocolate.', 'hormone_health'),
('Intermittent fasting (12-16 hours) may improve insulin sensitivity and hormone balance.', 'nutrition'),
('High-intensity interval training (HIIT) can boost growth hormone naturally.', 'exercise'),
('Reduce endocrine disruptors: use glass containers instead of plastic, choose organic when possible.', 'hormone_health')
ON CONFLICT DO NOTHING;

-- ============================================
-- MIGRATION COMPLETE
-- ============================================
-- You can now use the SMS notification system!
-- Next steps:
-- 1. Configure Vercel Cron jobs in vercel.json
-- 2. Test SMS preferences at /settings/sms
-- 3. Monitor SMS delivery in sms_message_history table
