-- EndoGuard™ Database Schema
-- Environmental Health & Hormone Wellness Platform
-- Created: November 20, 2025

-- Table: edc_chemicals
-- Stores endocrine disrupting chemical information from EPA
CREATE TABLE IF NOT EXISTS edc_chemicals (
    id SERIAL PRIMARY KEY,
    cas_number VARCHAR(50) UNIQUE NOT NULL, -- Chemical Abstracts Service number
    chemical_name VARCHAR(255) NOT NULL,
    common_names TEXT[],
    chemical_class VARCHAR(100),
    edc_category VARCHAR(100), -- 'confirmed', 'suspected', 'potential'
    hormone_systems_affected TEXT[], -- 'thyroid', 'reproductive', 'adrenal', etc.
    health_effects TEXT,
    common_sources TEXT[], -- Where found (plastics, pesticides, cosmetics, etc.)
    exposure_routes TEXT[], -- 'ingestion', 'inhalation', 'dermal'
    bioaccumulation_potential VARCHAR(50),
    regulatory_status TEXT,
    epa_data JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: user_assessments
-- Stores user hormone health assessments
CREATE TABLE IF NOT EXISTS user_assessments (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    assessment_type VARCHAR(50) NOT NULL, -- 'initial', 'follow_up', 'quarterly'
    age INTEGER,
    biological_sex VARCHAR(20),
    menstrual_status VARCHAR(50), -- 'regular', 'irregular', 'menopausal', 'n/a'
    
    -- Symptom tracking
    symptoms JSONB, -- Structured symptom data
    symptom_severity INTEGER CHECK (symptom_severity BETWEEN 1 AND 10),
    symptom_duration VARCHAR(50),
    
    -- Lifestyle factors
    diet_quality VARCHAR(50),
    exercise_frequency VARCHAR(50),
    sleep_quality VARCHAR(50),
    stress_level INTEGER CHECK (stress_level BETWEEN 1 AND 10),
    
    -- Exposure assessment
    plastic_use_frequency VARCHAR(50),
    processed_food_frequency VARCHAR(50),
    personal_care_products TEXT[],
    household_products TEXT[],
    occupational_exposure BOOLEAN DEFAULT false,
    water_source VARCHAR(100),
    
    -- Health conditions
    existing_conditions TEXT[],
    medications TEXT[],
    supplements TEXT[],
    
    -- Assessment results
    risk_score INTEGER CHECK (risk_score BETWEEN 0 AND 100),
    primary_concerns TEXT[],
    ai_analysis TEXT,
    
    completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: symptom_categories
-- Predefined symptom categories for hormone issues
CREATE TABLE IF NOT EXISTS symptom_categories (
    id SERIAL PRIMARY KEY,
    category_name VARCHAR(100) NOT NULL,
    hormone_system VARCHAR(100), -- 'thyroid', 'reproductive', 'adrenal', 'insulin'
    symptoms TEXT[],
    description TEXT,
    severity_indicators TEXT
);

-- Table: exposure_assessments
-- Detailed EDC exposure tracking
CREATE TABLE IF NOT EXISTS exposure_assessments (
    id SERIAL PRIMARY KEY,
    assessment_id INTEGER NOT NULL REFERENCES user_assessments(id) ON DELETE CASCADE,
    chemical_id INTEGER REFERENCES edc_chemicals(id),
    exposure_source VARCHAR(255),
    exposure_frequency VARCHAR(50),
    exposure_level VARCHAR(50), -- 'low', 'moderate', 'high'
    confidence_level VARCHAR(50), -- 'confirmed', 'likely', 'possible'
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: recommendations
-- AI-generated personalized recommendations
CREATE TABLE IF NOT EXISTS recommendations (
    id SERIAL PRIMARY KEY,
    assessment_id INTEGER NOT NULL REFERENCES user_assessments(id) ON DELETE CASCADE,
    category VARCHAR(100) NOT NULL, -- 'lifestyle', 'diet', 'products', 'supplements', 'medical'
    priority VARCHAR(50), -- 'urgent', 'high', 'medium', 'low'
    recommendation_text TEXT NOT NULL,
    rationale TEXT,
    expected_benefit TEXT,
    implementation_difficulty VARCHAR(50),
    estimated_cost VARCHAR(50),
    evidence_level VARCHAR(50), -- 'strong', 'moderate', 'limited'
    resources TEXT[], -- Links to products, articles, etc.
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: supplement_protocols
-- Evidence-based supplement recommendations
CREATE TABLE IF NOT EXISTS supplement_protocols (
    id SERIAL PRIMARY KEY,
    protocol_name VARCHAR(255) NOT NULL,
    target_condition VARCHAR(255),
    hormone_system VARCHAR(100),
    supplements JSONB, -- Array of supplements with dosages
    duration_weeks INTEGER,
    expected_outcomes TEXT,
    contraindications TEXT,
    monitoring_recommendations TEXT,
    evidence_summary TEXT,
    research_citations TEXT[],
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: user_supplement_plans
-- User-specific supplement plans
CREATE TABLE IF NOT EXISTS user_supplement_plans (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    assessment_id INTEGER REFERENCES user_assessments(id),
    protocol_id INTEGER REFERENCES supplement_protocols(id),
    start_date DATE NOT NULL,
    end_date DATE,
    is_active BOOLEAN DEFAULT true,
    adherence_rate INTEGER CHECK (adherence_rate BETWEEN 0 AND 100),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: progress_tracking
-- Track user progress over time
CREATE TABLE IF NOT EXISTS progress_tracking (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    assessment_id INTEGER REFERENCES user_assessments(id),
    tracking_date DATE NOT NULL,
    symptom_changes JSONB,
    lifestyle_changes JSONB,
    overall_improvement INTEGER CHECK (overall_improvement BETWEEN -10 AND 10),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: product_database
-- Safe product alternatives database
CREATE TABLE IF NOT EXISTS product_database (
    id SERIAL PRIMARY KEY,
    product_name VARCHAR(255) NOT NULL,
    product_category VARCHAR(100), -- 'personal_care', 'household', 'food_storage', etc.
    brand VARCHAR(255),
    edc_free BOOLEAN DEFAULT false,
    certifications TEXT[], -- 'EWG_Verified', 'USDA_Organic', etc.
    ingredients TEXT[],
    harmful_ingredients TEXT[],
    safety_rating VARCHAR(50),
    price_range VARCHAR(50),
    where_to_buy TEXT[],
    product_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: educational_content
-- Educational resources about EDCs and hormone health
CREATE TABLE IF NOT EXISTS educational_content (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content_type VARCHAR(50), -- 'article', 'video', 'infographic', 'guide'
    category VARCHAR(100),
    content TEXT,
    key_takeaways TEXT[],
    references TEXT[],
    difficulty_level VARCHAR(50), -- 'beginner', 'intermediate', 'advanced'
    reading_time_minutes INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_edc_chemicals_cas ON edc_chemicals(cas_number);
CREATE INDEX IF NOT EXISTS idx_edc_chemicals_name ON edc_chemicals(chemical_name);
CREATE INDEX IF NOT EXISTS idx_user_assessments_user ON user_assessments(user_id);
CREATE INDEX IF NOT EXISTS idx_exposure_assessments_assessment ON exposure_assessments(assessment_id);
CREATE INDEX IF NOT EXISTS idx_recommendations_assessment ON recommendations(assessment_id);
CREATE INDEX IF NOT EXISTS idx_user_supplement_plans_user ON user_supplement_plans(user_id);
CREATE INDEX IF NOT EXISTS idx_progress_tracking_user ON progress_tracking(user_id);
CREATE INDEX IF NOT EXISTS idx_product_database_category ON product_database(product_category);

-- Comments
COMMENT ON TABLE edc_chemicals IS 'Endocrine disrupting chemicals database from EPA and scientific literature';
COMMENT ON TABLE user_assessments IS 'User hormone health and EDC exposure assessments';
COMMENT ON TABLE recommendations IS 'AI-generated personalized recommendations for reducing EDC exposure';
COMMENT ON TABLE supplement_protocols IS 'Evidence-based supplement protocols for hormone support';
COMMENT ON TABLE product_database IS 'Database of EDC-free product alternatives';
