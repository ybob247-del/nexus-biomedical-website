-- ClinicalIQ™ Database Schema
-- Clinical Trial Matching & Patient Recruitment Platform
-- Created: November 20, 2025

-- Table: patient_profiles
-- Patient information for trial matching
CREATE TABLE IF NOT EXISTS patient_profiles (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL, -- Link to main users table
    
    -- Demographics
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    date_of_birth DATE,
    age INTEGER,
    gender VARCHAR(50),
    ethnicity VARCHAR(100),
    race TEXT[],
    
    -- Location
    city VARCHAR(255),
    state VARCHAR(100),
    zip_code VARCHAR(20),
    country VARCHAR(100),
    willing_to_travel BOOLEAN DEFAULT false,
    max_travel_distance_miles INTEGER,
    
    -- Medical history
    primary_diagnosis VARCHAR(255),
    diagnosis_date DATE,
    disease_stage VARCHAR(100),
    biomarkers JSONB, -- Genetic markers, protein levels, etc.
    
    -- Current health status
    current_treatments TEXT[],
    previous_treatments TEXT[],
    treatment_history JSONB,
    current_medications TEXT[],
    allergies TEXT[],
    comorbidities TEXT[],
    
    -- Performance status
    ecog_score INTEGER CHECK (ecog_score BETWEEN 0 AND 5), -- Eastern Cooperative Oncology Group
    karnofsky_score INTEGER CHECK (karnofsky_score BETWEEN 0 AND 100),
    
    -- Lab values (recent)
    lab_values JSONB,
    lab_date DATE,
    
    -- Trial preferences
    preferred_trial_types TEXT[], -- 'drug', 'device', 'behavioral', 'diagnostic'
    preferred_phases TEXT[], -- 'phase_1', 'phase_2', 'phase_3', 'phase_4'
    willing_placebo BOOLEAN DEFAULT true,
    
    -- Contact preferences
    preferred_contact_method VARCHAR(50),
    phone VARCHAR(50),
    email VARCHAR(255),
    
    -- Privacy
    share_data_with_researchers BOOLEAN DEFAULT false,
    
    notes TEXT,
    profile_completed BOOLEAN DEFAULT false,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: clinical_trials
-- Clinical trial information from ClinicalTrials.gov and other sources
CREATE TABLE IF NOT EXISTS clinical_trials (
    id SERIAL PRIMARY KEY,
    nct_id VARCHAR(50) UNIQUE NOT NULL, -- ClinicalTrials.gov identifier
    
    -- Basic information
    official_title TEXT NOT NULL,
    brief_title VARCHAR(500),
    acronym VARCHAR(100),
    study_type VARCHAR(100), -- 'Interventional', 'Observational', 'Expanded Access'
    
    -- Status
    overall_status VARCHAR(100), -- 'Recruiting', 'Active', 'Completed', 'Suspended', etc.
    phase VARCHAR(50), -- 'Phase 1', 'Phase 2', 'Phase 3', 'Phase 4', 'N/A'
    enrollment_count INTEGER,
    
    -- Dates
    start_date DATE,
    completion_date DATE,
    last_update_date DATE,
    
    -- Study details
    brief_summary TEXT,
    detailed_description TEXT,
    study_design TEXT,
    primary_outcome TEXT,
    secondary_outcomes TEXT[],
    
    -- Condition
    conditions TEXT[] NOT NULL,
    keywords TEXT[],
    
    -- Intervention
    intervention_type VARCHAR(100), -- 'Drug', 'Device', 'Biological', 'Behavioral', etc.
    intervention_name VARCHAR(255),
    intervention_description TEXT,
    
    -- Eligibility
    eligibility_criteria TEXT,
    min_age VARCHAR(50),
    max_age VARCHAR(50),
    gender VARCHAR(50),
    accepts_healthy_volunteers BOOLEAN DEFAULT false,
    
    -- Locations
    locations JSONB, -- Array of facility locations
    countries TEXT[],
    
    -- Sponsor
    sponsor_name VARCHAR(255),
    sponsor_type VARCHAR(100), -- 'Industry', 'NIH', 'Other Government', 'Academic'
    collaborators TEXT[],
    
    -- Contact
    contact_name VARCHAR(255),
    contact_phone VARCHAR(50),
    contact_email VARCHAR(255),
    
    -- Links
    clinicaltrials_gov_url TEXT,
    study_documents_url TEXT,
    
    -- Metadata
    last_synced_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: trial_matches
-- Matched trials for patients
CREATE TABLE IF NOT EXISTS trial_matches (
    id SERIAL PRIMARY KEY,
    patient_profile_id INTEGER NOT NULL REFERENCES patient_profiles(id) ON DELETE CASCADE,
    trial_id INTEGER NOT NULL REFERENCES clinical_trials(id) ON DELETE CASCADE,
    
    -- Match quality
    match_score INTEGER CHECK (match_score BETWEEN 0 AND 100),
    match_confidence VARCHAR(50), -- 'high', 'medium', 'low'
    
    -- Match criteria
    criteria_met TEXT[],
    criteria_not_met TEXT[],
    potential_barriers TEXT[],
    
    -- Distance
    nearest_location_city VARCHAR(255),
    nearest_location_state VARCHAR(100),
    distance_miles INTEGER,
    
    -- AI analysis
    ai_recommendation TEXT,
    pros TEXT[],
    cons TEXT[],
    
    -- Patient interaction
    viewed BOOLEAN DEFAULT false,
    viewed_at TIMESTAMP,
    saved BOOLEAN DEFAULT false,
    saved_at TIMESTAMP,
    interested BOOLEAN DEFAULT false,
    
    -- Status
    application_status VARCHAR(50), -- 'not_applied', 'applied', 'screening', 'enrolled', 'declined', 'ineligible'
    
    matched_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: trial_applications
-- Track patient applications to trials
CREATE TABLE IF NOT EXISTS trial_applications (
    id SERIAL PRIMARY KEY,
    patient_profile_id INTEGER NOT NULL REFERENCES patient_profiles(id) ON DELETE CASCADE,
    trial_id INTEGER NOT NULL REFERENCES clinical_trials(id) ON DELETE CASCADE,
    match_id INTEGER REFERENCES trial_matches(id),
    
    -- Application details
    application_date DATE NOT NULL,
    preferred_location VARCHAR(255),
    
    -- Screening
    screening_status VARCHAR(50), -- 'pending', 'scheduled', 'completed', 'passed', 'failed'
    screening_date DATE,
    screening_location VARCHAR(255),
    screening_notes TEXT,
    
    -- Eligibility determination
    is_eligible BOOLEAN,
    ineligibility_reasons TEXT[],
    
    -- Enrollment
    enrollment_status VARCHAR(50), -- 'pending', 'enrolled', 'declined', 'waitlisted'
    enrollment_date DATE,
    enrollment_id VARCHAR(100), -- Trial-specific patient ID
    
    -- Consent
    informed_consent_signed BOOLEAN DEFAULT false,
    consent_date DATE,
    
    -- Coordinator contact
    coordinator_name VARCHAR(255),
    coordinator_phone VARCHAR(50),
    coordinator_email VARCHAR(255),
    
    -- Communication log
    last_contact_date DATE,
    next_followup_date DATE,
    communication_notes TEXT,
    
    -- Withdrawal
    withdrawn BOOLEAN DEFAULT false,
    withdrawal_date DATE,
    withdrawal_reason TEXT,
    
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: trial_participation
-- Active participation tracking
CREATE TABLE IF NOT EXISTS trial_participation (
    id SERIAL PRIMARY KEY,
    patient_profile_id INTEGER NOT NULL REFERENCES patient_profiles(id) ON DELETE CASCADE,
    trial_id INTEGER NOT NULL REFERENCES clinical_trials(id) ON DELETE CASCADE,
    application_id INTEGER REFERENCES trial_applications(id),
    
    -- Participation details
    enrollment_date DATE NOT NULL,
    expected_completion_date DATE,
    actual_completion_date DATE,
    
    -- Study arm
    study_arm VARCHAR(255), -- 'Treatment', 'Placebo', 'Control', etc.
    is_blinded BOOLEAN DEFAULT true,
    
    -- Visit schedule
    total_visits_required INTEGER,
    visits_completed INTEGER DEFAULT 0,
    next_visit_date DATE,
    
    -- Compliance
    compliance_rate INTEGER CHECK (compliance_rate BETWEEN 0 AND 100),
    missed_visits INTEGER DEFAULT 0,
    protocol_deviations INTEGER DEFAULT 0,
    
    -- Adverse events
    adverse_events_reported INTEGER DEFAULT 0,
    serious_adverse_events INTEGER DEFAULT 0,
    
    -- Status
    participation_status VARCHAR(50), -- 'active', 'completed', 'withdrawn', 'discontinued'
    completion_reason VARCHAR(255),
    
    -- Compensation
    compensation_amount DECIMAL(10,2),
    compensation_received DECIMAL(10,2),
    
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: trial_visits
-- Track individual trial visits
CREATE TABLE IF NOT EXISTS trial_visits (
    id SERIAL PRIMARY KEY,
    participation_id INTEGER NOT NULL REFERENCES trial_participation(id) ON DELETE CASCADE,
    
    visit_number INTEGER NOT NULL,
    visit_type VARCHAR(100), -- 'screening', 'baseline', 'treatment', 'follow_up', 'final'
    
    scheduled_date DATE NOT NULL,
    actual_date DATE,
    
    location VARCHAR(255),
    duration_minutes INTEGER,
    
    -- Procedures
    procedures_performed TEXT[],
    labs_drawn TEXT[],
    imaging_done TEXT[],
    
    -- Assessments
    assessments_completed TEXT[],
    questionnaires_completed TEXT[],
    
    -- Study drug/intervention
    intervention_administered BOOLEAN DEFAULT false,
    dose_administered VARCHAR(100),
    
    -- Adverse events
    adverse_events_reported TEXT[],
    
    -- Compliance
    attended BOOLEAN DEFAULT false,
    no_show_reason TEXT,
    
    -- Coordinator notes
    coordinator_notes TEXT,
    patient_concerns TEXT,
    
    -- Next steps
    next_visit_scheduled DATE,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: trial_alerts
-- Alerts and notifications for patients
CREATE TABLE IF NOT EXISTS trial_alerts (
    id SERIAL PRIMARY KEY,
    patient_profile_id INTEGER NOT NULL REFERENCES patient_profiles(id) ON DELETE CASCADE,
    trial_id INTEGER REFERENCES clinical_trials(id),
    
    alert_type VARCHAR(100), -- 'new_match', 'visit_reminder', 'screening_scheduled', 'result_available', 'trial_update'
    priority VARCHAR(50), -- 'low', 'medium', 'high', 'urgent'
    
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    action_required TEXT,
    action_url TEXT,
    
    triggered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Delivery
    sent_email BOOLEAN DEFAULT false,
    sent_sms BOOLEAN DEFAULT false,
    sent_push BOOLEAN DEFAULT false,
    
    -- Acknowledgment
    read BOOLEAN DEFAULT false,
    read_at TIMESTAMP,
    acknowledged BOOLEAN DEFAULT false,
    acknowledged_at TIMESTAMP,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: saved_searches
-- Save patient search criteria
CREATE TABLE IF NOT EXISTS saved_searches (
    id SERIAL PRIMARY KEY,
    patient_profile_id INTEGER NOT NULL REFERENCES patient_profiles(id) ON DELETE CASCADE,
    
    search_name VARCHAR(255) NOT NULL,
    search_criteria JSONB NOT NULL,
    
    -- Notifications
    notify_new_matches BOOLEAN DEFAULT true,
    notification_frequency VARCHAR(50), -- 'immediate', 'daily', 'weekly'
    
    last_run_at TIMESTAMP,
    new_matches_count INTEGER DEFAULT 0,
    
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: trial_reviews
-- Patient reviews and feedback on trials
CREATE TABLE IF NOT EXISTS trial_reviews (
    id SERIAL PRIMARY KEY,
    patient_profile_id INTEGER NOT NULL REFERENCES patient_profiles(id) ON DELETE CASCADE,
    trial_id INTEGER NOT NULL REFERENCES clinical_trials(id) ON DELETE CASCADE,
    
    rating INTEGER CHECK (rating BETWEEN 1 AND 5),
    
    -- Experience ratings
    coordinator_rating INTEGER CHECK (coordinator_rating BETWEEN 1 AND 5),
    facility_rating INTEGER CHECK (facility_rating BETWEEN 1 AND 5),
    communication_rating INTEGER CHECK (communication_rating BETWEEN 1 AND 5),
    
    -- Feedback
    title VARCHAR(255),
    review_text TEXT,
    pros TEXT[],
    cons TEXT[],
    
    would_recommend BOOLEAN,
    
    -- Verification
    verified_participant BOOLEAN DEFAULT false,
    
    helpful_count INTEGER DEFAULT 0,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_patient_profiles_user ON patient_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_clinical_trials_nct ON clinical_trials(nct_id);
CREATE INDEX IF NOT EXISTS idx_clinical_trials_status ON clinical_trials(overall_status);
CREATE INDEX IF NOT EXISTS idx_trial_matches_patient ON trial_matches(patient_profile_id);
CREATE INDEX IF NOT EXISTS idx_trial_matches_trial ON trial_matches(trial_id);
CREATE INDEX IF NOT EXISTS idx_trial_applications_patient ON trial_applications(patient_profile_id);
CREATE INDEX IF NOT EXISTS idx_trial_applications_trial ON trial_applications(trial_id);
CREATE INDEX IF NOT EXISTS idx_trial_participation_patient ON trial_participation(patient_profile_id);
CREATE INDEX IF NOT EXISTS idx_trial_visits_participation ON trial_visits(participation_id);
CREATE INDEX IF NOT EXISTS idx_trial_alerts_patient ON trial_alerts(patient_profile_id);
CREATE INDEX IF NOT EXISTS idx_saved_searches_patient ON saved_searches(patient_profile_id);
CREATE INDEX IF NOT EXISTS idx_trial_reviews_trial ON trial_reviews(trial_id);
