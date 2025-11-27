-- Subscriptions and Platform Access Tables
-- Core tables for managing user subscriptions, trials, and platform access

-- ============================================================================
-- SUBSCRIPTIONS TABLE
-- Stores all subscription records (both trials and paid subscriptions)
-- ============================================================================
CREATE TABLE IF NOT EXISTS subscriptions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  platform VARCHAR(50) NOT NULL,
  
  -- Subscription status
  status VARCHAR(20) NOT NULL DEFAULT 'trialing',
  -- Possible values: 'trialing', 'active', 'past_due', 'canceled', 'unpaid', 'incomplete'
  
  -- Stripe integration fields
  stripe_subscription_id VARCHAR(255) UNIQUE,
  stripe_customer_id VARCHAR(255),
  stripe_price_id VARCHAR(255),
  
  -- Trial period tracking
  trial_start TIMESTAMP,
  trial_end TIMESTAMP,
  
  -- Subscription period tracking
  current_period_start TIMESTAMP,
  current_period_end TIMESTAMP,
  
  -- Cancellation tracking
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  canceled_at TIMESTAMP,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT valid_status CHECK (status IN ('trialing', 'active', 'past_due', 'canceled', 'unpaid', 'incomplete'))
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_platform ON subscriptions(platform);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_subscription_id ON subscriptions(stripe_subscription_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_platform ON subscriptions(user_id, platform);

-- ============================================================================
-- PLATFORM ACCESS TABLE
-- Tracks which users have access to which platforms
-- ============================================================================
CREATE TABLE IF NOT EXISTS platform_access (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  subscription_id INTEGER REFERENCES subscriptions(id) ON DELETE CASCADE,
  platform VARCHAR(50) NOT NULL,
  
  -- Access status
  is_active BOOLEAN DEFAULT TRUE,
  
  -- Access period
  access_granted_at TIMESTAMP DEFAULT NOW(),
  access_expires_at TIMESTAMP,
  
  -- Access type
  access_type VARCHAR(20) DEFAULT 'trial',
  -- Possible values: 'trial', 'subscription', 'lifetime', 'admin'
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT valid_access_type CHECK (access_type IN ('trial', 'subscription', 'lifetime', 'admin')),
  CONSTRAINT unique_user_platform_access UNIQUE (user_id, platform, is_active)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_platform_access_user_id ON platform_access(user_id);
CREATE INDEX IF NOT EXISTS idx_platform_access_platform ON platform_access(platform);
CREATE INDEX IF NOT EXISTS idx_platform_access_is_active ON platform_access(is_active);
CREATE INDEX IF NOT EXISTS idx_platform_access_subscription_id ON platform_access(subscription_id);
CREATE INDEX IF NOT EXISTS idx_platform_access_user_platform ON platform_access(user_id, platform);

-- ============================================================================
-- HELPER FUNCTIONS
-- ============================================================================

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers to auto-update updated_at
DROP TRIGGER IF EXISTS update_subscriptions_updated_at ON subscriptions;
CREATE TRIGGER update_subscriptions_updated_at
  BEFORE UPDATE ON subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_platform_access_updated_at ON platform_access;
CREATE TRIGGER update_platform_access_updated_at
  BEFORE UPDATE ON platform_access
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- SAMPLE QUERIES (for reference)
-- ============================================================================

-- Check if user has active access to a platform:
-- SELECT * FROM platform_access 
-- WHERE user_id = $1 AND platform = $2 AND is_active = true 
-- AND (access_expires_at IS NULL OR access_expires_at > NOW());

-- Get all active subscriptions for a user:
-- SELECT * FROM subscriptions 
-- WHERE user_id = $1 AND status IN ('trialing', 'active');

-- Get user's platform access with subscription details:
-- SELECT pa.*, s.status, s.trial_end, s.current_period_end
-- FROM platform_access pa
-- LEFT JOIN subscriptions s ON pa.subscription_id = s.id
-- WHERE pa.user_id = $1 AND pa.is_active = true;
