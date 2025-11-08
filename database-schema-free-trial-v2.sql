-- Nexus Biomedical Intelligence Database Schema
-- FREE TRIAL SYSTEM V2 (Platform-Specific + Beta Tester Support)
-- Migration script to add free trial functionality

-- ============================================
-- KEY FEATURES:
-- 1. Each platform has separate trial (can trial RxGuard, then PediCalc, etc.)
-- 2. Beta testers get 30-60 days free access (not a trial, full access)
-- 3. Regular users get 14-day trial per platform
-- 4. Usage limits per platform (100 checks for RxGuard, 50 for PediCalc, etc.)
-- ============================================

-- ============================================
-- STEP 1: Add user-level fields
-- ============================================

ALTER TABLE users ADD COLUMN IF NOT EXISTS phone_number VARCHAR(20);
ALTER TABLE users ADD COLUMN IF NOT EXISTS phone_verified BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS phone_verification_code VARCHAR(10);
ALTER TABLE users ADD COLUMN IF NOT EXISTS phone_verification_expires TIMESTAMP;
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_beta_tester BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS beta_access_expires TIMESTAMP; -- For beta testers: 30-60 days from signup

-- ============================================
-- STEP 2: Create platform_trials table (one trial per platform per user)
-- ============================================

CREATE TABLE IF NOT EXISTS platform_trials (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  platform VARCHAR(50) NOT NULL, -- 'RxGuard', 'PediCalc', 'MedWatch', etc.
  trial_start_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  trial_end_date TIMESTAMP NOT NULL,
  trial_status VARCHAR(20) DEFAULT 'active', -- 'active', 'expired', 'converted'
  trial_type VARCHAR(20) DEFAULT 'regular', -- 'regular' (14 days) or 'beta' (30-60 days)
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, platform) -- One trial per platform per user
);

-- ============================================
-- STEP 3: Create usage_tracking table
-- ============================================

CREATE TABLE IF NOT EXISTS usage_tracking (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  platform VARCHAR(50) NOT NULL, -- 'RxGuard', 'PediCalc', 'MedWatch', etc.
  action VARCHAR(50) NOT NULL, -- 'drug_check', 'dosing_calc', 'guideline_search', etc.
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_trial_usage BOOLEAN DEFAULT FALSE, -- TRUE if this was during trial period
  is_beta_usage BOOLEAN DEFAULT FALSE, -- TRUE if this was by beta tester
  metadata JSONB -- Store additional context (e.g., drug names, dosages, etc.)
);

-- ============================================
-- STEP 4: Create trial_limits table (per platform)
-- ============================================

CREATE TABLE IF NOT EXISTS trial_limits (
  id SERIAL PRIMARY KEY,
  platform VARCHAR(50) UNIQUE NOT NULL,
  regular_trial_days INTEGER NOT NULL, -- e.g., 14 days for regular users
  beta_trial_days INTEGER NOT NULL, -- e.g., 60 days for beta testers
  max_uses INTEGER NOT NULL, -- e.g., 100 drug checks for RxGuard
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- STEP 5: Insert default trial limits
-- ============================================

INSERT INTO trial_limits (platform, regular_trial_days, beta_trial_days, max_uses) VALUES
  ('RxGuard', 14, 60, 100),
  ('PediCalc', 14, 60, 50),
  ('MedWatch', 14, 60, 100),
  ('ElderWatch', 14, 60, 100),
  ('ReguReady', 14, 60, 50),
  ('ClinicalIQ', 14, 60, 100)
ON CONFLICT (platform) DO UPDATE SET
  regular_trial_days = EXCLUDED.regular_trial_days,
  beta_trial_days = EXCLUDED.beta_trial_days,
  max_uses = EXCLUDED.max_uses;

-- ============================================
-- STEP 6: Update platform_access table
-- ============================================

-- Add trial_id column to link access to specific trial
ALTER TABLE platform_access ADD COLUMN IF NOT EXISTS trial_id INTEGER REFERENCES platform_trials(id) ON DELETE SET NULL;

-- ============================================
-- STEP 7: Create indexes for performance
-- ============================================

CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone_number);
CREATE INDEX IF NOT EXISTS idx_users_is_beta ON users(is_beta_tester);
CREATE INDEX IF NOT EXISTS idx_platform_trials_user_id ON platform_trials(user_id);
CREATE INDEX IF NOT EXISTS idx_platform_trials_platform ON platform_trials(platform);
CREATE INDEX IF NOT EXISTS idx_platform_trials_status ON platform_trials(trial_status);
CREATE INDEX IF NOT EXISTS idx_usage_tracking_user_id ON usage_tracking(user_id);
CREATE INDEX IF NOT EXISTS idx_usage_tracking_platform ON usage_tracking(platform);
CREATE INDEX IF NOT EXISTS idx_usage_tracking_timestamp ON usage_tracking(timestamp);
CREATE INDEX IF NOT EXISTS idx_usage_tracking_trial ON usage_tracking(is_trial_usage);
CREATE INDEX IF NOT EXISTS idx_usage_tracking_beta ON usage_tracking(is_beta_usage);

