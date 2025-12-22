-- Outcome Analytics and Care Gap Alerts Database Schema
-- Track patient outcomes and alert providers to care gaps

-- Provider Outcome Metrics
-- Aggregate patient outcomes across provider's patient population

CREATE TABLE IF NOT EXISTS provider_outcome_metrics (
  id INT AUTO_INCREMENT PRIMARY KEY,
  provider_id INT NOT NULL,
  metric_period_start DATE NOT NULL,
  metric_period_end DATE NOT NULL,
  
  -- Patient Volume
  total_patients INT DEFAULT 0,
  active_patients INT DEFAULT 0, -- Patients with activity in period
  new_patients INT DEFAULT 0, -- New patients in period
  
  -- Engagement Metrics
  avg_assessments_per_patient DECIMAL(5,2),
  total_assessments INT DEFAULT 0,
  patients_with_progress_tracking INT DEFAULT 0,
  avg_progress_entries_per_patient DECIMAL(5,2),
  
  -- Clinical Outcomes
  patients_with_symptom_improvement INT DEFAULT 0,
  avg_symptom_improvement_percentage DECIMAL(5,2),
  patients_achieving_treatment_goals INT DEFAULT 0,
  treatment_goal_achievement_rate DECIMAL(5,2),
  
  -- Protocol Effectiveness
  total_protocols_assigned INT DEFAULT 0,
  protocols_completed INT DEFAULT 0,
  protocol_completion_rate DECIMAL(5,2),
  avg_protocol_effectiveness_rating DECIMAL(3,2), -- 1-5 scale
  
  -- Lab Improvements
  patients_with_lab_improvements INT DEFAULT 0,
  avg_tsh_improvement DECIMAL(5,2),
  avg_insulin_improvement DECIMAL(5,2),
  avg_testosterone_improvement DECIMAL(5,2),
  
  -- Patient Satisfaction
  avg_patient_satisfaction_score DECIMAL(3,2), -- 1-5 scale
  patient_retention_rate DECIMAL(5,2),
  
  -- Care Gaps
  total_care_gaps_identified INT DEFAULT 0,
  care_gaps_addressed INT DEFAULT 0,
  care_gap_resolution_rate DECIMAL(5,2),
  
  -- Metadata
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_provider_period (provider_id, metric_period_start),
  INDEX idx_period (metric_period_start, metric_period_end)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Patient Outcome Tracking
-- Individual patient outcome data

CREATE TABLE IF NOT EXISTS patient_outcomes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  provider_id INT,
  assessment_id INT,
  protocol_id INT,
  
  -- Outcome Period
  baseline_date DATE NOT NULL,
  followup_date DATE NOT NULL,
  outcome_period_days INT,
  
  -- Symptom Outcomes
  baseline_symptom_score INT, -- 0-100
  followup_symptom_score INT, -- 0-100
  symptom_improvement_percentage DECIMAL(5,2),
  symptom_improvement_category ENUM('significant_improvement', 'moderate_improvement', 'mild_improvement', 'no_change', 'worsening'),
  
  -- Specific Symptom Tracking
  symptom_changes JSON, -- Detailed symptom-by-symptom changes
  
  -- Lab Outcomes
  baseline_labs JSON,
  followup_labs JSON,
  lab_improvements JSON, -- Which labs improved and by how much
  
  -- Quality of Life
  baseline_qol_score INT, -- 0-100
  followup_qol_score INT, -- 0-100
  qol_improvement DECIMAL(5,2),
  
  -- Treatment Adherence
  protocol_adherence_percentage INT, -- 0-100
  missed_followups INT DEFAULT 0,
  
  -- Goal Achievement
  treatment_goals JSON, -- List of goals set
  goals_achieved JSON, -- Which goals were achieved
  goal_achievement_percentage DECIMAL(5,2),
  
  -- Patient Satisfaction
  patient_satisfaction_score INT, -- 1-5
  would_recommend BOOLEAN,
  patient_feedback TEXT,
  
  -- Provider Assessment
  provider_notes TEXT,
  outcome_success BOOLEAN,
  
  -- Metadata
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (protocol_id) REFERENCES treatment_protocols(id) ON DELETE SET NULL,
  
  INDEX idx_user_outcomes (user_id, followup_date DESC),
  INDEX idx_provider_outcomes (provider_id, followup_date DESC),
  INDEX idx_protocol_outcomes (protocol_id, outcome_success),
  INDEX idx_improvement (symptom_improvement_category, followup_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Care Gap Alerts
-- Automated alerts for providers when patients need attention

CREATE TABLE IF NOT EXISTS care_gap_alerts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  provider_id INT,
  
  -- Alert Details
  alert_type ENUM('missed_followup', 'declining_symptoms', 'lab_abnormality', 'protocol_non_adherence', 'no_progress_tracking', 'treatment_goal_not_met', 'high_risk_patient', 'medication_refill_needed') NOT NULL,
  alert_priority ENUM('low', 'medium', 'high', 'urgent') NOT NULL,
  alert_title VARCHAR(255) NOT NULL,
  alert_description TEXT NOT NULL,
  
  -- Alert Context
  related_assessment_id INT,
  related_protocol_id INT,
  triggered_by_data JSON, -- What data triggered this alert
  
  -- Recommended Actions
  recommended_actions JSON, -- List of suggested next steps
  
  -- Alert Status
  alert_status ENUM('active', 'acknowledged', 'resolved', 'dismissed') DEFAULT 'active',
  acknowledged_at TIMESTAMP NULL,
  acknowledged_by INT, -- Provider who acknowledged
  resolved_at TIMESTAMP NULL,
  resolution_notes TEXT,
  
  -- Alert Timing
  alert_date DATE NOT NULL,
  due_date DATE, -- When action should be taken by
  days_overdue INT DEFAULT 0,
  
  -- Metadata
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (related_protocol_id) REFERENCES treatment_protocols(id) ON DELETE SET NULL,
  
  INDEX idx_provider_alerts (provider_id, alert_status, alert_priority),
  INDEX idx_user_alerts (user_id, alert_status),
  INDEX idx_alert_type (alert_type, alert_status),
  INDEX idx_alert_date (alert_date, alert_priority),
  INDEX idx_due_date (due_date, alert_status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Alert Rules Configuration
-- Define rules for when alerts should be triggered

CREATE TABLE IF NOT EXISTS alert_rules (
  id INT AUTO_INCREMENT PRIMARY KEY,
  rule_name VARCHAR(255) NOT NULL,
  alert_type VARCHAR(100) NOT NULL,
  alert_priority VARCHAR(50) NOT NULL,
  
  -- Rule Conditions
  condition_type ENUM('time_based', 'symptom_based', 'lab_based', 'adherence_based', 'outcome_based') NOT NULL,
  condition_criteria JSON NOT NULL, -- Specific criteria for triggering
  
  -- Rule Actions
  alert_title_template VARCHAR(255) NOT NULL,
  alert_description_template TEXT NOT NULL,
  recommended_actions_template JSON,
  
  -- Rule Settings
  is_active BOOLEAN DEFAULT TRUE,
  check_frequency_days INT DEFAULT 1, -- How often to check this rule
  
  -- Metadata
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_active_rules (is_active, condition_type),
  UNIQUE KEY unique_rule_name (rule_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Population Health Analytics
-- Aggregate analytics across entire patient population

CREATE TABLE IF NOT EXISTS population_health_metrics (
  id INT AUTO_INCREMENT PRIMARY KEY,
  metric_period_start DATE NOT NULL,
  metric_period_end DATE NOT NULL,
  
  -- Overall Population
  total_users INT DEFAULT 0,
  active_users INT DEFAULT 0,
  
  -- Condition Prevalence
  condition_prevalence JSON, -- Count of each condition
  
  -- Top EDC Exposures
  top_edc_exposures JSON, -- Most common EDC exposures
  
  -- Outcome Trends
  avg_symptom_improvement DECIMAL(5,2),
  avg_qol_improvement DECIMAL(5,2),
  treatment_success_rate DECIMAL(5,2),
  
  -- Protocol Effectiveness
  protocol_effectiveness_rankings JSON, -- Which protocols work best
  
  -- Demographics
  age_distribution JSON,
  gender_distribution JSON,
  
  -- Metadata
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  INDEX idx_period (metric_period_start, metric_period_end)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
