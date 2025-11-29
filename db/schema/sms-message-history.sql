-- SMS Message History Table
-- Tracks all SMS messages sent to users for transparency and compliance

CREATE TABLE IF NOT EXISTS sms_message_history (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  phone_number VARCHAR(20) NOT NULL,
  message_type VARCHAR(50) NOT NULL, -- 'assessment_reminder', 'high_risk_alert', 'lab_reminder', 'subscription_expiring', 'welcome', 'improvement_celebration'
  message_content TEXT NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'pending', -- 'pending', 'sent', 'delivered', 'failed'
  twilio_message_sid VARCHAR(100), -- Twilio message ID for tracking
  error_message TEXT, -- Error details if sending failed
  sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  delivered_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_sms_history_user_id ON sms_message_history(user_id);
CREATE INDEX idx_sms_history_sent_at ON sms_message_history(sent_at DESC);
CREATE INDEX idx_sms_history_status ON sms_message_history(status);
CREATE INDEX idx_sms_history_message_type ON sms_message_history(message_type);

-- Comments
COMMENT ON TABLE sms_message_history IS 'Tracks all SMS messages sent to users for transparency and compliance auditing';
COMMENT ON COLUMN sms_message_history.message_type IS 'Type of SMS notification sent';
COMMENT ON COLUMN sms_message_history.status IS 'Delivery status: pending, sent, delivered, failed';
COMMENT ON COLUMN sms_message_history.twilio_message_sid IS 'Twilio Message SID for tracking delivery status';
