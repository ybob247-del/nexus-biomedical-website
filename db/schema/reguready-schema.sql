-- ReguReady™ Database Schema
-- FDA Regulatory Guidance & 510(k) Submission Platform
-- Created: November 20, 2025

-- Table: medical_devices
-- Devices being prepared for FDA submission
CREATE TABLE IF NOT EXISTS medical_devices (
    id SERIAL PRIMARY KEY,
    company_user_id INTEGER NOT NULL, -- Link to main users table
    
    -- Device information
    device_name VARCHAR(255) NOT NULL,
    trade_name VARCHAR(255),
    common_name VARCHAR(255),
    device_description TEXT,
    
    -- Classification
    device_class VARCHAR(10), -- 'I', 'II', 'III'
    product_code VARCHAR(10),
    regulation_number VARCHAR(50),
    panel VARCHAR(100), -- Medical specialty panel
    
    -- Intended use
    intended_use TEXT NOT NULL,
    indications_for_use TEXT NOT NULL,
    contraindications TEXT,
    warnings_precautions TEXT,
    
    -- Technology
    technology_type VARCHAR(255),
    is_novel_technology BOOLEAN DEFAULT false,
    is_combination_product BOOLEAN DEFAULT false,
    
    -- Regulatory pathway
    regulatory_pathway VARCHAR(100), -- '510k', 'PMA', 'De_Novo', 'Exempt'
    submission_type VARCHAR(100), -- 'Traditional', 'Special', 'Abbreviated'
    
    -- Predicate device (for 510k)
    has_predicate BOOLEAN DEFAULT false,
    predicate_device_name VARCHAR(255),
    predicate_k_number VARCHAR(50),
    substantial_equivalence_rationale TEXT,
    
    -- Status
    development_stage VARCHAR(100), -- 'concept', 'prototype', 'testing', 'ready_for_submission'
    submission_status VARCHAR(100), -- 'not_started', 'in_progress', 'submitted', 'approved', 'rejected'
    
    -- Timeline
    target_submission_date DATE,
    actual_submission_date DATE,
    fda_decision_date DATE,
    
    -- Team
    regulatory_consultant VARCHAR(255),
    project_manager VARCHAR(255),
    
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: device_classifications
-- FDA device classification database
CREATE TABLE IF NOT EXISTS device_classifications (
    id SERIAL PRIMARY KEY,
    
    product_code VARCHAR(10) UNIQUE NOT NULL,
    device_class VARCHAR(10) NOT NULL,
    device_name VARCHAR(255) NOT NULL,
    regulation_number VARCHAR(50),
    
    -- Panel information
    medical_specialty VARCHAR(100),
    panel_code VARCHAR(10),
    
    -- Review requirements
    review_panel VARCHAR(100),
    submission_type_required VARCHAR(100),
    
    -- Exemptions
    is_exempt BOOLEAN DEFAULT false,
    gmp_exempt BOOLEAN DEFAULT false,
    
    -- Definition
    definition TEXT,
    
    -- Guidance documents
    guidance_documents TEXT[],
    
    -- Standards
    applicable_standards TEXT[],
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: submission_requirements
-- Required documents and data for submission
CREATE TABLE IF NOT EXISTS submission_requirements (
    id SERIAL PRIMARY KEY,
    device_id INTEGER NOT NULL REFERENCES medical_devices(id) ON DELETE CASCADE,
    
    requirement_category VARCHAR(100), -- 'administrative', 'technical', 'clinical', 'labeling', 'manufacturing'
    requirement_name VARCHAR(255) NOT NULL,
    requirement_description TEXT,
    
    -- Status
    is_required BOOLEAN DEFAULT true,
    is_completed BOOLEAN DEFAULT false,
    completion_percentage INTEGER DEFAULT 0,
    
    -- Responsibility
    assigned_to VARCHAR(255),
    due_date DATE,
    completed_date DATE,
    
    -- Files
    file_paths TEXT[],
    document_version VARCHAR(50),
    
    -- Review
    reviewed_by VARCHAR(255),
    review_date DATE,
    review_status VARCHAR(50), -- 'pending', 'approved', 'needs_revision'
    review_comments TEXT,
    
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: predicate_devices
-- Database of predicate devices for 510(k) comparison
CREATE TABLE IF NOT EXISTS predicate_devices (
    id SERIAL PRIMARY KEY,
    
    k_number VARCHAR(50) UNIQUE NOT NULL,
    device_name VARCHAR(255) NOT NULL,
    applicant_name VARCHAR(255),
    
    -- Classification
    product_code VARCHAR(10),
    device_class VARCHAR(10),
    regulation_number VARCHAR(50),
    
    -- Clearance information
    clearance_date DATE,
    decision VARCHAR(50), -- 'Substantially Equivalent', 'Not Substantially Equivalent'
    
    -- Device details
    intended_use TEXT,
    indications_for_use TEXT,
    device_description TEXT,
    
    -- Technical characteristics
    technological_characteristics JSONB,
    
    -- Summary
    statement_of_substantial_equivalence TEXT,
    
    -- Reference
    fda_url TEXT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: regulatory_checklists
-- Checklists for submission preparation
CREATE TABLE IF NOT EXISTS regulatory_checklists (
    id SERIAL PRIMARY KEY,
    device_id INTEGER NOT NULL REFERENCES medical_devices(id) ON DELETE CASCADE,
    
    checklist_type VARCHAR(100), -- '510k_traditional', '510k_special', 'PMA', 'design_controls', 'risk_management'
    checklist_name VARCHAR(255) NOT NULL,
    
    -- Items
    checklist_items JSONB, -- Array of checklist items with completion status
    
    -- Progress
    total_items INTEGER NOT NULL,
    completed_items INTEGER DEFAULT 0,
    completion_percentage INTEGER DEFAULT 0,
    
    -- Status
    is_complete BOOLEAN DEFAULT false,
    completed_date DATE,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: testing_requirements
-- Required testing and validation
CREATE TABLE IF NOT EXISTS testing_requirements (
    id SERIAL PRIMARY KEY,
    device_id INTEGER NOT NULL REFERENCES medical_devices(id) ON DELETE CASCADE,
    
    test_type VARCHAR(100), -- 'biocompatibility', 'electrical_safety', 'EMC', 'sterilization', 'shelf_life', 'performance'
    test_name VARCHAR(255) NOT NULL,
    test_standard VARCHAR(100), -- e.g., 'ISO 10993-1', 'IEC 60601-1'
    
    -- Requirements
    is_required BOOLEAN DEFAULT true,
    rationale TEXT,
    
    -- Testing details
    test_lab VARCHAR(255),
    test_protocol_number VARCHAR(100),
    
    -- Status
    test_status VARCHAR(50), -- 'not_started', 'in_progress', 'completed', 'failed'
    start_date DATE,
    completion_date DATE,
    
    -- Results
    test_result VARCHAR(50), -- 'pass', 'fail', 'conditional'
    test_report_path TEXT,
    key_findings TEXT,
    
    -- Retest
    retest_required BOOLEAN DEFAULT false,
    retest_reason TEXT,
    
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: clinical_data
-- Clinical study data for submission
CREATE TABLE IF NOT EXISTS clinical_data (
    id SERIAL PRIMARY KEY,
    device_id INTEGER NOT NULL REFERENCES medical_devices(id) ON DELETE CASCADE,
    
    study_type VARCHAR(100), -- 'clinical_trial', 'literature_review', 'post_market_data'
    study_title VARCHAR(255) NOT NULL,
    
    -- Study details
    study_design VARCHAR(100),
    number_of_subjects INTEGER,
    study_duration VARCHAR(100),
    primary_endpoint TEXT,
    secondary_endpoints TEXT[],
    
    -- Results
    results_summary TEXT,
    safety_data TEXT,
    effectiveness_data TEXT,
    adverse_events TEXT[],
    
    -- Documentation
    study_protocol_path TEXT,
    study_report_path TEXT,
    irb_approval_path TEXT,
    
    -- Status
    study_status VARCHAR(50), -- 'planned', 'ongoing', 'completed'
    completion_date DATE,
    
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: labeling_documents
-- Device labeling and IFU
CREATE TABLE IF NOT EXISTS labeling_documents (
    id SERIAL PRIMARY KEY,
    device_id INTEGER NOT NULL REFERENCES medical_devices(id) ON DELETE CASCADE,
    
    document_type VARCHAR(100), -- 'label', 'IFU', 'package_insert', 'user_manual', 'quick_reference'
    document_name VARCHAR(255) NOT NULL,
    version VARCHAR(50),
    
    -- Content sections
    intended_use TEXT,
    indications_for_use TEXT,
    contraindications TEXT,
    warnings TEXT,
    precautions TEXT,
    adverse_events TEXT,
    instructions_for_use TEXT,
    
    -- Symbols and standards
    symbols_used TEXT[],
    standards_referenced TEXT[],
    
    -- Languages
    languages TEXT[],
    
    -- Files
    file_path TEXT,
    
    -- Review
    review_status VARCHAR(50), -- 'draft', 'under_review', 'approved'
    reviewed_by VARCHAR(255),
    review_date DATE,
    
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: risk_management
-- ISO 14971 risk management file
CREATE TABLE IF NOT EXISTS risk_management (
    id SERIAL PRIMARY KEY,
    device_id INTEGER NOT NULL REFERENCES medical_devices(id) ON DELETE CASCADE,
    
    hazard_id VARCHAR(50) UNIQUE NOT NULL,
    hazard_description TEXT NOT NULL,
    hazardous_situation TEXT,
    
    -- Harm
    potential_harm TEXT NOT NULL,
    severity VARCHAR(50), -- 'negligible', 'minor', 'serious', 'critical', 'catastrophic'
    severity_score INTEGER CHECK (severity_score BETWEEN 1 AND 5),
    
    -- Probability
    probability VARCHAR(50), -- 'remote', 'unlikely', 'possible', 'probable', 'frequent'
    probability_score INTEGER CHECK (probability_score BETWEEN 1 AND 5),
    
    -- Initial risk
    initial_risk_score INTEGER, -- severity × probability
    initial_risk_level VARCHAR(50), -- 'low', 'medium', 'high'
    
    -- Risk control measures
    risk_controls TEXT[],
    risk_control_effectiveness TEXT,
    
    -- Residual risk
    residual_severity_score INTEGER CHECK (residual_severity_score BETWEEN 1 AND 5),
    residual_probability_score INTEGER CHECK (residual_probability_score BETWEEN 1 AND 5),
    residual_risk_score INTEGER,
    residual_risk_level VARCHAR(50),
    
    -- Acceptability
    is_acceptable BOOLEAN DEFAULT false,
    acceptability_rationale TEXT,
    
    -- Verification
    verification_method TEXT,
    verification_status VARCHAR(50),
    
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: submission_timeline
-- Track submission milestones
CREATE TABLE IF NOT EXISTS submission_timeline (
    id SERIAL PRIMARY KEY,
    device_id INTEGER NOT NULL REFERENCES medical_devices(id) ON DELETE CASCADE,
    
    milestone_name VARCHAR(255) NOT NULL,
    milestone_category VARCHAR(100), -- 'design', 'testing', 'documentation', 'submission', 'fda_review'
    
    planned_date DATE,
    actual_date DATE,
    
    is_completed BOOLEAN DEFAULT false,
    is_critical_path BOOLEAN DEFAULT false,
    
    dependencies TEXT[], -- Other milestone IDs
    
    responsible_party VARCHAR(255),
    
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: fda_communications
-- Track communications with FDA
CREATE TABLE IF NOT EXISTS fda_communications (
    id SERIAL PRIMARY KEY,
    device_id INTEGER NOT NULL REFERENCES medical_devices(id) ON DELETE CASCADE,
    
    communication_type VARCHAR(100), -- 'pre_submission', 'RTA_hold', 'additional_info_request', 'decision_letter'
    communication_date DATE NOT NULL,
    
    -- Content
    subject VARCHAR(255),
    summary TEXT,
    fda_questions TEXT[],
    company_responses TEXT[],
    
    -- Files
    incoming_document_path TEXT,
    outgoing_document_path TEXT,
    
    -- Response
    response_due_date DATE,
    response_submitted_date DATE,
    
    -- Follow-up
    requires_followup BOOLEAN DEFAULT false,
    followup_action TEXT,
    
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: regulatory_templates
-- Document templates and guidance
CREATE TABLE IF NOT EXISTS regulatory_templates (
    id SERIAL PRIMARY KEY,
    
    template_name VARCHAR(255) NOT NULL,
    template_type VARCHAR(100), -- 'cover_letter', 'indications_for_use', 'substantial_equivalence', 'risk_analysis'
    submission_type VARCHAR(100), -- '510k', 'PMA', 'De_Novo'
    
    template_content TEXT,
    instructions TEXT,
    
    -- Metadata
    version VARCHAR(50),
    last_updated DATE,
    source VARCHAR(255), -- 'FDA', 'Industry', 'Internal'
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_medical_devices_company ON medical_devices(company_user_id);
CREATE INDEX IF NOT EXISTS idx_device_classifications_code ON device_classifications(product_code);
CREATE INDEX IF NOT EXISTS idx_submission_requirements_device ON submission_requirements(device_id);
CREATE INDEX IF NOT EXISTS idx_predicate_devices_k_number ON predicate_devices(k_number);
CREATE INDEX IF NOT EXISTS idx_regulatory_checklists_device ON regulatory_checklists(device_id);
CREATE INDEX IF NOT EXISTS idx_testing_requirements_device ON testing_requirements(device_id);
CREATE INDEX IF NOT EXISTS idx_clinical_data_device ON clinical_data(device_id);
CREATE INDEX IF NOT EXISTS idx_labeling_documents_device ON labeling_documents(device_id);
CREATE INDEX IF NOT EXISTS idx_risk_management_device ON risk_management(device_id);
CREATE INDEX IF NOT EXISTS idx_submission_timeline_device ON submission_timeline(device_id);
CREATE INDEX IF NOT EXISTS idx_fda_communications_device ON fda_communications(device_id);
