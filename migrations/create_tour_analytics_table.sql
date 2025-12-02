-- Tour Analytics Table
-- Tracks user interactions with onboarding tours

CREATE TABLE IF NOT EXISTS tour_analytics (
  id INT AUTO_INCREMENT PRIMARY KEY,
  tour_name VARCHAR(100) NOT NULL,
  event_type VARCHAR(50) NOT NULL,
  user_id VARCHAR(255) DEFAULT 'anonymous',
  user_email VARCHAR(255) DEFAULT 'anonymous',
  metadata JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_tour_name (tour_name),
  INDEX idx_event_type (event_type),
  INDEX idx_user_id (user_id),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Add comment to table
ALTER TABLE tour_analytics COMMENT = 'Tracks onboarding tour interactions and completion rates';
