-- Migration: Add notification_preferences column to users table
-- Date: Nov 29, 2025
-- Purpose: Allow users to customize which SMS notifications they receive

-- Add notification_preferences column (JSONB for flexibility)
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
