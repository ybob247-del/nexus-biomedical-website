-- ElderWatch™ Database Schema
-- Geriatric Care Monitoring & Caregiver Support Platform
-- Created: November 20, 2025

-- Table: seniors
-- Stores senior patient information
CREATE TABLE IF NOT EXISTS seniors (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL, -- Link to main users table
    full_name VARCHAR(255) NOT NULL,
    date_of_birth DATE NOT NULL,
    age INTEGER,
    gender VARCHAR(20),
    living_situation VARCHAR(100), -- 'independent', 'assisted_living', 'nursing_home', 'with_family'
    primary_caregiver_id INTEGER, -- Link to caregivers table
    emergency_contact_name VARCHAR(255),
    emergency_contact_phone VARCHAR(50),
    emergency_contact_relationship VARCHAR(100),
    medical_conditions TEXT[],
    allergies TEXT[],
    mobility_level VARCHAR(50), -- 'independent', 'walker', 'wheelchair', 'bedridden'
    cognitive_status VARCHAR(50), -- 'normal', 'mild_impairment', 'moderate', 'severe', 'dementia'
    fall_risk_level VARCHAR(50), -- 'low', 'moderate', 'high'
    last_assessment_date DATE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: caregivers
-- Stores caregiver information
CREATE TABLE IF NOT EXISTS caregivers (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL, -- Link to main users table
    full_name VARCHAR(255) NOT NULL,
    relationship_to_senior VARCHAR(100), -- 'daughter', 'son', 'spouse', 'professional', etc.
    phone VARCHAR(50),
    email VARCHAR(255),
    is_primary BOOLEAN DEFAULT false,
    notification_preferences JSONB, -- email, sms, push
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: senior_caregivers
-- Many-to-many relationship between seniors and caregivers
CREATE TABLE IF NOT EXISTS senior_caregivers (
    id SERIAL PRIMARY KEY,
    senior_id INTEGER NOT NULL REFERENCES seniors(id) ON DELETE CASCADE,
    caregiver_id INTEGER NOT NULL REFERENCES caregivers(id) ON DELETE CASCADE,
    role VARCHAR(100), -- 'primary', 'secondary', 'emergency'
    permissions JSONB, -- What they can view/edit
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: medications
-- Tracks medications for seniors
CREATE TABLE IF NOT EXISTS senior_medications (
    id SERIAL PRIMARY KEY,
    senior_id INTEGER NOT NULL REFERENCES seniors(id) ON DELETE CASCADE,
    medication_name VARCHAR(255) NOT NULL,
    dosage VARCHAR(100),
    frequency VARCHAR(100), -- 'once_daily', 'twice_daily', 'as_needed', etc.
    time_of_day TEXT[], -- ['morning', 'afternoon', 'evening', 'bedtime']
    prescribing_doctor VARCHAR(255),
    start_date DATE,
    end_date DATE,
    is_active BOOLEAN DEFAULT true,
    purpose TEXT,
    side_effects TEXT[],
    special_instructions TEXT,
    refill_reminder_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: medication_reminders
-- Tracks medication reminder history
CREATE TABLE IF NOT EXISTS medication_reminders (
    id SERIAL PRIMARY KEY,
    medication_id INTEGER NOT NULL REFERENCES senior_medications(id) ON DELETE CASCADE,
    senior_id INTEGER NOT NULL REFERENCES seniors(id) ON DELETE CASCADE,
    reminder_time TIMESTAMP NOT NULL,
    was_taken BOOLEAN DEFAULT false,
    taken_at TIMESTAMP,
    confirmed_by INTEGER, -- caregiver_id who confirmed
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: health_assessments
-- Regular health check assessments
CREATE TABLE IF NOT EXISTS health_assessments (
    id SERIAL PRIMARY KEY,
    senior_id INTEGER NOT NULL REFERENCES seniors(id) ON DELETE CASCADE,
    assessment_type VARCHAR(100), -- 'daily_check', 'weekly_review', 'fall_risk', 'cognitive', 'comprehensive'
    assessment_date DATE NOT NULL,
    conducted_by INTEGER, -- caregiver_id
    
    -- Vital signs
    blood_pressure_systolic INTEGER,
    blood_pressure_diastolic INTEGER,
    heart_rate INTEGER,
    temperature DECIMAL(4,1),
    weight DECIMAL(5,1),
    
    -- Functional assessment
    mobility_score INTEGER CHECK (mobility_score BETWEEN 1 AND 10),
    balance_score INTEGER CHECK (balance_score BETWEEN 1 AND 10),
    pain_level INTEGER CHECK (pain_level BETWEEN 0 AND 10),
    
    -- Cognitive assessment
    memory_score INTEGER CHECK (memory_score BETWEEN 1 AND 10),
    orientation_score INTEGER CHECK (orientation_score BETWEEN 1 AND 10),
    mood VARCHAR(50), -- 'good', 'anxious', 'depressed', 'agitated', 'confused'
    
    -- Activities of Daily Living (ADL)
    bathing_independence BOOLEAN,
    dressing_independence BOOLEAN,
    eating_independence BOOLEAN,
    toileting_independence BOOLEAN,
    mobility_independence BOOLEAN,
    
    -- Overall assessment
    overall_health_rating INTEGER CHECK (overall_health_rating BETWEEN 1 AND 10),
    concerns TEXT[],
    recommendations TEXT[],
    follow_up_needed BOOLEAN DEFAULT false,
    follow_up_date DATE,
    notes TEXT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: fall_incidents
-- Tracks falls and near-falls
CREATE TABLE IF NOT EXISTS fall_incidents (
    id SERIAL PRIMARY KEY,
    senior_id INTEGER NOT NULL REFERENCES seniors(id) ON DELETE CASCADE,
    incident_date TIMESTAMP NOT NULL,
    location VARCHAR(255), -- 'bathroom', 'bedroom', 'stairs', 'outside', etc.
    circumstances TEXT,
    was_injured BOOLEAN DEFAULT false,
    injury_description TEXT,
    medical_attention_needed BOOLEAN DEFAULT false,
    medical_facility VARCHAR(255),
    reported_by INTEGER, -- caregiver_id
    preventive_measures_taken TEXT[],
    fall_risk_updated BOOLEAN DEFAULT false,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: alerts
-- System alerts for caregivers
CREATE TABLE IF NOT EXISTS elderwatch_alerts (
    id SERIAL PRIMARY KEY,
    senior_id INTEGER NOT NULL REFERENCES seniors(id) ON DELETE CASCADE,
    alert_type VARCHAR(100), -- 'medication_missed', 'fall_detected', 'vital_sign_abnormal', 'appointment_reminder', 'emergency'
    severity VARCHAR(50), -- 'low', 'medium', 'high', 'critical'
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    triggered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    acknowledged BOOLEAN DEFAULT false,
    acknowledged_by INTEGER, -- caregiver_id
    acknowledged_at TIMESTAMP,
    resolved BOOLEAN DEFAULT false,
    resolved_at TIMESTAMP,
    action_taken TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: appointments
-- Medical appointments tracking
CREATE TABLE IF NOT EXISTS medical_appointments (
    id SERIAL PRIMARY KEY,
    senior_id INTEGER NOT NULL REFERENCES seniors(id) ON DELETE CASCADE,
    appointment_type VARCHAR(100), -- 'doctor', 'specialist', 'dentist', 'physical_therapy', etc.
    doctor_name VARCHAR(255),
    facility_name VARCHAR(255),
    facility_address TEXT,
    appointment_date TIMESTAMP NOT NULL,
    duration_minutes INTEGER,
    purpose TEXT,
    transportation_arranged BOOLEAN DEFAULT false,
    caregiver_attending INTEGER, -- caregiver_id
    reminder_sent BOOLEAN DEFAULT false,
    status VARCHAR(50), -- 'scheduled', 'completed', 'cancelled', 'no_show'
    notes TEXT,
    follow_up_needed BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: daily_logs
-- Daily activity and observation logs
CREATE TABLE IF NOT EXISTS daily_logs (
    id SERIAL PRIMARY KEY,
    senior_id INTEGER NOT NULL REFERENCES seniors(id) ON DELETE CASCADE,
    log_date DATE NOT NULL,
    logged_by INTEGER, -- caregiver_id
    
    -- Daily activities
    meals_eaten INTEGER CHECK (meals_eaten BETWEEN 0 AND 3),
    fluid_intake VARCHAR(50), -- 'adequate', 'low', 'high'
    sleep_quality VARCHAR(50), -- 'good', 'fair', 'poor', 'restless'
    sleep_hours DECIMAL(3,1),
    bowel_movement BOOLEAN,
    
    -- Social/emotional
    mood VARCHAR(50),
    social_interaction BOOLEAN,
    activities_participated TEXT[],
    
    -- Physical
    exercise_done BOOLEAN,
    exercise_type VARCHAR(255),
    pain_reported BOOLEAN,
    pain_location VARCHAR(255),
    
    -- Observations
    observations TEXT,
    concerns TEXT[],
    highlights TEXT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: care_plans
-- Individualized care plans
CREATE TABLE IF NOT EXISTS care_plans (
    id SERIAL PRIMARY KEY,
    senior_id INTEGER NOT NULL REFERENCES seniors(id) ON DELETE CASCADE,
    plan_name VARCHAR(255) NOT NULL,
    created_by INTEGER, -- caregiver_id or healthcare provider
    start_date DATE NOT NULL,
    review_date DATE,
    is_active BOOLEAN DEFAULT true,
    
    -- Goals
    goals TEXT[],
    interventions JSONB, -- Structured care interventions
    
    -- Monitoring
    monitoring_frequency VARCHAR(100),
    vital_signs_to_track TEXT[],
    symptoms_to_monitor TEXT[],
    
    -- Team
    care_team JSONB, -- doctors, nurses, therapists, caregivers
    
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_seniors_user ON seniors(user_id);
CREATE INDEX IF NOT EXISTS idx_caregivers_user ON caregivers(user_id);
CREATE INDEX IF NOT EXISTS idx_senior_caregivers_senior ON senior_caregivers(senior_id);
CREATE INDEX IF NOT EXISTS idx_senior_caregivers_caregiver ON senior_caregivers(caregiver_id);
CREATE INDEX IF NOT EXISTS idx_senior_medications_senior ON senior_medications(senior_id);
CREATE INDEX IF NOT EXISTS idx_medication_reminders_senior ON medication_reminders(senior_id);
CREATE INDEX IF NOT EXISTS idx_health_assessments_senior ON health_assessments(senior_id);
CREATE INDEX IF NOT EXISTS idx_fall_incidents_senior ON fall_incidents(senior_id);
CREATE INDEX IF NOT EXISTS idx_elderwatch_alerts_senior ON elderwatch_alerts(senior_id);
CREATE INDEX IF NOT EXISTS idx_medical_appointments_senior ON medical_appointments(senior_id);
CREATE INDEX IF NOT EXISTS idx_daily_logs_senior ON daily_logs(senior_id);
CREATE INDEX IF NOT EXISTS idx_care_plans_senior ON care_plans(senior_id);
