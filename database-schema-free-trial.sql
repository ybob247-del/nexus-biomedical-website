-- Nexus Biomedical Intelligence Database Schema
-- FREE TRIAL SYSTEM (Twilio-Style - No Credit Card Required)
-- Migration script to add free trial functionality

-- ============================================
-- STEP 1: Add trial fields to users table
-- ============================================

ALTER TABLE users ADD COLUMN IF NOT EXISTS phone_number VARCHAR(20);
ALTER TABLE users ADD COLUMN IF NOT EXISTS phone_verified BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS phone_verification_code VARCHAR(10);
ALTER TABLE users ADD COLUMN IF NOT EXISTS phone_verification_expires TIMESTAMP;
ALTER TABLE users ADD COLUMN IF NOT EXISTS trial_start_date TIMESTAMP;
ALTER TABLE users ADD COLUMN IF NOT EXISTS trial_end_date TIMESTAMP;
ALTER TABLE users ADD COLUMN IF NOT EXISTS trial_status VARCHAR(20) DEFAULT 'inactive'; -- 'inactive', 'active', 'expired', 'converted'
ALTER TABLE users ADD COLUMN IF NOT EXISTS trial_platform VARCHAR(100); -- Which platform they're trialing

-- ============================================
-- STEP 2: Create usage_tracking table
-- ============================================

CREATE TABLE IF NOT EXISTS usage_tracking (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  platform VARCHAR(50) NOT NULL, -- 'RxGuard', 'PediCalc', 'MedWatch', etc.
  action VARCHAR(50) NOT NULL, -- 'drug_check', 'dosing_calc', 'guideline_search', etc.
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  trial_usage BOOLEAN DEFAULT FALSE, -- TRUE if this was during trial period
  metadata JSONB -- Store additional context (e.g., drug names, dosages, etc.)
);

-- ============================================
-- STEP 3: Create trial_limits table
-- ============================================

CREATE TABLE IF NOT EXISTS trial_limits (
  id SERIAL PRIMARY KEY,
  platform VARCHAR(50) UNIQUE NOT NULL,
  max_uses INTEGER NOT NULL, -- e.g., 100 drug checks for RxGuard
  trial_duration_days INTEGER NOT NULL, -- e.g., 14 days
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- STEP 4: Insert default trial limits
-- ============================================

INSERT INTO trial_limits (platform, max_uses, trial_duration_days) VALUES
  ('RxGuard', 100, 14),
  ('PediCalc', 50, 14),
  ('MedWatch', 100, 14),
  ('ElderWatch', 100, 14),
  ('ReguReady', 50, 14),
  ('ClinicalIQ', 100, 14)
ON CONFLICT (platform) DO NOTHING;

-- ============================================
-- STEP 5: Create indexes for performance
-- ============================================

CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone_number);
CREATE INDEX IF NOT EXISTS idx_users_trial_status ON users(trial_status);
CREATE INDEX IF NOT EXISTS idx_usage_tracking_user_id ON usage_tracking(user_id);
CREATE INDEX IF NOT EXISTS idx_usage_tracking_platform ON usage_tracking(platform);
CREATE INDEX IF NOT EXISTS idx_usage_tracking_timestamp ON usage_tracking(timestamp);
CREATE INDEX IF NOT EXISTS idx_usage_tracking_trial ON usage_tracking(trial_usage);

-- ============================================
-- STEP 6: Create helper functions
-- ============================================

-- Function to check if user has exceeded trial limits
CREATE OR REPLACE FUNCTION check_trial_usage(p_user_id INTEGER, p_platform VARCHAR)
RETURNS TABLE(
  usage_count BIGINT,
  max_uses INTEGER,
  trial_days_remaining INTEGER,
  can_use BOOLEAN
) AS $$
DECLARE
  v_trial_start TIMESTAMP;
  v_trial_end TIMESTAMP;
  v_usage_count BIGINT;
  v_max_uses INTEGER;
  v_trial_duration INTEGER;
  v_days_remaining INTEGER;
BEGIN
  -- Get user's trial dates
  SELECT trial_start_date, trial_end_date 
  INTO v_trial_start, v_trial_end
  FROM users 
  WHERE id = p_user_id;
  
  -- Get platform limits
  SELECT max_uses, trial_duration_days
  INTO v_max_uses, v_trial_duration
  FROM trial_limits
  WHERE platform = p_platform;
  
  -- Count usage
  SELECT COUNT(*)
  INTO v_usage_count
  FROM usage_tracking
  WHERE user_id = p_user_id 
    AND platform = p_platform 
    AND trial_usage = TRUE;
  
  -- Calculate days remaining
  v_days_remaining := EXTRACT(DAY FROM (v_trial_end - CURRENT_TIMESTAMP));
  
  -- Return results
  RETURN QUERY SELECT 
    v_usage_count,
    v_max_uses,
    v_days_remaining,
    (v_usage_count < v_max_uses AND CURRENT_TIMESTAMP < v_trial_end) AS can_use;
