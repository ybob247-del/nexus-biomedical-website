-- Hormone Dysfunction Profiles Database Schema
-- Standardized clinical patterns for hormone imbalances

CREATE TABLE IF NOT EXISTS hormone_dysfunction_profiles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  profile_name VARCHAR(255) NOT NULL,
  condition_category VARCHAR(100) NOT NULL, -- 'thyroid', 'reproductive', 'adrenal', 'metabolic'
  primary_condition VARCHAR(255) NOT NULL, -- Main diagnosis
  
  -- Clinical Presentation
  typical_age_range VARCHAR(50), -- e.g., '25-45', '40-60', 'any'
  gender_prevalence ENUM('female_predominant', 'male_predominant', 'equal', 'female_only', 'male_only') NOT NULL,
  
  -- Symptom Pattern (JSON arrays for flexibility)
  cardinal_symptoms JSON NOT NULL, -- Must-have symptoms that define this profile
  common_symptoms JSON NOT NULL, -- Frequently present (70-90%)
  occasional_symptoms JSON, -- Sometimes present (30-70%)
  
  -- Lab Pattern
  typical_lab_findings JSON NOT NULL, -- Expected lab abnormalities
  lab_severity_markers JSON, -- Labs that indicate severity
  
  -- Hormone Systems Affected
  primary_hormone_system VARCHAR(100) NOT NULL, -- Main system affected
  secondary_hormone_systems JSON, -- Other systems commonly affected
  
  -- EDC Associations
  associated_edc_exposures JSON, -- EDCs commonly linked to this profile
  edc_mechanism TEXT, -- How EDCs contribute to this dysfunction
  
  -- Clinical Pearls
  diagnostic_criteria TEXT NOT NULL, -- How to diagnose this profile
  differential_diagnosis JSON, -- What else to consider
  red_flags TEXT, -- Warning signs requiring immediate attention
  
  -- Treatment Approach
  first_line_treatment TEXT NOT NULL, -- Initial treatment approach
  recommended_protocol_ids JSON, -- Links to treatment_protocols table
  expected_response_timeline VARCHAR(100), -- How long until improvement
  
  -- Prognosis
  natural_history TEXT, -- What happens without treatment
  treatment_success_rate VARCHAR(50), -- e.g., '70-80%', 'variable'
  reversibility ENUM('fully_reversible', 'partially_reversible', 'progressive', 'variable') NOT NULL,
  
  -- Evidence
  prevalence_data VARCHAR(255), -- How common is this
  evidence_quality ENUM('high', 'moderate', 'low') NOT NULL,
  key_references JSON, -- PubMed IDs or DOIs
  
  -- Metadata
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  is_active BOOLEAN DEFAULT TRUE,
  clinical_notes TEXT, -- Additional provider guidance
  
  INDEX idx_condition_category (condition_category),
  INDEX idx_primary_condition (primary_condition),
  INDEX idx_gender_prevalence (gender_prevalence),
  INDEX idx_primary_hormone_system (primary_hormone_system),
  INDEX idx_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Patient Profile Matches
-- Track which patients match which dysfunction profiles

CREATE TABLE IF NOT EXISTS patient_profile_matches (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  assessment_id INT, -- Link to assessment that generated this match
  profile_id INT NOT NULL,
  
  -- Match Quality
  match_score DECIMAL(5,2) NOT NULL, -- 0-100 confidence score
  matching_symptoms JSON NOT NULL, -- Which symptoms matched
  matching_labs JSON, -- Which lab findings matched
  
  -- Clinical Context
  match_date DATE NOT NULL,
  provider_confirmed BOOLEAN DEFAULT FALSE, -- Has provider reviewed and confirmed?
  provider_notes TEXT,
  
  -- Metadata
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (profile_id) REFERENCES hormone_dysfunction_profiles(id) ON DELETE CASCADE,
  
  INDEX idx_user_matches (user_id, match_score DESC),
  INDEX idx_profile_id (profile_id),
  INDEX idx_match_date (match_date),
  INDEX idx_provider_confirmed (provider_confirmed)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Profile Symptom Mapping
-- Detailed mapping of symptoms to profiles for matching algorithm

CREATE TABLE IF NOT EXISTS profile_symptom_mapping (
  id INT AUTO_INCREMENT PRIMARY KEY,
  profile_id INT NOT NULL,
  symptom_name VARCHAR(255) NOT NULL,
  symptom_category VARCHAR(100), -- 'cardinal', 'common', 'occasional'
  weight DECIMAL(3,2) NOT NULL, -- 0-1.0 importance weight for matching
  
  -- Symptom Characteristics
  typical_severity ENUM('mild', 'moderate', 'severe', 'variable') DEFAULT 'variable',
  frequency ENUM('constant', 'intermittent', 'cyclical', 'variable') DEFAULT 'variable',
  
  -- Metadata
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (profile_id) REFERENCES hormone_dysfunction_profiles(id) ON DELETE CASCADE,
  
  INDEX idx_profile_symptoms (profile_id, weight DESC),
  INDEX idx_symptom_name (symptom_name),
  UNIQUE KEY unique_profile_symptom (profile_id, symptom_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
