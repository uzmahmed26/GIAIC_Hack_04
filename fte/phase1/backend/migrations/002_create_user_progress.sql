-- Migration 002: Create user_progress table

CREATE TABLE IF NOT EXISTS user_progress (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(100) NOT NULL,
  chapter_id VARCHAR(20) REFERENCES chapters(id),
  completed BOOLEAN DEFAULT FALSE,
  score FLOAT,
  completed_at TIMESTAMP,
  streak_days INTEGER DEFAULT 0,
  last_active DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, chapter_id)
);

CREATE INDEX IF NOT EXISTS idx_progress_user ON user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_progress_chapter ON user_progress(chapter_id);
