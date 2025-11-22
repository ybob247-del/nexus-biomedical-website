-- ============================================
-- FREE TRIAL SYSTEM - Complete Implementation
-- ============================================

-- 1. PLATFORMS TABLE
-- Defines available platforms and their trial configurations
CREATE TABLE IF NOT EXISTS platforms (
  id SERIAL PRIMARY KEY,
  platform_key VARCHAR(50) UNIQUE NOT NULL, -- rxguard, endoguard, etc.
  platform_name VARCHAR(255) NOT NULL,
  description TEXT,
  price_monthly DECIMAL(10,2) NOT NULL,
  trial_days INTEGER NOT NULL DEFAULT 14,
  trial_usage_limit INTEGER, -- Optional usage limit during trial
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Insert RxGuard and EndoGuard platforms
INSERT INTO platforms (platform_key, platform_name, description, price_monthly, trial_days, trial_usage_limit) VALUES
('rxguard', 'RxGuard™', 'AI-powered medication interaction checker', 39.00, 14, 100),
('endoguard', 'EndoGuard™', 'Clinical-grade hormone intelligence platform', 97.00, 30, 10)
ON CONFLICT (platform_key) DO UPDATE 
SET price_monthly = EXCLUDED.price_monthly, 
    trial_days = EXCLUDED.trial_days,
    trial_usage_limit = EXCLUDED.trial_usage_limit,
    updated_at = NOW();

-- 2. USERS TABLE
-- Extended with trial and subscription tracking
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  phone VARCHAR(50),
  
  -- Account status
  email_verified BOOLEAN DEFAULT FALSE,
  phone_verified BOOLEAN DEFAULT FALSE,
  account_status VARCHAR(50) DEFAULT 'active', -- active, suspended, deleted
  
  -- Beta tester fields
  is_beta_tester BOOLEAN DEFAULT FALSE,
  beta_access_expires TIMESTAMP,
  beta_granted_at TIMESTAMP,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  last_login_at TIMESTAMP
);

-- 3. PLATFORM_TRIALS TABLE
-- Tracks individual platform trials for each user
CREATE TABLE IF NOT EXISTS platform_trials (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  platform_id INTEGER NOT NULL REFERENCES platforms(id) ON DELETE CASCADE,
  
  -- Trial period
  trial_started_at TIMESTAMP NOT NULL DEFAULT NOW(),
  trial_expires_at TIMESTAMP NOT NULL,
  trial_status VARCHAR(50) NOT NULL DEFAULT 'active', -- active, expired, upgraded, cancelled
  
  -- Usage tracking
  usage_count INTEGER DEFAULT 0,
  usage_limit INTEGER,
  
  -- Email notifications sent
  welcome_email_sent BOOLEAN DEFAULT FALSE,
  halfway_email_sent BOOLEAN DEFAULT FALSE, -- 50%
  quarter_email_sent BOOLEAN DEFAULT FALSE, -- 25%
  oneday_email_sent BOOLEAN DEFAULT FALSE,  -- 1 day before
  expired_email_sent BOOLEAN DEFAULT FALSE,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  -- Ensure one trial per user per platform
  UNIQUE(user_id, platform_id)
);

-- 4. SUBSCRIPTIONS TABLE
-- Tracks paid subscriptions after trial
CREATE TABLE IF NOT EXISTS subscriptions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  platform_id INTEGER NOT NULL REFERENCES platforms(id) ON DELETE CASCADE,
  
  -- Stripe integration
  stripe_customer_id VARCHAR(255),
  stripe_subscription_id VARCHAR(255) UNIQUE,
  stripe_price_id VARCHAR(255),
  
  -- Subscription details
  status VARCHAR(50) NOT NULL DEFAULT 'active', -- active, cancelled, past_due, unpaid
  current_period_start TIMESTAMP,
  current_period_end TIMESTAMP,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  cancelled_at TIMESTAMP,
  
  -- Pricing
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  interval VARCHAR(20) DEFAULT 'month', -- month, year
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  -- One active subscription per user per platform
  UNIQUE(user_id, platform_id)
);

-- 5. USAGE_TRACKING TABLE
-- Tracks platform usage for analytics and limits
CREATE TABLE IF NOT EXISTS usage_tracking (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  platform_id INTEGER NOT NULL REFERENCES platforms(id) ON DELETE CASCADE,
  trial_id INTEGER REFERENCES platform_trials(id) ON DELETE SET NULL,
  
  -- Usage details
  action_type VARCHAR(100) NOT NULL, -- e.g., 'drug_check', 'hormone_assessment'
  action_details JSONB,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW()
);

