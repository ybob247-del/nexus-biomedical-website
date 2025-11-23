-- Migration: Add password_reset_tokens table
-- Created: 2025-11-23
-- Description: Adds table to store password reset tokens with expiration

-- Create password_reset_tokens table
CREATE TABLE IF NOT EXISTS password_reset_tokens (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token VARCHAR(255) NOT NULL UNIQUE,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_token (token),
  INDEX idx_user_id (user_id),
  INDEX idx_expires_at (expires_at)
);

-- Add comment
COMMENT ON TABLE password_reset_tokens IS 'Stores password reset tokens with expiration times';
COMMENT ON COLUMN password_reset_tokens.token IS 'Unique token sent to user email for password reset';
COMMENT ON COLUMN password_reset_tokens.expires_at IS 'Token expiration timestamp (typically 1 hour from creation)';
