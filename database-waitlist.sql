-- Waitlist System for Coming Soon Platforms
-- This table stores user signups for platforms that are not yet launched

CREATE TABLE IF NOT EXISTS waitlist (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  platform VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  notified BOOLEAN DEFAULT FALSE,
  notified_at TIMESTAMP,
  UNIQUE(email, platform)
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_waitlist_platform ON waitlist(platform);
CREATE INDEX IF NOT EXISTS idx_waitlist_email ON waitlist(email);
CREATE INDEX IF NOT EXISTS idx_waitlist_notified ON waitlist(notified);

-- Comments
COMMENT ON TABLE waitlist IS 'Stores email signups for platforms that are coming soon';
COMMENT ON COLUMN waitlist.email IS 'User email address';
COMMENT ON COLUMN waitlist.platform IS 'Platform name (ElderWatch, PediCalc, ClinicalIQ, ReguReady, SkinScan)';
COMMENT ON COLUMN waitlist.notified IS 'Whether user has been notified about platform launch';
COMMENT ON COLUMN waitlist.notified_at IS 'When user was notified about launch';
