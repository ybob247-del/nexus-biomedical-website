-- SkinScan Pro™ Database Schema
-- AI-Powered Dermatology Image Analysis & Skin Health Tracking
-- Created: November 20, 2025

-- Table: user_skin_profiles
-- User skin health profiles
CREATE TABLE IF NOT EXISTS user_skin_profiles (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL, -- Link to main users table
    
    -- Demographics
    age INTEGER,
    gender VARCHAR(50),
    ethnicity VARCHAR(100),
    
    -- Skin type (Fitzpatrick scale)
    fitzpatrick_type INTEGER CHECK (fitzpatrick_type BETWEEN 1 AND 6),
    skin_tone VARCHAR(50), -- 'very_fair', 'fair', 'medium', 'olive', 'brown', 'dark_brown'
    
    -- Skin characteristics
    skin_type VARCHAR(50), -- 'normal', 'dry', 'oily', 'combination', 'sensitive'
    skin_concerns TEXT[], -- 'acne', 'rosacea', 'eczema', 'psoriasis', 'aging', 'hyperpigmentation'
    
    -- Sun exposure
    sun_exposure_level VARCHAR(50), -- 'minimal', 'moderate', 'high', 'very_high'
    tans_easily BOOLEAN,
    burns_easily BOOLEAN,
    history_of_sunburns INTEGER,
    uses_sunscreen BOOLEAN DEFAULT false,
    sunscreen_spf INTEGER,
    
    -- Medical history
    skin_conditions TEXT[],
    allergies TEXT[],
    current_medications TEXT[],
    previous_skin_treatments TEXT[],
    
    -- Family history
    family_history_skin_cancer BOOLEAN DEFAULT false,
    family_history_melanoma BOOLEAN DEFAULT false,
    family_history_other TEXT[],
    
    -- Risk factors
    has_many_moles BOOLEAN DEFAULT false,
    has_atypical_moles BOOLEAN DEFAULT false,
    immunosuppressed BOOLEAN DEFAULT false,
    
    -- Dermatologist
    has_dermatologist BOOLEAN DEFAULT false,
    dermatologist_name VARCHAR(255),
    last_derm_visit DATE,
    
    -- Profile completion
    profile_completed BOOLEAN DEFAULT false,
    
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: skin_scans
-- Individual skin scan images and analyses
CREATE TABLE IF NOT EXISTS skin_scans (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    skin_profile_id INTEGER REFERENCES user_skin_profiles(id) ON DELETE CASCADE,
    
    -- Image information
    image_path TEXT NOT NULL,
    image_url TEXT,
    thumbnail_path TEXT,
    
    -- Scan metadata
    scan_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    body_location VARCHAR(100), -- 'face', 'neck', 'chest', 'back', 'arm', 'leg', 'hand', 'foot', etc.
    specific_location TEXT, -- More detailed description
    
    -- Image quality
    image_quality VARCHAR(50), -- 'excellent', 'good', 'fair', 'poor'
    quality_issues TEXT[], -- 'blurry', 'poor_lighting', 'too_far', 'too_close'
    
    -- Lesion details
    lesion_detected BOOLEAN DEFAULT false,
    lesion_count INTEGER DEFAULT 0,
    primary_concern VARCHAR(255),
    
    -- AI analysis results
    ai_analysis_completed BOOLEAN DEFAULT false,
    ai_analysis_date TIMESTAMP,
    ai_model_version VARCHAR(50),
    
    -- AI predictions
    predicted_conditions JSONB, -- Array of {condition, confidence, severity}
    risk_level VARCHAR(50), -- 'low', 'moderate', 'high', 'urgent'
    confidence_score DECIMAL(5,2), -- 0-100
    
    -- Specific condition probabilities
    melanoma_probability DECIMAL(5,2),
    basal_cell_carcinoma_probability DECIMAL(5,2),
    squamous_cell_carcinoma_probability DECIMAL(5,2),
    actinic_keratosis_probability DECIMAL(5,2),
    seborrheic_keratosis_probability DECIMAL(5,2),
    nevus_probability DECIMAL(5,2),
    
    -- ABCDE criteria (for moles)
    asymmetry_score INTEGER CHECK (asymmetry_score BETWEEN 0 AND 10),
    border_irregularity_score INTEGER CHECK (border_irregularity_score BETWEEN 0 AND 10),
    color_variation_score INTEGER CHECK (color_variation_score BETWEEN 0 AND 10),
    diameter_mm DECIMAL(4,1),
    evolving BOOLEAN DEFAULT false,
    
    -- Recommendations
    ai_recommendations TEXT[],
    urgency_level VARCHAR(50), -- 'routine', 'soon', 'urgent', 'emergency'
    dermatologist_referral_recommended BOOLEAN DEFAULT false,
    
    -- User actions
    viewed BOOLEAN DEFAULT true,
    saved BOOLEAN DEFAULT false,
    shared_with_doctor BOOLEAN DEFAULT false,
    
    -- Follow-up
    requires_monitoring BOOLEAN DEFAULT false,
    next_scan_recommended_date DATE,
    
    -- Professional review
    reviewed_by_dermatologist BOOLEAN DEFAULT false,
    dermatologist_diagnosis TEXT,
    dermatologist_notes TEXT,
    review_date TIMESTAMP,
    
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: lesion_tracking
-- Track specific lesions over time
CREATE TABLE IF NOT EXISTS lesion_tracking (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    skin_profile_id INTEGER REFERENCES user_skin_profiles(id) ON DELETE CASCADE,
    
    lesion_id VARCHAR(100) UNIQUE NOT NULL, -- Unique identifier for this lesion
    lesion_name VARCHAR(255), -- User-friendly name, e.g., "Mole on left shoulder"
    
    -- Location
    body_location VARCHAR(100) NOT NULL,
    specific_location TEXT,
    location_photo_path TEXT, -- Reference photo showing location
    
    -- Initial detection
    first_detected_date DATE NOT NULL,
    first_scan_id INTEGER REFERENCES skin_scans(id),
    
    -- Current status
    current_status VARCHAR(50), -- 'monitoring', 'stable', 'changing', 'removed', 'biopsied'
    is_active BOOLEAN DEFAULT true,
    
    -- Monitoring
    monitoring_frequency VARCHAR(50), -- 'monthly', 'quarterly', 'semi_annual', 'annual'
    last_scan_date DATE,
    next_scan_due_date DATE,
    total_scans INTEGER DEFAULT 1,
    
    -- Changes detected
    has_changed BOOLEAN DEFAULT false,
    change_detected_date DATE,
    changes_observed TEXT[],
    
    -- Risk assessment
    risk_level VARCHAR(50), -- 'low', 'moderate', 'high'
    risk_factors TEXT[],
    
    -- Medical intervention
    biopsy_performed BOOLEAN DEFAULT false,
    biopsy_date DATE,
    biopsy_result TEXT,
    
    removed BOOLEAN DEFAULT false,
    removal_date DATE,
    removal_method VARCHAR(100),
    pathology_result TEXT,
    
    -- Diagnosis
    final_diagnosis VARCHAR(255),
    is_benign BOOLEAN,
    is_malignant BOOLEAN,
    
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: lesion_scans
-- Link scans to tracked lesions
CREATE TABLE IF NOT EXISTS lesion_scans (
    id SERIAL PRIMARY KEY,
    lesion_id INTEGER NOT NULL REFERENCES lesion_tracking(id) ON DELETE CASCADE,
    scan_id INTEGER NOT NULL REFERENCES skin_scans(id) ON DELETE CASCADE,
    
    scan_sequence_number INTEGER, -- 1st scan, 2nd scan, etc.
    
    -- Comparison with previous scan
    compared_to_previous BOOLEAN DEFAULT false,
    changes_detected BOOLEAN DEFAULT false,
    change_summary TEXT,
    
    -- Measurements
    size_mm DECIMAL(4,1),
    size_change_mm DECIMAL(4,1), -- Positive = growth, negative = shrinkage
    size_change_percentage DECIMAL(5,2),
    
    color_change BOOLEAN DEFAULT false,
    shape_change BOOLEAN DEFAULT false,
    border_change BOOLEAN DEFAULT false,
    
    -- AI comparison
    ai_change_score INTEGER CHECK (ai_change_score BETWEEN 0 AND 100),
    ai_change_assessment VARCHAR(50), -- 'stable', 'minor_change', 'significant_change', 'concerning'
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: skin_conditions
-- Database of skin conditions
CREATE TABLE IF NOT EXISTS skin_conditions (
    id SERIAL PRIMARY KEY,
    
    condition_name VARCHAR(255) NOT NULL,
    common_names TEXT[],
    medical_name VARCHAR(255),
    
    category VARCHAR(100), -- 'cancer', 'precancer', 'benign', 'inflammatory', 'infectious', 'autoimmune'
    severity VARCHAR(50), -- 'benign', 'concerning', 'serious', 'urgent'
    
    description TEXT,
    symptoms TEXT[],
    causes TEXT[],
    risk_factors TEXT[],
    
    -- Visual characteristics
    typical_appearance TEXT,
    color_characteristics TEXT[],
    texture_characteristics TEXT[],
    size_range VARCHAR(100),
    
    -- Prevalence
    prevalence VARCHAR(50), -- 'very_common', 'common', 'uncommon', 'rare'
    age_groups_affected TEXT[],
    
    -- Treatment
    treatment_options TEXT[],
    urgency_level VARCHAR(50),
    requires_specialist BOOLEAN DEFAULT false,
    
    -- Prognosis
    prognosis TEXT,
    can_resolve_spontaneously BOOLEAN DEFAULT false,
    
    -- References
    references TEXT[],
    images_paths TEXT[],
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: dermatologist_referrals
-- Track referrals to dermatologists
CREATE TABLE IF NOT EXISTS dermatologist_referrals (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    scan_id INTEGER REFERENCES skin_scans(id),
    lesion_id INTEGER REFERENCES lesion_tracking(id),
    
    referral_date DATE NOT NULL,
    referral_reason TEXT NOT NULL,
    urgency_level VARCHAR(50), -- 'routine', 'soon', 'urgent'
    
    -- Dermatologist
    dermatologist_name VARCHAR(255),
    clinic_name VARCHAR(255),
    clinic_address TEXT,
    clinic_phone VARCHAR(50),
    
    -- Appointment
    appointment_scheduled BOOLEAN DEFAULT false,
    appointment_date TIMESTAMP,
    appointment_confirmed BOOLEAN DEFAULT false,
    
    -- Visit
    visit_completed BOOLEAN DEFAULT false,
    visit_date DATE,
    
    -- Diagnosis
    diagnosis TEXT,
    treatment_plan TEXT,
    follow_up_required BOOLEAN DEFAULT false,
    follow_up_date DATE,
    
    -- Outcome
    outcome VARCHAR(100), -- 'benign', 'biopsy_needed', 'treatment_needed', 'cancer_detected'
    
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: skin_health_tips
-- Educational content and tips
CREATE TABLE IF NOT EXISTS skin_health_tips (
    id SERIAL PRIMARY KEY,
    
    tip_category VARCHAR(100), -- 'sun_protection', 'skin_care', 'prevention', 'early_detection', 'treatment'
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    
    -- Targeting
    relevant_for_skin_types TEXT[],
    relevant_for_conditions TEXT[],
    relevant_for_risk_levels TEXT[],
    
    -- Media
    image_path TEXT,
    video_url TEXT,
    
    -- Engagement
    views_count INTEGER DEFAULT 0,
    helpful_count INTEGER DEFAULT 0,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: scan_alerts
-- Alerts for users
CREATE TABLE IF NOT EXISTS scan_alerts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    scan_id INTEGER REFERENCES skin_scans(id),
    lesion_id INTEGER REFERENCES lesion_tracking(id),
    
    alert_type VARCHAR(100), -- 'high_risk_detected', 'lesion_changed', 'scan_reminder', 'appointment_reminder'
    severity VARCHAR(50), -- 'info', 'warning', 'urgent', 'critical'
    
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    action_required TEXT,
    
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

-- Table: scan_history
-- Aggregate scan history and trends
CREATE TABLE IF NOT EXISTS scan_history (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    
    -- Time period
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    
    -- Statistics
    total_scans INTEGER DEFAULT 0,
    new_lesions_detected INTEGER DEFAULT 0,
    lesions_changed INTEGER DEFAULT 0,
    high_risk_scans INTEGER DEFAULT 0,
    
    -- Trends
    overall_skin_health_trend VARCHAR(50), -- 'improving', 'stable', 'declining'
    
    -- Summary
    summary TEXT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_skin_profiles_user ON user_skin_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_skin_scans_user ON skin_scans(user_id);
CREATE INDEX IF NOT EXISTS idx_skin_scans_profile ON skin_scans(skin_profile_id);
CREATE INDEX IF NOT EXISTS idx_lesion_tracking_user ON lesion_tracking(user_id);
CREATE INDEX IF NOT EXISTS idx_lesion_tracking_profile ON lesion_tracking(skin_profile_id);
CREATE INDEX IF NOT EXISTS idx_lesion_scans_lesion ON lesion_scans(lesion_id);
CREATE INDEX IF NOT EXISTS idx_lesion_scans_scan ON lesion_scans(scan_id);
CREATE INDEX IF NOT EXISTS idx_dermatologist_referrals_user ON dermatologist_referrals(user_id);
CREATE INDEX IF NOT EXISTS idx_scan_alerts_user ON scan_alerts(user_id);
CREATE INDEX IF NOT EXISTS idx_scan_history_user ON scan_history(user_id);
