-- Literature References Schema for EndoGuard EDC Database
-- Tracks PubMed articles and research for each chemical

CREATE TABLE IF NOT EXISTS edc_literature_references (
  id INT AUTO_INCREMENT PRIMARY KEY,
  edc_id INT NOT NULL,
  pubmed_id VARCHAR(20),
  doi VARCHAR(255),
  title TEXT NOT NULL,
  authors TEXT,
  journal VARCHAR(500),
  publication_date DATE,
  abstract TEXT,
  keywords TEXT,
  relevance_score DECIMAL(3,2), -- 0.00 to 1.00
  citation_count INT DEFAULT 0,
  last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (edc_id) REFERENCES edc_chemicals(id) ON DELETE CASCADE,
  INDEX idx_edc_id (edc_id),
  INDEX idx_pubmed_id (pubmed_id),
  INDEX idx_publication_date (publication_date),
  INDEX idx_relevance_score (relevance_score)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Track when each EDC's literature was last updated
CREATE TABLE IF NOT EXISTS edc_literature_update_log (
  id INT AUTO_INCREMENT PRIMARY KEY,
  edc_id INT NOT NULL,
  last_search_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  articles_found INT DEFAULT 0,
  articles_added INT DEFAULT 0,
  search_query TEXT,
  status ENUM('success', 'partial', 'failed') DEFAULT 'success',
  error_message TEXT,
  FOREIGN KEY (edc_id) REFERENCES edc_chemicals(id) ON DELETE CASCADE,
  INDEX idx_edc_id (edc_id),
  INDEX idx_last_search_date (last_search_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Add last_literature_update column to edc_chemicals table
ALTER TABLE edc_chemicals 
ADD COLUMN IF NOT EXISTS last_literature_update TIMESTAMP NULL,
ADD COLUMN IF NOT EXISTS literature_update_status ENUM('current', 'stale', 'never_updated') DEFAULT 'never_updated',
ADD INDEX idx_literature_status (literature_update_status);
