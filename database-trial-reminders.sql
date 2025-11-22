-- Trial Reminders Table
-- Tracks which reminder emails have been sent to prevent duplicates

CREATE TABLE IF NOT EXISTS trial_reminders (
  id SERIAL PRIMARY KEY,
  trial_id INTEGER NOT NULL REFERENCES platform_trials(id) ON DELETE CASCADE,
  days_remaining INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(trial_id, days_remaining)
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_trial_reminders_trial_id ON trial_reminders(trial_id);
CREATE INDEX IF NOT EXISTS idx_trial_reminders_days ON trial_reminders(days_remaining);

-- Comments
COMMENT ON TABLE trial_reminders IS 'Tracks which trial reminder emails have been sent';
COMMENT ON COLUMN trial_reminders.trial_id IS 'Reference to platform_trials table';
COMMENT ON COLUMN trial_reminders.days_remaining IS 'Number of days remaining when reminder was sent';