-- ============================================
-- STEP 8: Create helper functions
-- ============================================

-- Function to check if user can access a platform
CREATE OR REPLACE FUNCTION can_access_platform(p_user_id INTEGER, p_platform VARCHAR)
RETURNS TABLE(
  can_access BOOLEAN,
  access_type VARCHAR, -- 'paid', 'trial', 'beta', 'none'
  trial_days_remaining INTEGER,
  usage_count BIGINT,
  usage_limit INTEGER,
  message TEXT
) AS $$
DECLARE
  v_is_beta BOOLEAN;
  v_beta_expires TIMESTAMP;
  v_has_subscription BOOLEAN;
  v_trial_status VARCHAR;
  v_trial_end TIMESTAMP;
  v_usage_count BIGINT;
  v_usage_limit INTEGER;
  v_days_remaining INTEGER;
BEGIN
  -- Check if user is beta tester
  SELECT is_beta_tester, beta_access_expires 
  INTO v_is_beta, v_beta_expires
  FROM users 
  WHERE id = p_user_id;
  
  -- Check if user has paid subscription for this platform
  SELECT EXISTS(
    SELECT 1 FROM platform_access pa
    JOIN subscriptions s ON pa.subscription_id = s.id
    WHERE pa.user_id = p_user_id 
      AND pa.platform = p_platform 
      AND pa.is_active = TRUE
      AND s.status = 'active'
  ) INTO v_has_subscription;
  
  -- If paid subscription, grant access
  IF v_has_subscription THEN
    RETURN QUERY SELECT 
      TRUE, 
      'paid'::VARCHAR, 
      NULL::INTEGER, 
      NULL::BIGINT, 
      NULL::INTEGER,
      'Full access via subscription'::TEXT;
    RETURN;
  END IF;
  
  -- If beta tester with valid access, grant access
  IF v_is_beta AND v_beta_expires > CURRENT_TIMESTAMP THEN
    -- Count beta usage
    SELECT COUNT(*) INTO v_usage_count
    FROM usage_tracking
    WHERE user_id = p_user_id 
      AND platform = p_platform 
      AND is_beta_usage = TRUE;
    
    -- Get usage limit
    SELECT max_uses INTO v_usage_limit
    FROM trial_limits
    WHERE platform = p_platform;
    
    -- Calculate days remaining
    v_days_remaining := EXTRACT(DAY FROM (v_beta_expires - CURRENT_TIMESTAMP));
    
    -- Check if under usage limit
    IF v_usage_count < v_usage_limit THEN
      RETURN QUERY SELECT 
        TRUE, 
        'beta'::VARCHAR, 
        v_days_remaining, 
        v_usage_count, 
        v_usage_limit,
        'Beta tester access'::TEXT;
      RETURN;
    ELSE
      RETURN QUERY SELECT 
        FALSE, 
        'beta'::VARCHAR, 
        v_days_remaining, 
        v_usage_count, 
        v_usage_limit,
        'Beta usage limit reached. Please upgrade to continue.'::TEXT;
      RETURN;
    END IF;
  END IF;
  
  -- Check if user has active trial for this platform
  SELECT trial_status, trial_end_date
  INTO v_trial_status, v_trial_end
  FROM platform_trials
  WHERE user_id = p_user_id AND platform = p_platform;
  
  -- If active trial exists
  IF v_trial_status = 'active' AND v_trial_end > CURRENT_TIMESTAMP THEN
    -- Count trial usage
    SELECT COUNT(*) INTO v_usage_count
    FROM usage_tracking
    WHERE user_id = p_user_id 
      AND platform = p_platform 
      AND is_trial_usage = TRUE;
    
    -- Get usage limit
    SELECT max_uses INTO v_usage_limit
    FROM trial_limits
    WHERE platform = p_platform;
    
    -- Calculate days remaining
    v_days_remaining := EXTRACT(DAY FROM (v_trial_end - CURRENT_TIMESTAMP));
    
    -- Check if under usage limit
    IF v_usage_count < v_usage_limit THEN
      RETURN QUERY SELECT 
        TRUE, 
        'trial'::VARCHAR, 
        v_days_remaining, 
        v_usage_count, 
        v_usage_limit,
        'Free trial access'::TEXT;
      RETURN;
    ELSE
      RETURN QUERY SELECT 
        FALSE, 
        'trial'::VARCHAR, 
        v_days_remaining, 
        v_usage_count, 
        v_usage_limit,
        'Trial usage limit reached. Please upgrade to continue.'::TEXT;
      RETURN;
    END IF;
  END IF;
  
  -- No access
  RETURN QUERY SELECT 
    FALSE, 
    'none'::VARCHAR, 
    NULL::INTEGER, 
    NULL::BIGINT, 
    NULL::INTEGER,
    'No access. Start free trial or subscribe.'::TEXT;
