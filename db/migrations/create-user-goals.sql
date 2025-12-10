-- Create user_goals table for tracking health goals
CREATE TABLE IF NOT EXISTS user_goals (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  goal_type VARCHAR(50) NOT NULL, -- 'bmi_reduction', 'symptom_improvement', 'edc_reduction', 'custom'
  title VARCHAR(255) NOT NULL,
  description TEXT,
  target_value DECIMAL(10, 2), -- Target metric value
  current_value DECIMAL(10, 2), -- Current progress value
  unit VARCHAR(50), -- 'kg', 'points', 'percentage', etc.
  start_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  target_date TIMESTAMP NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'active', -- 'active', 'completed', 'abandoned'
  completed_at TIMESTAMP,
  reminder_frequency VARCHAR(20) DEFAULT 'weekly', -- 'daily', 'weekly', 'biweekly', 'monthly'
  last_reminder_sent TIMESTAMP,
  next_reminder_due TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create goal_progress_logs table for tracking progress over time
CREATE TABLE IF NOT EXISTS goal_progress_logs (
  id SERIAL PRIMARY KEY,
  goal_id INTEGER NOT NULL REFERENCES user_goals(id) ON DELETE CASCADE,
  progress_value DECIMAL(10, 2) NOT NULL,
  notes TEXT,
  logged_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create goal_reminders table for scheduled reminder tracking
CREATE TABLE IF NOT EXISTS goal_reminders (
  id SERIAL PRIMARY KEY,
  goal_id INTEGER NOT NULL REFERENCES user_goals(id) ON DELETE CASCADE,
  reminder_type VARCHAR(20) NOT NULL, -- 'sms', 'email', 'both'
  scheduled_for TIMESTAMP NOT NULL,
  sent_at TIMESTAMP,
  status VARCHAR(20) NOT NULL DEFAULT 'pending', -- 'pending', 'sent', 'failed'
  error_message TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_goals_user_id ON user_goals(user_id);
CREATE INDEX IF NOT EXISTS idx_user_goals_status ON user_goals(status);
CREATE INDEX IF NOT EXISTS idx_user_goals_next_reminder ON user_goals(next_reminder_due);
CREATE INDEX IF NOT EXISTS idx_goal_progress_goal_id ON goal_progress_logs(goal_id);
CREATE INDEX IF NOT EXISTS idx_goal_reminders_goal_id ON goal_reminders(goal_id);
CREATE INDEX IF NOT EXISTS idx_goal_reminders_scheduled ON goal_reminders(scheduled_for);
CREATE INDEX IF NOT EXISTS idx_goal_reminders_status ON goal_reminders(status);

-- Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_user_goals_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_user_goals_updated_at
BEFORE UPDATE ON user_goals
FOR EACH ROW
EXECUTE FUNCTION update_user_goals_updated_at();
