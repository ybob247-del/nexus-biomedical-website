-- Complete Database Schema for Nexus Biomedical Intelligence
-- Includes: Users, Authentication, Free Trial System, Platform Access

-- ============================================
-- 1. USERS TABLE (Base)
-- ============================================

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255),
  name VARCHAR(255),
  phone VARCHAR(50),
  
  -- Beta tester fields
  is_beta_tester BOOLEAN DEFAULT FALSE,
  beta_access_expires TIMESTAMP,
  beta_granted_at TIMESTAMP,
  
  -- Account status
  email_verified BOOLEAN DEFAULT FALSE,
  phone_verified BOOLEAN DEFAULT FALSE,
  account_status VARCHAR(50) DEFAULT 'active', -- active, suspended, deleted
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  last_login_at TIMESTAMP
);

-- ============================================
-- 2. PLATFORMS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS platforms (
  id SERIAL PRIMARY KEY,
  platform_key VARCHAR(50) UNIQUE NOT NULL, -- rxguard, pedicalc, etc.
  platform_name VARCHAR(255) NOT NULL,
  description TEXT,
  price_monthly DECIMAL(10,2),
  trial_days INTEGER DEFAULT 14,
  trial_usage_limit INTEGER, -- e.g., 100 checks for RxGuard
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Insert 6 platforms
INSERT INTO platforms (platform_key, platform_name, description, price_monthly, trial_days, trial_usage_limit) VALUES
('rxguard', 'RxGuard™', 'Drug interaction detection system', 49.00, 14, 100),
('pedicalc', 'PediCalc Pro™', 'Pediatric dosing calculator', 39.00, 14, 50),
('medwatch', 'MedWatch™', 'Medication monitoring system', 39.00, 14, 75),
('elderwatch', 'ElderWatch™', 'Geriatric safety alerts', 39.00, 14, 75),
('reguready', 'ReguReady™', 'Regulatory compliance tracker', 59.00, 14, 50),
('clinicaliq', 'ClinicalIQ™', 'Clinical decision support', 69.00, 14, 100)
ON CONFLICT (platform_key) DO NOTHING;

-- ============================================
-- 3. PLATFORM TRIALS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS platform_trials (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  platform_id INTEGER REFERENCES platforms(id) ON DELETE CASCADE,
  
  -- Trial details
  trial_started_at TIMESTAMP DEFAULT NOW(),
  trial_expires_at TIMESTAMP NOT NULL,
  trial_status VARCHAR(50) DEFAULT 'active', -- active, expired, upgraded
  
  -- Usage tracking
  usage_count INTEGER DEFAULT 0,
  usage_limit INTEGER NOT NULL,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  -- Ensure one trial per user per platform
  UNIQUE(user_id, platform_id)
);

-- ============================================
-- 4. USAGE TRACKING TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS usage_tracking (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  platform_id INTEGER REFERENCES platforms(id) ON DELETE CASCADE,
  
  -- Usage details
  action_type VARCHAR(100), -- e.g., 'drug_check', 'dose_calculation'
  action_details JSONB,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- 5. SUBSCRIPTIONS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS subscriptions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  platform_id INTEGER REFERENCES platforms(id) ON DELETE CASCADE,
  
  -- Stripe details
  stripe_subscription_id VARCHAR(255) UNIQUE,
  stripe_customer_id VARCHAR(255),
  
  -- Subscription details
  status VARCHAR(50) DEFAULT 'active', -- active, canceled, past_due
  current_period_start TIMESTAMP,
  current_period_end TIMESTAMP,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  
  -- Pricing
  amount DECIMAL(10,2),
  currency VARCHAR(10) DEFAULT 'usd',
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  canceled_at TIMESTAMP
);

-- ============================================
-- 6. BETA INVITES TABLE (for tracking)
-- ============================================

CREATE TABLE IF NOT EXISTS beta_invites (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  days INTEGER NOT NULL,
  invited_at TIMESTAMP DEFAULT NOW(),
  accepted_at TIMESTAMP,
  user_id INTEGER REFERENCES users(id) ON DELETE SET NULL
);

-- ============================================
-- 7. HELPER FUNCTIONS
-- ============================================

-- Function: Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger: Auto-update updated_at for users
CREATE TRIGGER update_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Trigger: Auto-update updated_at for platform_trials
CREATE TRIGGER update_platform_trials_updated_at
BEFORE UPDATE ON platform_trials
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Trigger: Auto-update updated_at for subscriptions
CREATE TRIGGER update_subscriptions_updated_at
BEFORE UPDATE ON subscriptions
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 8. ACCESS CONTROL FUNCTIONS
-- ============================================

-- Function: Check if user can access platform
CREATE OR REPLACE FUNCTION can_access_platform(
  p_user_id INTEGER,
  p_platform_key VARCHAR
)
RETURNS BOOLEAN AS $$
DECLARE
  v_is_beta BOOLEAN;
  v_beta_expires TIMESTAMP;
  v_has_subscription BOOLEAN;
  v_has_active_trial BOOLEAN;
  v_platform_id INTEGER;
BEGIN
  -- Get platform ID
  SELECT id INTO v_platform_id FROM platforms WHERE platform_key = p_platform_key;
  
  -- Check if beta tester with active access
  SELECT is_beta_tester, beta_access_expires 
  INTO v_is_beta, v_beta_expires
  FROM users 
  WHERE id = p_user_id;
  
  IF v_is_beta AND v_beta_expires > NOW() THEN
    RETURN TRUE;
  END IF;
  
  -- Check if has active subscription
  SELECT EXISTS(
    SELECT 1 FROM subscriptions 
    WHERE user_id = p_user_id 
    AND platform_id = v_platform_id
    AND status = 'active'
    AND current_period_end > NOW()
  ) INTO v_has_subscription;
  
  IF v_has_subscription THEN
    RETURN TRUE;
  END IF;
  
  -- Check if has active trial
  SELECT EXISTS(
    SELECT 1 FROM platform_trials 
    WHERE user_id = p_user_id 
    AND platform_id = v_platform_id
    AND trial_status = 'active'
    AND trial_expires_at > NOW()
  ) INTO v_has_active_trial;
  
  RETURN v_has_active_trial;
END;
$$ LANGUAGE plpgsql;

-- Function: Grant beta access
CREATE OR REPLACE FUNCTION grant_beta_access(
  p_user_id INTEGER,
  p_days INTEGER
)
RETURNS VOID AS $$
BEGIN
  UPDATE users
  SET 
    is_beta_tester = TRUE,
    beta_access_expires = NOW() + (p_days || ' days')::INTERVAL,
    beta_granted_at = NOW()
  WHERE id = p_user_id;
END;
$$ LANGUAGE plpgsql;

-- Function: Activate platform trial
CREATE OR REPLACE FUNCTION activate_platform_trial(
  p_user_id INTEGER,
  p_platform_key VARCHAR
)
RETURNS BOOLEAN AS $$
DECLARE
  v_platform_id INTEGER;
  v_trial_days INTEGER;
  v_usage_limit INTEGER;
  v_existing_trial INTEGER;
BEGIN
  -- Get platform details
  SELECT id, trial_days, trial_usage_limit 
  INTO v_platform_id, v_trial_days, v_usage_limit
  FROM platforms 
  WHERE platform_key = p_platform_key;
  
  -- Check if trial already exists
  SELECT id INTO v_existing_trial
  FROM platform_trials
  WHERE user_id = p_user_id AND platform_id = v_platform_id;
  
  IF v_existing_trial IS NOT NULL THEN
    RETURN FALSE; -- Trial already exists
  END IF;
  
  -- Create new trial
  INSERT INTO platform_trials (
    user_id, 
    platform_id, 
    trial_expires_at, 
    usage_limit
  ) VALUES (
    p_user_id,
    v_platform_id,
    NOW() + (v_trial_days || ' days')::INTERVAL,
    v_usage_limit
  );
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- Function: Track usage
CREATE OR REPLACE FUNCTION track_usage(
  p_user_id INTEGER,
  p_platform_key VARCHAR,
  p_action_type VARCHAR,
  p_action_details JSONB DEFAULT '{}'::JSONB
)
RETURNS BOOLEAN AS $$
DECLARE
  v_platform_id INTEGER;
  v_trial_id INTEGER;
  v_usage_count INTEGER;
  v_usage_limit INTEGER;
BEGIN
  -- Get platform ID
  SELECT id INTO v_platform_id FROM platforms WHERE platform_key = p_platform_key;
  
  -- Insert usage record
  INSERT INTO usage_tracking (user_id, platform_id, action_type, action_details)
  VALUES (p_user_id, v_platform_id, p_action_type, p_action_details);
  
  -- Update trial usage count if applicable
  SELECT id, usage_count, usage_limit
  INTO v_trial_id, v_usage_count, v_usage_limit
  FROM platform_trials
  WHERE user_id = p_user_id 
  AND platform_id = v_platform_id
  AND trial_status = 'active';
  
  IF v_trial_id IS NOT NULL THEN
    UPDATE platform_trials
    SET usage_count = usage_count + 1
    WHERE id = v_trial_id;
    
    -- Check if limit exceeded
    IF v_usage_count + 1 >= v_usage_limit THEN
      UPDATE platform_trials
      SET trial_status = 'expired'
      WHERE id = v_trial_id;
      RETURN FALSE; -- Limit exceeded
    END IF;
  END IF;
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 9. INDEXES FOR PERFORMANCE
-- ============================================

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_beta ON users(is_beta_tester, beta_access_expires);
CREATE INDEX IF NOT EXISTS idx_platform_trials_user ON platform_trials(user_id);
CREATE INDEX IF NOT EXISTS idx_platform_trials_status ON platform_trials(trial_status, trial_expires_at);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status, current_period_end);
CREATE INDEX IF NOT EXISTS idx_usage_tracking_user ON usage_tracking(user_id, platform_id);

-- ============================================
-- DONE!
-- ============================================

SELECT 'Database schema created successfully!' AS status;

