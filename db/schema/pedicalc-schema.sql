-- PediCalc Pro™ Database Schema
-- Pediatric Dosing Calculator & Child Health Tracker
-- Created: November 20, 2025

-- Table: children
-- Stores child patient information
CREATE TABLE IF NOT EXISTS children (
    id SERIAL PRIMARY KEY,
    parent_user_id INTEGER NOT NULL, -- Link to main users table
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255),
    date_of_birth DATE NOT NULL,
    age_years INTEGER,
    age_months INTEGER,
    gender VARCHAR(20),
    
    -- Current measurements
    current_weight_kg DECIMAL(5,2),
    current_weight_lbs DECIMAL(5,2),
    current_height_cm DECIMAL(5,2),
    current_height_inches DECIMAL(5,2),
    last_measured_date DATE,
    
    -- Medical information
    allergies TEXT[],
    medical_conditions TEXT[],
    special_needs TEXT,
    pediatrician_name VARCHAR(255),
    pediatrician_phone VARCHAR(50),
    
    -- Emergency contact
    emergency_contact_name VARCHAR(255),
    emergency_contact_phone VARCHAR(50),
    emergency_contact_relationship VARCHAR(100),
    
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: growth_data
-- Tracks child growth over time
CREATE TABLE IF NOT EXISTS growth_data (
    id SERIAL PRIMARY KEY,
    child_id INTEGER NOT NULL REFERENCES children(id) ON DELETE CASCADE,
    measurement_date DATE NOT NULL,
    age_months INTEGER NOT NULL,
    
    -- Measurements
    weight_kg DECIMAL(5,2),
    weight_lbs DECIMAL(5,2),
    height_cm DECIMAL(5,2),
    height_inches DECIMAL(5,2),
    head_circumference_cm DECIMAL(4,1),
    bmi DECIMAL(4,1),
    
    -- Percentiles (WHO/CDC growth charts)
    weight_percentile INTEGER,
    height_percentile INTEGER,
    bmi_percentile INTEGER,
    head_circumference_percentile INTEGER,
    
    -- Growth assessment
    growth_pattern VARCHAR(50), -- 'normal', 'accelerated', 'delayed', 'concerning'
    concerns TEXT[],
    notes TEXT,
    measured_by VARCHAR(255),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: pediatric_medications
-- Medication database with pediatric dosing information
CREATE TABLE IF NOT EXISTS pediatric_medications (
    id SERIAL PRIMARY KEY,
    medication_name VARCHAR(255) NOT NULL,
    generic_name VARCHAR(255),
    drug_class VARCHAR(100),
    
    -- Dosing information
    dosing_method VARCHAR(50), -- 'weight_based', 'age_based', 'fixed_dose'
    dose_per_kg DECIMAL(8,3), -- mg/kg
    max_single_dose DECIMAL(8,2), -- mg
    max_daily_dose DECIMAL(8,2), -- mg
    min_age_months INTEGER,
    max_age_months INTEGER,
    
    -- Frequency
    frequency_options TEXT[], -- 'once_daily', 'twice_daily', 'every_6_hours', etc.
    
    -- Forms available
    available_forms TEXT[], -- 'tablet', 'liquid', 'suspension', 'chewable', etc.
    concentrations TEXT[], -- '100mg/5ml', '250mg tablet', etc.
    
    -- Safety information
    contraindications TEXT[],
    warnings TEXT[],
    common_side_effects TEXT[],
    serious_side_effects TEXT[],
    
    -- Administration
    administration_instructions TEXT,
    food_interactions TEXT,
    storage_instructions TEXT,
    
    -- References
    fda_approved BOOLEAN DEFAULT false,
    references TEXT[],
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: dosage_calculations
-- Stores calculated dosages for children
CREATE TABLE IF NOT EXISTS dosage_calculations (
    id SERIAL PRIMARY KEY,
    child_id INTEGER NOT NULL REFERENCES children(id) ON DELETE CASCADE,
    medication_id INTEGER REFERENCES pediatric_medications(id),
    medication_name VARCHAR(255) NOT NULL,
    
    -- Child data at time of calculation
    child_weight_kg DECIMAL(5,2) NOT NULL,
    child_age_months INTEGER NOT NULL,
    
    -- Calculation results
    calculated_dose_mg DECIMAL(8,2) NOT NULL,
    recommended_frequency VARCHAR(100),
    dose_per_administration_mg DECIMAL(8,2),
    volume_per_dose_ml DECIMAL(6,2), -- For liquid medications
    
    -- Safety checks
    is_safe BOOLEAN DEFAULT true,
    safety_warnings TEXT[],
    exceeds_max_dose BOOLEAN DEFAULT false,
    below_min_age BOOLEAN DEFAULT false,
    
    -- Prescription information
    prescribed_by VARCHAR(255),
    prescription_date DATE,
    duration_days INTEGER,
    
    notes TEXT,
    calculated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: active_medications
-- Current medications the child is taking
CREATE TABLE IF NOT EXISTS child_active_medications (
    id SERIAL PRIMARY KEY,
    child_id INTEGER NOT NULL REFERENCES children(id) ON DELETE CASCADE,
    medication_name VARCHAR(255) NOT NULL,
    dosage VARCHAR(100) NOT NULL,
    frequency VARCHAR(100) NOT NULL,
    form VARCHAR(50), -- 'tablet', 'liquid', etc.
    
    -- Schedule
    time_of_day TEXT[], -- ['morning', 'afternoon', 'evening']
    with_food BOOLEAN DEFAULT false,
    
    -- Duration
    start_date DATE NOT NULL,
    end_date DATE,
    is_active BOOLEAN DEFAULT true,
    
    -- Prescriber
    prescribed_by VARCHAR(255),
    pharmacy VARCHAR(255),
    
    -- Purpose
    condition_treating VARCHAR(255),
    special_instructions TEXT,
    
    -- Refill
    refill_date DATE,
    refills_remaining INTEGER,
    
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: medication_administration_log
-- Tracks when medications are given
CREATE TABLE IF NOT EXISTS medication_administration_log (
    id SERIAL PRIMARY KEY,
    child_id INTEGER NOT NULL REFERENCES children(id) ON DELETE CASCADE,
    active_medication_id INTEGER REFERENCES child_active_medications(id) ON DELETE CASCADE,
    
    scheduled_time TIMESTAMP,
    administered_at TIMESTAMP NOT NULL,
    administered_by VARCHAR(255), -- Parent name
    dosage_given VARCHAR(100),
    
    -- Observations
    child_reaction VARCHAR(50), -- 'normal', 'refused', 'vomited', 'allergic_reaction'
    side_effects_observed TEXT[],
    notes TEXT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: vaccinations
-- Vaccination schedule and records
CREATE TABLE IF NOT EXISTS vaccinations (
    id SERIAL PRIMARY KEY,
    child_id INTEGER NOT NULL REFERENCES children(id) ON DELETE CASCADE,
    
    vaccine_name VARCHAR(255) NOT NULL,
    vaccine_type VARCHAR(100), -- 'DTaP', 'MMR', 'Polio', etc.
    dose_number INTEGER, -- 1st dose, 2nd dose, etc.
    
    -- Administration
    administered_date DATE,
    administered_by VARCHAR(255),
    facility_name VARCHAR(255),
    lot_number VARCHAR(100),
    
    -- Scheduling
    due_date DATE,
    is_completed BOOLEAN DEFAULT false,
    is_overdue BOOLEAN DEFAULT false,
    
    -- Reactions
    had_reaction BOOLEAN DEFAULT false,
    reaction_description TEXT,
    reaction_severity VARCHAR(50),
    
    -- Next dose
    next_dose_due DATE,
    
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: illness_tracker
-- Track illnesses and symptoms
CREATE TABLE IF NOT EXISTS illness_tracker (
    id SERIAL PRIMARY KEY,
    child_id INTEGER NOT NULL REFERENCES children(id) ON DELETE CASCADE,
    
    illness_name VARCHAR(255),
    symptoms TEXT[] NOT NULL,
    symptom_onset_date DATE NOT NULL,
    
    -- Severity
    fever_max_temp DECIMAL(4,1),
    severity_level VARCHAR(50), -- 'mild', 'moderate', 'severe'
    
    -- Treatment
    treatments_given TEXT[],
    medications_used TEXT[],
    
    -- Medical care
    doctor_visit BOOLEAN DEFAULT false,
    doctor_visit_date DATE,
    diagnosis VARCHAR(255),
    doctor_recommendations TEXT,
    
    -- Resolution
    resolved BOOLEAN DEFAULT false,
    resolution_date DATE,
    days_duration INTEGER,
    
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: developmental_milestones
-- Track developmental progress
CREATE TABLE IF NOT EXISTS developmental_milestones (
    id SERIAL PRIMARY KEY,
    child_id INTEGER NOT NULL REFERENCES children(id) ON DELETE CASCADE,
    
    milestone_category VARCHAR(100), -- 'motor', 'language', 'social', 'cognitive'
    milestone_name VARCHAR(255) NOT NULL,
    expected_age_months INTEGER,
    
    achieved BOOLEAN DEFAULT false,
    achieved_date DATE,
    achieved_age_months INTEGER,
    
    -- Assessment
    on_track BOOLEAN DEFAULT true,
    delayed BOOLEAN DEFAULT false,
    advanced BOOLEAN DEFAULT false,
    
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: pediatric_resources
-- Educational resources for parents
CREATE TABLE IF NOT EXISTS pediatric_resources (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100), -- 'medication_safety', 'growth', 'development', 'illness', 'nutrition'
    content_type VARCHAR(50), -- 'article', 'video', 'checklist', 'guide'
    
    content TEXT,
    key_points TEXT[],
    age_range VARCHAR(50), -- '0-6 months', '6-12 months', '1-2 years', etc.
    
    references TEXT[],
    author VARCHAR(255),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: safety_alerts
-- Safety alerts for parents
CREATE TABLE IF NOT EXISTS pediatric_safety_alerts (
    id SERIAL PRIMARY KEY,
    child_id INTEGER REFERENCES children(id) ON DELETE CASCADE,
    
    alert_type VARCHAR(100), -- 'dosage_warning', 'interaction_warning', 'overdue_vaccine', 'growth_concern'
    severity VARCHAR(50), -- 'info', 'warning', 'urgent'
    
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    action_required TEXT,
    
    triggered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    acknowledged BOOLEAN DEFAULT false,
    acknowledged_at TIMESTAMP,
    
    resolved BOOLEAN DEFAULT false,
    resolved_at TIMESTAMP,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_children_parent ON children(parent_user_id);
CREATE INDEX IF NOT EXISTS idx_growth_data_child ON growth_data(child_id);
CREATE INDEX IF NOT EXISTS idx_dosage_calculations_child ON dosage_calculations(child_id);
CREATE INDEX IF NOT EXISTS idx_active_medications_child ON child_active_medications(child_id);
CREATE INDEX IF NOT EXISTS idx_medication_log_child ON medication_administration_log(child_id);
CREATE INDEX IF NOT EXISTS idx_vaccinations_child ON vaccinations(child_id);
CREATE INDEX IF NOT EXISTS idx_illness_tracker_child ON illness_tracker(child_id);
CREATE INDEX IF NOT EXISTS idx_milestones_child ON developmental_milestones(child_id);
CREATE INDEX IF NOT EXISTS idx_safety_alerts_child ON pediatric_safety_alerts(child_id);
