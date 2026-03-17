-- Migration 003: Create quizzes table
-- questions JSONB stores Question[] WITHOUT answer keys

CREATE TABLE IF NOT EXISTS quizzes (
  id VARCHAR(20) PRIMARY KEY,
  chapter_id VARCHAR(20) REFERENCES chapters(id),
  title VARCHAR(200) NOT NULL,
  questions JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_quizzes_chapter ON quizzes(chapter_id);
