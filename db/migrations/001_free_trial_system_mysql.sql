-- ============================================
-- FREE TRIAL SYSTEM - MySQL/TiDB Compatible
-- ============================================

-- 1. PLATFORMS TABLE
CREATE TABLE IF NOT EXISTS platforms (
  id INT AUTO_INCREMENT PRIMARY KEY,
  platform_key VARCHAR(50) UNIQUE NOT NULL,
  platform_name VARCHAR(255) NOT NULL,
  description TEXT,
  price_monthly DECIMAL(10,2) NOT NULL,
  trial_days INT NOT NULL DEFAULT 14,
  trial_usage_limit INT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert platforms with correct trial durations
INSERT INTO platforms (platform_key, platform_name, description, price_monthly, trial_days, trial_usage_limit) VALUES
('rxguard', 'RxGuard™ Professional', 'AI-powered medication interaction checker', 39.00, 14, 100),
('endoguard_premium', 'EndoGuard™ Premium', 'Clinical-grade hormone intelligence platform', 97.00, 30, 10),
('endoguard_premium_plus', 'EndoGuard™ Premium Plus', 'EndoGuard with expert lab interpretation', 49.00, 14, 10)
ON DUPLICATE KEY UPDATE 
  price_monthly = VALUES(price_monthly), 
  trial_days = VALUES(trial_days),
  trial_usage_limit = VALUES(trial_usage_limit),
  updated_at = CURRENT_TIMESTAMP;

-- 2. USERS TABLE (if not exists)
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  phone VARCHAR(50),
  
  email_verified BOOLEAN DEFAULT FALSE,
  phone_verified BOOLEAN DEFAULT FALSE,
  account_status VARCHAR(50) DEFAULT 'active',
  
  is_beta_tester BOOLEAN DEFAULT FALSE,
  beta_access_expires TIMESTAMP NULL,
  beta_granted_at TIMESTAMP NULL,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  last_login_at TIMESTAMP NULL
);

-- 3. PLATFORM_TRIALS TABLE
CREATE TABLE IF NOT EXISTS platform_trials (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  platform_id INT NOT NULL,
  
  trial_started_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  trial_expires_at TIMESTAMP NOT NULL,
  trial_status VARCHAR(50) NOT NULL DEFAULT 'active',
  
  usage_count INT DEFAULT 0,
  usage_limit INT,
  
  welcome_email_sent BOOLEAN DEFAULT FALSE,
  halfway_email_sent BOOLEAN DEFAULT FALSE,
  quarter_email_sent BOOLEAN DEFAULT FALSE,
  oneday_email_sent BOOLEAN DEFAULT FALSE,
  expired_email_sent BOOLEAN DEFAULT FALSE,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  UNIQUE KEY unique_user_platform (user_id, platform_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (platform_id) REFERENCES platforms(id) ON DELETE CASCADE
);

-- 4. SUBSCRIPTIONS TABLE
CREATE TABLE IF NOT EXISTS subscriptions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  platform_id INT NOT NULL,
  
  stripe_customer_id VARCHAR(255),
  stripe_subscription_id VARCHAR(255) UNIQUE,
  stripe_price_id VARCHAR(255),
  
  status VARCHAR(50) NOT NULL DEFAULT 'active',
  current_period_start TIMESTAMP NULL,
  current_period_end TIMESTAMP NULL,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  cancelled_at TIMESTAMP NULL,
  
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  interval_type VARCHAR(20) DEFAULT 'month',
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  UNIQUE KEY unique_user_platform_sub (user_id, platform_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (platform_id) REFERENCES platforms(id) ON DELETE CASCADE
);

-- 5. USAGE_TRACKING TABLE
CREATE TABLE IF NOT EXISTS usage_tracking (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  platform_id INT NOT NULL,
  trial_id INT,
  
  action_type VARCHAR(100) NOT NULL,
  action_details JSON,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (platform_id) REFERENCES platforms(id) ON DELETE CASCADE,
  FOREIGN KEY (trial_id) REFERENCES platform_trials(id) ON DELETE SET NULL
);

-- 6. EMAIL_NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS email_notifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  trial_id INT,
  
  email_type VARCHAR(100) NOT NULL,
  email_to VARCHAR(255) NOT NULL,
  subject VARCHAR(500),
  sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status VARCHAR(50) DEFAULT 'sent',
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (trial_id) REFERENCES platform_trials(id) ON DELETE SET NULL
);

-- INDEXES
CREATE INDEX idx_platform_trials_user_id ON platform_trials(user_id);
CREATE INDEX idx_platform_trials_status ON platform_trials(trial_status);
CREATE INDEX idx_platform_trials_expires ON platform_trials(trial_expires_at);
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_stripe_id ON subscriptions(stripe_subscription_id);
CREATE INDEX idx_usage_tracking_user_platform ON usage_tracking(user_id, platform_id);
CREATE INDEX idx_email_notifications_user ON email_notifications(user_id);
