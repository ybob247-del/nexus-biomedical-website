-- Migration: Add assessment history tracking for progress dashboard
-- Created: 2025-12-09
-- Purpose: Enable users to track their EndoGuard assessments over time

-- Create assessment_history table to store historical assessment data
CREATE TABLE IF NOT EXISTS assessment_history (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  assessment_type VARCHAR(50) NOT NULL DEFAULT 'endoguard',
  
  -- Assessment results (stored as JSONB for flexibility)
  results JSONB NOT NULL,
  
  -- Key metrics for quick querying
  overall_risk_score INTEGER,
  overall_risk_level VARCHAR(20),
  edc_risk_score INTEGER,
  symptom_count INTEGER,
  symptom_severity INTEGER,
  bmi DECIMAL(5, 2),
  
  -- Timestamps
  completed_at TIMESTAMP NOT NULL DEFAULT NOW(),
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  
  -- Indexes for performance
  CONSTRAINT valid_risk_score CHECK (overall_risk_score >= 0 AND overall_risk_score <= 100),
  CONSTRAINT valid_edc_score CHECK (edc_risk_score >= 0 AND edc_risk_score <= 100),
  CONSTRAINT valid_severity CHECK (symptom_severity >= 0 AND symptom_severity <= 10)
);

-- Create indexes for efficient querying
CREATE INDEX IF NOT EXISTS idx_assessment_history_user_id ON assessment_history(user_id);
CREATE INDEX IF NOT EXISTS idx_assessment_history_completed_at ON assessment_history(completed_at DESC);
CREATE INDEX IF NOT EXISTS idx_assessment_history_user_completed ON assessment_history(user_id, completed_at DESC);
CREATE INDEX IF NOT EXISTS idx_assessment_history_type ON assessment_history(assessment_type);

-- Create function to automatically store assessments in history
CREATE OR REPLACE FUNCTION store_assessment_in_history()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert into assessment_history when a new assessment is completed
  INSERT INTO assessment_history (
    user_id,
    assessment_type,
    results,
    overall_risk_score,
    overall_risk_level,
    edc_risk_score,
    symptom_count,
    symptom_severity,
    bmi,
    completed_at
  ) VALUES (
    NEW.user_id,
    'endoguard',
    to_jsonb(NEW),
    NEW.overall_risk_score,
    NEW.overall_risk_level,
    NEW.edc_risk_score,
    NEW.symptom_count,
    NEW.symptom_severity,
    NEW.bmi,
    NEW.completed_at
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Note: Trigger will be created after endoguard_assessments table exists
-- CREATE TRIGGER trg_store_assessment_history
-- AFTER INSERT ON endoguard_assessments
-- FOR EACH ROW
-- EXECUTE FUNCTION store_assessment_in_history();

-- Grant permissions
GRANT SELECT, INSERT ON assessment_history TO PUBLIC;
GRANT USAGE, SELECT ON SEQUENCE assessment_history_id_seq TO PUBLIC;

-- Add comments for documentation
COMMENT ON TABLE assessment_history IS 'Stores historical assessment data for progress tracking and comparison';
COMMENT ON COLUMN assessment_history.results IS 'Complete assessment results stored as JSONB for flexibility';
COMMENT ON COLUMN assessment_history.overall_risk_score IS 'Denormalized risk score for quick filtering (0-100)';
COMMENT ON COLUMN assessment_history.bmi IS 'Body Mass Index for trend tracking';