END;
$$ LANGUAGE plpgsql;

-- Function to activate trial for a platform
CREATE OR REPLACE FUNCTION activate_platform_trial(
  p_user_id INTEGER, 
  p_platform VARCHAR,
  p_is_beta BOOLEAN DEFAULT FALSE
)
RETURNS TABLE(
  success BOOLEAN,
  trial_id INTEGER,
  end_date TIMESTAMP,
  message TEXT
) AS $$
DECLARE
  v_trial_days INTEGER;
  v_trial_end TIMESTAMP;
  v_new_trial_id INTEGER;
  v_trial_type VARCHAR;
BEGIN
  -- Check if trial already exists for this platform
  IF EXISTS(
    SELECT 1 FROM platform_trials 
    WHERE user_id = p_user_id AND platform = p_platform
  ) THEN
    RETURN QUERY SELECT 
      FALSE, 
      NULL::INTEGER, 
      NULL::TIMESTAMP,
      'Trial already used for this platform'::TEXT;
    RETURN;
  END IF;
  
  -- Get trial duration based on user type
  IF p_is_beta THEN
    SELECT beta_trial_days INTO v_trial_days
    FROM trial_limits WHERE platform = p_platform;
    v_trial_type := 'beta';
  ELSE
    SELECT regular_trial_days INTO v_trial_days
    FROM trial_limits WHERE platform = p_platform;
    v_trial_type := 'regular';
  END IF;
  
  -- Calculate end date
  v_trial_end := CURRENT_TIMESTAMP + (v_trial_days || ' days')::INTERVAL;
  
  -- Create trial record
  INSERT INTO platform_trials (user_id, platform, trial_end_date, trial_type)
  VALUES (p_user_id, p_platform, v_trial_end, v_trial_type)
  RETURNING id INTO v_new_trial_id;
  
  -- Grant platform access
  INSERT INTO platform_access (user_id, platform, trial_id, access_expires_at, is_active)
  VALUES (p_user_id, p_platform, v_new_trial_id, v_trial_end, TRUE)
  ON CONFLICT (user_id, platform) 
  DO UPDATE SET 
    trial_id = v_new_trial_id,
    access_expires_at = v_trial_end,
    is_active = TRUE;
  
  -- Log event
  INSERT INTO audit_log (user_id, event_type, event_data)
  VALUES (p_user_id, 'trial_activated', jsonb_build_object(
    'platform', p_platform,
    'trial_type', v_trial_type,
    'trial_days', v_trial_days
  ));
  
  RETURN QUERY SELECT 
    TRUE, 
    v_new_trial_id, 
    v_trial_end,
    'Trial activated successfully'::TEXT;