END;
$$ LANGUAGE plpgsql;

-- Function to activate trial for user
CREATE OR REPLACE FUNCTION activate_trial(p_user_id INTEGER, p_platform VARCHAR)
RETURNS BOOLEAN AS $$
DECLARE
  v_trial_duration INTEGER;
BEGIN
  -- Get trial duration for platform
  SELECT trial_duration_days 
  INTO v_trial_duration
  FROM trial_limits
  WHERE platform = p_platform;
  
  -- Update user record
  UPDATE users
  SET 
    trial_start_date = CURRENT_TIMESTAMP,
    trial_end_date = CURRENT_TIMESTAMP + (v_trial_duration || ' days')::INTERVAL,
    trial_status = 'active',
    trial_platform = p_platform
  WHERE id = p_user_id;
  
  -- Grant platform access
  INSERT INTO platform_access (user_id, platform, access_expires_at, is_active)
  VALUES (p_user_id, p_platform, CURRENT_TIMESTAMP + (v_trial_duration || ' days')::INTERVAL, TRUE)
  ON CONFLICT (user_id, platform) 
  DO UPDATE SET 
    access_expires_at = EXCLUDED.access_expires_at,
    is_active = TRUE;
  
  -- Log event
  INSERT INTO audit_log (user_id, event_type, event_data)
  VALUES (p_user_id, 'trial_activated', jsonb_build_object('platform', p_platform));
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- Function to expire trial
CREATE OR REPLACE FUNCTION expire_trial(p_user_id INTEGER)
RETURNS BOOLEAN AS $$
BEGIN
  -- Update user status
  UPDATE users
  SET trial_status = 'expired'
  WHERE id = p_user_id AND trial_status = 'active';
  
  -- Revoke platform access (only for trial users without paid subscription)
  UPDATE platform_access
  SET is_active = FALSE
  WHERE user_id = p_user_id 
    AND subscription_id IS NULL;
  
  -- Log event
  INSERT INTO audit_log (user_id, event_type, event_data)
  VALUES (p_user_id, 'trial_expired', jsonb_build_object('timestamp', CURRENT_TIMESTAMP));
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- Function to convert trial to paid
CREATE OR REPLACE FUNCTION convert_trial_to_paid(p_user_id INTEGER, p_subscription_id INTEGER)
RETURNS BOOLEAN AS $$
BEGIN
  -- Update user status
  UPDATE users
  SET trial_status = 'converted'
  WHERE id = p_user_id;
  
  -- Update platform access with subscription
  UPDATE platform_access
  SET subscription_id = p_subscription_id
  WHERE user_id = p_user_id;
  
  -- Log event
  INSERT INTO audit_log (user_id, event_type, event_data)
  VALUES (p_user_id, 'trial_converted', jsonb_build_object('subscription_id', p_subscription_id));
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- STEP 7: Create trigger to auto-expire trials
-- ============================================

CREATE OR REPLACE FUNCTION check_expired_trials()
RETURNS void AS $$
BEGIN
  -- Find all active trials that have expired
  UPDATE users
  SET trial_status = 'expired'
  WHERE trial_status = 'active' 
    AND trial_end_date < CURRENT_TIMESTAMP;
  
  -- Revoke access for expired trials
  UPDATE platform_access
  SET is_active = FALSE
  WHERE user_id IN (
    SELECT id FROM users WHERE trial_status = 'expired'
  )
  AND subscription_id IS NULL;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- STEP 8: Add trigger to update updated_at
-- ============================================

CREATE TRIGGER update_trial_limits_updated_at 
BEFORE UPDATE ON trial_limits 
FOR EACH ROW 
EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- MIGRATION COMPLETE
-- ============================================

-- To run this migration:
-- 1. Connect to your Vercel Postgres database
-- 2. Run this entire SQL file
-- 3. Verify tables and functions were created successfully

-- To check trial status for a user:
-- SELECT * FROM check_trial_usage(1, 'RxGuard');

-- To activate trial for a user:
-- SELECT activate_trial(1, 'RxGuard');

-- To manually expire trials (run this periodically via cron):
-- SELECT check_expired_trials();

