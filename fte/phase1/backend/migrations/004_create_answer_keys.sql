-- Migration 004: Create quiz_answer_keys table
-- SECURITY NOTE: This table is NEVER exposed via any API endpoint.
-- Answer keys are server-side only.
-- The quizzes router MUST NEVER join or select from this table in GET responses.

CREATE TABLE IF NOT EXISTS quiz_answer_keys (
  quiz_id VARCHAR(20) PRIMARY KEY REFERENCES quizzes(id),
  answers JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