END;
$$ LANGUAGE plpgsql;

-- Function to mark user as beta tester
CREATE OR REPLACE FUNCTION grant_beta_access(
  p_user_id INTEGER,
  p_beta_days INTEGER DEFAULT 60
)
RETURNS BOOLEAN AS $$
DECLARE
  v_beta_expires TIMESTAMP;
BEGIN
  v_beta_expires := CURRENT_TIMESTAMP + (p_beta_days || ' days')::INTERVAL;
  
  UPDATE users
  SET 
    is_beta_tester = TRUE,
    beta_access_expires = v_beta_expires
  WHERE id = p_user_id;
  
  -- Log event
  INSERT INTO audit_log (user_id, event_type, event_data)
  VALUES (p_user_id, 'beta_access_granted', jsonb_build_object(
    'beta_days', p_beta_days,
    'expires', v_beta_expires
  ));
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- Function to track usage
CREATE OR REPLACE FUNCTION track_platform_usage(
  p_user_id INTEGER,
  p_platform VARCHAR,
  p_action VARCHAR,
  p_metadata JSONB DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
  v_is_trial BOOLEAN;
  v_is_beta BOOLEAN;
BEGIN
  -- Check if user is on trial for this platform
  SELECT EXISTS(
    SELECT 1 FROM platform_trials
    WHERE user_id = p_user_id 
      AND platform = p_platform 
      AND trial_status = 'active'
      AND trial_end_date > CURRENT_TIMESTAMP
  ) INTO v_is_trial;
  
  -- Check if user is beta tester
  SELECT is_beta_tester INTO v_is_beta
  FROM users WHERE id = p_user_id;
  
  -- Insert usage record
  INSERT INTO usage_tracking (user_id, platform, action, is_trial_usage, is_beta_usage, metadata)
  VALUES (p_user_id, p_platform, p_action, v_is_trial, v_is_beta, p_metadata);
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- Function to expire trials (run periodically via cron)
CREATE OR REPLACE FUNCTION expire_platform_trials()
RETURNS INTEGER AS $$
DECLARE
  v_expired_count INTEGER;
BEGIN
  -- Update expired trials
  UPDATE platform_trials
  SET trial_status = 'expired'
  WHERE trial_status = 'active' 
    AND trial_end_date < CURRENT_TIMESTAMP;
  
  GET DIAGNOSTICS v_expired_count = ROW_COUNT;
  
  -- Revoke access for expired trials (only if no paid subscription)
  UPDATE platform_access pa
  SET is_active = FALSE
  WHERE pa.trial_id IN (
    SELECT id FROM platform_trials WHERE trial_status = 'expired'
  )
  AND pa.subscription_id IS NULL;
  
  RETURN v_expired_count;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- STEP 9: Add trigger to update updated_at
-- ============================================

CREATE TRIGGER update_platform_trials_updated_at 
BEFORE UPDATE ON platform_trials 
FOR EACH ROW 
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_trial_limits_updated_at 
BEFORE UPDATE ON trial_limits 
FOR EACH ROW 
EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- MIGRATION COMPLETE
-- ============================================

-- USAGE EXAMPLES:

-- 1. Grant beta access to a user (60 days):
-- SELECT grant_beta_access(1, 60);

-- 2. Activate trial for a platform (regular user):
-- SELECT * FROM activate_platform_trial(1, 'RxGuard', FALSE);

-- 3. Activate trial for a platform (beta user):
-- SELECT * FROM activate_platform_trial(1, 'PediCalc', TRUE);

-- 4. Check if user can access a platform:
-- SELECT * FROM can_access_platform(1, 'RxGuard');

-- 5. Track usage:
-- SELECT track_platform_usage(1, 'RxGuard', 'drug_check', '{"drug": "Warfarin"}'::jsonb);

-- 6. Expire trials (run via cron every hour):
-- SELECT expire_platform_trials();

