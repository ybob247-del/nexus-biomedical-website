-- RxGuard™ Database Schema
-- Drug Interaction Checker Platform
-- Created: November 20, 2025

-- Table: medications
-- Stores drug information from FDA DailyMed and RxNorm
CREATE TABLE IF NOT EXISTS medications (
    id SERIAL PRIMARY KEY,
    rxcui VARCHAR(50) UNIQUE NOT NULL, -- RxNorm Concept Unique Identifier
    drug_name VARCHAR(255) NOT NULL,
    generic_name VARCHAR(255),
    brand_names TEXT[], -- Array of brand names
    active_ingredients TEXT[],
    dosage_form VARCHAR(100),
    strength VARCHAR(100),
    manufacturer VARCHAR(255),
    ndc_codes TEXT[], -- National Drug Codes
    drug_class VARCHAR(255),
    fda_application_number VARCHAR(50),
    approval_date DATE,
    warnings TEXT,
    contraindications TEXT,
    adverse_reactions TEXT,
    drug_interactions TEXT, -- From FDA label
    pregnancy_category VARCHAR(10),
    controlled_substance_class VARCHAR(10),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: drug_interactions
-- Stores known drug-drug interactions from FDA data
CREATE TABLE IF NOT EXISTS drug_interactions (
    id SERIAL PRIMARY KEY,
    drug_a_rxcui VARCHAR(50) NOT NULL,
    drug_b_rxcui VARCHAR(50) NOT NULL,
    interaction_type VARCHAR(50) NOT NULL, -- 'major', 'moderate', 'minor'
    severity_score INTEGER CHECK (severity_score BETWEEN 1 AND 10),
    description TEXT NOT NULL,
    mechanism TEXT, -- How the interaction occurs (e.g., CYP450 inhibition)
    clinical_effects TEXT,
    management_recommendations TEXT,
    evidence_level VARCHAR(50), -- 'established', 'probable', 'theoretical'
    source VARCHAR(100), -- 'FDA_LABEL', 'FDA_ADVERSE_EVENTS', 'DRUGBANK'
    source_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_interaction UNIQUE (drug_a_rxcui, drug_b_rxcui)
);

-- Table: user_medication_lists
-- Stores each user's medication list
CREATE TABLE IF NOT EXISTS user_medication_lists (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL, -- References users table
    list_name VARCHAR(255) DEFAULT 'My Medications',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: user_medications
-- Individual medications in a user's list
CREATE TABLE IF NOT EXISTS user_medications (
    id SERIAL PRIMARY KEY,
    list_id INTEGER NOT NULL REFERENCES user_medication_lists(id) ON DELETE CASCADE,
    medication_id INTEGER NOT NULL REFERENCES medications(id),
    dosage VARCHAR(100),
    frequency VARCHAR(100),
    route VARCHAR(50), -- 'oral', 'topical', 'injection', etc.
    start_date DATE,
    end_date DATE,
    prescriber_name VARCHAR(255),
    notes TEXT,
    is_active BOOLEAN DEFAULT true,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: interaction_checks
-- Stores history of interaction checks performed
CREATE TABLE IF NOT EXISTS interaction_checks (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    list_id INTEGER REFERENCES user_medication_lists(id),
    medications_checked TEXT[], -- Array of RxCUIs checked
    interactions_found INTEGER DEFAULT 0,
    major_interactions INTEGER DEFAULT 0,
    moderate_interactions INTEGER DEFAULT 0,
    minor_interactions INTEGER DEFAULT 0,
    ai_analysis TEXT, -- AI-generated analysis from OpenAI/Claude
    risk_score INTEGER CHECK (risk_score BETWEEN 0 AND 100),
    recommendations TEXT,
    report_generated BOOLEAN DEFAULT false,
    report_url TEXT,
    checked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: interaction_alerts
-- Stores specific interaction alerts for a check
CREATE TABLE IF NOT EXISTS interaction_alerts (
    id SERIAL PRIMARY KEY,
    check_id INTEGER NOT NULL REFERENCES interaction_checks(id) ON DELETE CASCADE,
    interaction_id INTEGER REFERENCES drug_interactions(id),
    drug_a_name VARCHAR(255) NOT NULL,
    drug_b_name VARCHAR(255) NOT NULL,
    severity VARCHAR(50) NOT NULL,
    alert_message TEXT NOT NULL,
    recommendation TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: alternative_medications
-- Stores AI-suggested alternative medications
CREATE TABLE IF NOT EXISTS alternative_medications (
    id SERIAL PRIMARY KEY,
    check_id INTEGER NOT NULL REFERENCES interaction_checks(id) ON DELETE CASCADE,
    original_medication_rxcui VARCHAR(50) NOT NULL,
    alternative_rxcui VARCHAR(50) NOT NULL,
    alternative_name VARCHAR(255) NOT NULL,
    reason TEXT NOT NULL, -- Why this alternative is suggested
    safety_profile TEXT,
    efficacy_comparison TEXT,
    cost_comparison VARCHAR(50), -- 'lower', 'similar', 'higher'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_medications_rxcui ON medications(rxcui);
CREATE INDEX IF NOT EXISTS idx_medications_drug_name ON medications(drug_name);
CREATE INDEX IF NOT EXISTS idx_medications_generic_name ON medications(generic_name);
CREATE INDEX IF NOT EXISTS idx_drug_interactions_drugs ON drug_interactions(drug_a_rxcui, drug_b_rxcui);
CREATE INDEX IF NOT EXISTS idx_user_medication_lists_user ON user_medication_lists(user_id);
CREATE INDEX IF NOT EXISTS idx_user_medications_list ON user_medications(list_id);
CREATE INDEX IF NOT EXISTS idx_interaction_checks_user ON interaction_checks(user_id);
CREATE INDEX IF NOT EXISTS idx_interaction_alerts_check ON interaction_alerts(check_id);

-- Comments
COMMENT ON TABLE medications IS 'Drug information from FDA DailyMed and RxNorm';
COMMENT ON TABLE drug_interactions IS 'Known drug-drug interactions from FDA and other sources';
COMMENT ON TABLE user_medication_lists IS 'User medication lists for interaction checking';
COMMENT ON TABLE interaction_checks IS 'History of interaction checks performed by users';
COMMENT ON TABLE interaction_alerts IS 'Specific interaction alerts generated during checks';
COMMENT ON TABLE alternative_medications IS 'AI-suggested alternative medications to avoid interactions';
