-- Provider Portal Database Schema
-- Created: Dec 10, 2025
-- Purpose: Enable healthcare providers to manage patients and view assessments

-- Provider Profiles Table
-- Stores healthcare provider information and credentials
CREATE TABLE IF NOT EXISTS provider_profiles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  provider_type VARCHAR(100) NOT NULL, -- 'physician', 'nurse_practitioner', 'nutritionist', 'health_coach', 'other'
  specialty VARCHAR(200), -- 'endocrinology', 'womens_health', 'integrative_medicine', etc.
  credentials VARCHAR(500), -- 'MD', 'NP', 'RD', 'APRN', etc.
  license_number VARCHAR(100),
  license_state VARCHAR(50),
  practice_name VARCHAR(200),
  practice_address TEXT,
  phone_number VARCHAR(20),
  bio TEXT, -- Provider bio for patient-facing profile
  profile_image_url VARCHAR(500),
  verified BOOLEAN DEFAULT FALSE, -- Manual verification by admin
  verification_date TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_user_provider (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Provider-Patient Relationships Table
-- Links providers to their patients
CREATE TABLE IF NOT EXISTS provider_patient_relationships (
  id INT AUTO_INCREMENT PRIMARY KEY,
  provider_id INT NOT NULL,
  patient_id INT NOT NULL,
  relationship_status VARCHAR(50) DEFAULT 'active', -- 'active', 'inactive', 'pending'
  access_level VARCHAR(50) DEFAULT 'full', -- 'full', 'limited', 'view_only'
  patient_consent BOOLEAN DEFAULT FALSE, -- Patient must consent to data sharing
  consent_date TIMESTAMP NULL,
  notes TEXT, -- Provider notes about patient
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (provider_id) REFERENCES provider_profiles(id) ON DELETE CASCADE,
  FOREIGN KEY (patient_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_provider_patient (provider_id, patient_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Patient Invitations Table
-- Tracks provider invitations to patients
CREATE TABLE IF NOT EXISTS patient_invitations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  provider_id INT NOT NULL,
  patient_email VARCHAR(255) NOT NULL,
  patient_first_name VARCHAR(100),
  patient_last_name VARCHAR(100),
  invitation_token VARCHAR(255) NOT NULL UNIQUE, -- Secure token for invitation link
  invitation_message TEXT, -- Optional personal message from provider
  status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'accepted', 'expired', 'declined'
  sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  accepted_at TIMESTAMP NULL,
  expires_at TIMESTAMP NOT NULL, -- Invitations expire after 7 days
  reminder_sent BOOLEAN DEFAULT FALSE,
  reminder_sent_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (provider_id) REFERENCES provider_profiles(id) ON DELETE CASCADE,
  INDEX idx_token (invitation_token),
  INDEX idx_status (status),
  INDEX idx_provider (provider_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Provider Notes Table
-- Allows providers to add notes to patient assessments
CREATE TABLE IF NOT EXISTS provider_notes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  provider_id INT NOT NULL,
  patient_id INT NOT NULL,
  assessment_id INT NULL, -- Optional: link to specific assessment
  note_type VARCHAR(50) DEFAULT 'general', -- 'general', 'clinical', 'follow_up', 'recommendation'
  note_content TEXT NOT NULL,
  is_shared_with_patient BOOLEAN DEFAULT FALSE, -- Provider can choose to share notes
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (provider_id) REFERENCES provider_profiles(id) ON DELETE CASCADE,
  FOREIGN KEY (patient_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_provider_patient (provider_id, patient_id),
  INDEX idx_assessment (assessment_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Indexes for performance
CREATE INDEX idx_provider_verified ON provider_profiles(verified);
CREATE INDEX idx_relationship_status ON provider_patient_relationships(relationship_status);
CREATE INDEX idx_invitation_expires ON patient_invitations(expires_at);
