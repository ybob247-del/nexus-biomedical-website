-- Beta Feedback System Tables

-- Main feedback table
CREATE TABLE IF NOT EXISTS beta_feedback (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  feedback_type VARCHAR(50) NOT NULL, -- 'weekly_survey', 'in_platform', 'testimonial'
  track VARCHAR(50), -- 'consumer_endoguard', 'clinician_endoguard', 'rxguard_universal'
  week_number INTEGER, -- 1-8 for weekly surveys
  
  -- NPS and ratings
  nps_score INTEGER CHECK (nps_score >= 0 AND nps_score <= 10),
  overall_satisfaction INTEGER CHECK (overall_satisfaction >= 1 AND overall_satisfaction <= 5),
  
  -- Feature ratings (1-5 stars)
  ease_of_use_rating INTEGER CHECK (ease_of_use_rating >= 1 AND ease_of_use_rating <= 5),
  accuracy_rating INTEGER CHECK (accuracy_rating >= 1 AND accuracy_rating <= 5),
  usefulness_rating INTEGER CHECK (usefulness_rating >= 1 AND usefulness_rating <= 5),
  
  -- Mobile app preferences
  prefer_mobile_app VARCHAR(50), -- 'yes_definitely', 'maybe', 'no_web_fine', 'no_preference'
  mobile_platforms TEXT[], -- ['ios', 'android', 'both', 'neither']
  mobile_app_features TEXT, -- Free text for desired features
  mobile_app_pricing VARCHAR(50), -- 'same_price', 'cheaper', 'free', 'pay_more'
  
  -- Open-ended feedback
  what_works_well TEXT,
  what_needs_improvement TEXT,
  feature_requests TEXT,
  testimonial TEXT,
  would_recommend BOOLEAN,
  would_pay_after_beta BOOLEAN,
  
  -- Metadata
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Survey schedule tracking
CREATE TABLE IF NOT EXISTS beta_survey_schedule (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  week_number INTEGER NOT NULL,
  scheduled_date DATE NOT NULL,
  sent_at TIMESTAMP,
  completed_at TIMESTAMP,
  reminder_sent_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, week_number)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_beta_feedback_user_id ON beta_feedback(user_id);
CREATE INDEX IF NOT EXISTS idx_beta_feedback_track ON beta_feedback(track);
CREATE INDEX IF NOT EXISTS idx_beta_feedback_week ON beta_feedback(week_number);
CREATE INDEX IF NOT EXISTS idx_beta_feedback_created ON beta_feedback(created_at);
CREATE INDEX IF NOT EXISTS idx_survey_schedule_user ON beta_survey_schedule(user_id);
CREATE INDEX IF NOT EXISTS idx_survey_schedule_date ON beta_survey_schedule(scheduled_date);

COMMENT ON TABLE beta_feedback IS 'Stores all beta testing feedback from users';
COMMENT ON TABLE beta_survey_schedule IS 'Tracks weekly survey schedule for beta testers';
