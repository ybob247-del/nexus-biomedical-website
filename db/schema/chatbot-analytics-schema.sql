-- Chatbot Analytics Table
CREATE TABLE IF NOT EXISTS chatbot_analytics (
  id SERIAL PRIMARY KEY,
  session_id VARCHAR(255) NOT NULL,
  user_id INT DEFAULT NULL,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  matched_faq_id INT DEFAULT NULL,
  language VARCHAR(10) DEFAULT 'en',
  response_time_ms INT DEFAULT NULL,
  user_satisfied BOOLEAN DEFAULT NULL,
  user_feedback TEXT DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  -- Foreign key to users table (optional, for logged-in users)
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  
  -- Foreign key to faq_items table (optional, if question matched an FAQ)
  FOREIGN KEY (matched_faq_id) REFERENCES faq_items(id) ON DELETE SET NULL
);

-- Indexes for analytics queries
CREATE INDEX idx_chatbot_session ON chatbot_analytics(session_id);
CREATE INDEX idx_chatbot_user ON chatbot_analytics(user_id);
CREATE INDEX idx_chatbot_language ON chatbot_analytics(language);
CREATE INDEX idx_chatbot_created_at ON chatbot_analytics(created_at);
CREATE INDEX idx_chatbot_satisfied ON chatbot_analytics(user_satisfied);
CREATE INDEX idx_chatbot_faq ON chatbot_analytics(matched_faq_id);

-- Full-text search index for questions
CREATE FULLTEXT INDEX idx_chatbot_question ON chatbot_analytics(question);
