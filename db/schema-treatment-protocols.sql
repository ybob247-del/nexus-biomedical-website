-- Treatment Protocols Database Schema
-- Evidence-based clinical protocols for hormone health conditions

CREATE TABLE IF NOT EXISTS treatment_protocols (
  id INT AUTO_INCREMENT PRIMARY KEY,
  protocol_name VARCHAR(255) NOT NULL,
  condition_category VARCHAR(100) NOT NULL, -- 'thyroid', 'reproductive', 'adrenal', 'metabolic', etc.
  target_condition VARCHAR(255) NOT NULL, -- Specific condition (e.g., 'Hypothyroidism', 'PCOS', 'Adrenal Fatigue')
  severity_level ENUM('mild', 'moderate', 'severe', 'all') DEFAULT 'all',
  protocol_type ENUM('lifestyle', 'supplement', 'medication', 'combination') NOT NULL,
  
  -- Protocol Details
  summary TEXT NOT NULL, -- Brief overview of the protocol
  clinical_rationale TEXT NOT NULL, -- Why this protocol works
  expected_outcomes TEXT, -- What patients can expect
  timeline VARCHAR(100), -- How long until results (e.g., '4-8 weeks', '3-6 months')
  
  -- Implementation
  implementation_steps JSON, -- Array of step-by-step instructions
  dosage_guidelines TEXT, -- Specific dosing information for supplements/medications
  contraindications TEXT, -- When NOT to use this protocol
  monitoring_parameters JSON, -- What to track (labs, symptoms, etc.)
  
  -- Evidence
  evidence_level ENUM('high', 'moderate', 'low') NOT NULL, -- Quality of supporting research
  primary_references JSON, -- Array of PubMed IDs or DOIs
  clinical_studies_summary TEXT, -- Summary of key supporting studies
  
  -- Metadata
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  is_active BOOLEAN DEFAULT TRUE,
  provider_notes TEXT, -- Additional notes for providers
  
  INDEX idx_condition_category (condition_category),
  INDEX idx_target_condition (target_condition),
  INDEX idx_protocol_type (protocol_type),
  INDEX idx_evidence_level (evidence_level),
  INDEX idx_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Progress Tracking Database Schema
-- Track patient symptom improvements over time

CREATE TABLE IF NOT EXISTS patient_progress_tracking (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  assessment_id INT, -- Link to original assessment if applicable
  tracking_date DATE NOT NULL,
  
  -- Symptom Tracking (JSON for flexibility)
  symptoms_data JSON NOT NULL, -- {symptom_name: severity_score, ...}
  overall_wellness_score INT, -- 0-100 subjective wellness rating
  
  -- Lifestyle Tracking
  sleep_hours DECIMAL(3,1), -- Hours of sleep
  stress_level INT, -- 1-10 scale
  exercise_minutes INT, -- Minutes of exercise
  water_intake_oz INT, -- Ounces of water
  
  -- Protocol Adherence
  protocol_id INT, -- Which protocol they're following
  adherence_percentage INT, -- 0-100% adherence to protocol
  adherence_notes TEXT, -- What's working, what's challenging
  
  -- Notes
  patient_notes TEXT, -- Patient's observations
  provider_notes TEXT, -- Provider's notes after review
  
  -- Metadata
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (protocol_id) REFERENCES treatment_protocols(id) ON DELETE SET NULL,
  
  INDEX idx_user_tracking (user_id, tracking_date),
  INDEX idx_assessment_id (assessment_id),
  INDEX idx_protocol_id (protocol_id),
  INDEX idx_tracking_date (tracking_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Patient Protocol Assignments
-- Track which protocols are assigned to which patients

CREATE TABLE IF NOT EXISTS patient_protocol_assignments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  protocol_id INT NOT NULL,
  provider_id INT, -- Which provider assigned this
  
  -- Assignment Details
  start_date DATE NOT NULL,
  end_date DATE, -- NULL if ongoing
  status ENUM('active', 'completed', 'discontinued', 'paused') DEFAULT 'active',
  
  -- Customization
  custom_instructions TEXT, -- Provider-specific modifications
  target_outcomes JSON, -- Specific goals for this patient
  
  -- Results
  outcome_summary TEXT, -- Final results when completed
  effectiveness_rating INT, -- 1-5 rating of how well it worked
  
  -- Metadata
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (protocol_id) REFERENCES treatment_protocols(id) ON DELETE CASCADE,
  
  INDEX idx_user_protocols (user_id, status),
  INDEX idx_provider_id (provider_id),
  INDEX idx_protocol_id (protocol_id),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Progress Milestones
-- Track significant improvements or changes

CREATE TABLE IF NOT EXISTS progress_milestones (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  milestone_date DATE NOT NULL,
  milestone_type ENUM('symptom_improvement', 'lab_improvement', 'lifestyle_achievement', 'protocol_completion', 'other') NOT NULL,
  
  -- Milestone Details
  title VARCHAR(255) NOT NULL, -- e.g., "TSH normalized", "Lost 10 lbs", "30 days symptom-free"
  description TEXT,
  metric_name VARCHAR(100), -- What improved (e.g., "TSH", "weight", "fatigue_score")
  before_value VARCHAR(50), -- Starting value
  after_value VARCHAR(50), -- Current value
  
  -- Context
  protocol_id INT, -- Which protocol contributed to this
  provider_notes TEXT,
  
  -- Metadata
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (protocol_id) REFERENCES treatment_protocols(id) ON DELETE SET NULL,
  
  INDEX idx_user_milestones (user_id, milestone_date),
  INDEX idx_milestone_type (milestone_type),
  INDEX idx_protocol_id (protocol_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