-- 6. EMAIL_NOTIFICATIONS TABLE
-- Log of all emails sent for auditing
CREATE TABLE IF NOT EXISTS email_notifications (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  trial_id INTEGER REFERENCES platform_trials(id) ON DELETE SET NULL,
  
  -- Email details
  email_type VARCHAR(100) NOT NULL, -- welcome, trial_50, trial_25, trial_1day, trial_expired
  email_to VARCHAR(255) NOT NULL,
  subject VARCHAR(500),
  sent_at TIMESTAMP DEFAULT NOW(),
  status VARCHAR(50) DEFAULT 'sent', -- sent, failed, bounced
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================

CREATE INDEX IF NOT EXISTS idx_platform_trials_user_id ON platform_trials(user_id);
CREATE INDEX IF NOT EXISTS idx_platform_trials_status ON platform_trials(trial_status);
CREATE INDEX IF NOT EXISTS idx_platform_trials_expires ON platform_trials(trial_expires_at);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_id ON subscriptions(stripe_subscription_id);
CREATE INDEX IF NOT EXISTS idx_usage_tracking_user_platform ON usage_tracking(user_id, platform_id);
CREATE INDEX IF NOT EXISTS idx_email_notifications_user ON email_notifications(user_id);

-- ============================================
-- HELPER FUNCTIONS
-- ============================================

-- Function to check if user has active trial or subscription for a platform
CREATE OR REPLACE FUNCTION has_platform_access(p_user_id INTEGER, p_platform_key VARCHAR)
RETURNS BOOLEAN AS $$
DECLARE
  v_platform_id INTEGER;
  v_has_trial BOOLEAN;
  v_has_subscription BOOLEAN;
BEGIN
  -- Get platform ID
  SELECT id INTO v_platform_id FROM platforms WHERE platform_key = p_platform_key AND is_active = TRUE;
  
  IF v_platform_id IS NULL THEN
    RETURN FALSE;
  END IF;
  
  -- Check for active trial
  SELECT EXISTS(
    SELECT 1 FROM platform_trials 
    WHERE user_id = p_user_id 
    AND platform_id = v_platform_id 
    AND trial_status = 'active' 
    AND trial_expires_at > NOW()
  ) INTO v_has_trial;
  
  -- Check for active subscription
  SELECT EXISTS(
    SELECT 1 FROM subscriptions 
    WHERE user_id = p_user_id 
    AND platform_id = v_platform_id 
    AND status = 'active'
  ) INTO v_has_subscription;
  
  RETURN v_has_trial OR v_has_subscription;
END;
$$ LANGUAGE plpgsql;

-- Function to get trial days remaining
CREATE OR REPLACE FUNCTION get_trial_days_remaining(p_trial_id INTEGER)
RETURNS INTEGER AS $$
DECLARE
  v_days_remaining INTEGER;
BEGIN
  SELECT GREATEST(0, EXTRACT(DAY FROM (trial_expires_at - NOW()))) 
  INTO v_days_remaining
  FROM platform_trials 
  WHERE id = p_trial_id;
  
  RETURN COALESCE(v_days_remaining, 0);
END;
$$ LANGUAGE plpgsql;

-- Function to get trial percentage remaining
CREATE OR REPLACE FUNCTION get_trial_percentage_remaining(p_trial_id INTEGER)
RETURNS INTEGER AS $$
DECLARE
  v_percentage INTEGER;
  v_total_duration INTERVAL;
  v_time_remaining INTERVAL;
BEGIN
  SELECT 
    trial_expires_at - trial_started_at,
    trial_expires_at - NOW()
  INTO v_total_duration, v_time_remaining
  FROM platform_trials 
  WHERE id = p_trial_id;
  
  IF v_total_duration IS NULL OR v_time_remaining IS NULL THEN
    RETURN 0;
  END IF;
  
  v_percentage := ROUND((EXTRACT(EPOCH FROM v_time_remaining) / EXTRACT(EPOCH FROM v_total_duration)) * 100);
  
  RETURN GREATEST(0, LEAST(100, v_percentage));
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- TRIGGERS
-- ============================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_platform_trials_updated_at BEFORE UPDATE ON platform_trials
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Show all platforms
SELECT platform_key, platform_name, price_monthly, trial_days FROM platforms;
