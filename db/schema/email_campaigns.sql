-- Email Drip Campaign Tracking Table
CREATE TABLE IF NOT EXISTS email_campaigns (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL,
  assessment_id INTEGER,
  campaign_type VARCHAR(50) NOT NULL, -- 'endoguard_drip', 'rxguard_drip', etc.
  
  -- Campaign schedule
  day7_sent_at TIMESTAMP,
  day7_email_id VARCHAR(255),
  day14_sent_at TIMESTAMP,
  day14_email_id VARCHAR(255),
  day30_sent_at TIMESTAMP,
  day30_email_id VARCHAR(255),
  
  -- User data for personalization
  user_name VARCHAR(255),
  assessment_date TIMESTAMP NOT NULL,
  risk_score INTEGER,
  
  -- Engagement tracking
  day7_opened BOOLEAN DEFAULT FALSE,
  day7_clicked BOOLEAN DEFAULT FALSE,
  day14_opened BOOLEAN DEFAULT FALSE,
  day14_clicked BOOLEAN DEFAULT FALSE,
  day30_opened BOOLEAN DEFAULT FALSE,
  day30_clicked BOOLEAN DEFAULT FALSE,
  
  -- Unsubscribe
  unsubscribed BOOLEAN DEFAULT FALSE,
  unsubscribed_at TIMESTAMP,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index for efficient queries
CREATE INDEX IF NOT EXISTS idx_email_campaigns_user_id ON email_campaigns(user_id);
CREATE INDEX IF NOT EXISTS idx_email_campaigns_email ON email_campaigns(email);
CREATE INDEX IF NOT EXISTS idx_email_campaigns_assessment_date ON email_campaigns(assessment_date);
CREATE INDEX IF NOT EXISTS idx_email_campaigns_unsubscribed ON email_campaigns(unsubscribed);

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_email_campaigns_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER email_campaigns_updated_at
BEFORE UPDATE ON email_campaigns
FOR EACH ROW
EXECUTE FUNCTION update_email_campaigns_updated_at();
