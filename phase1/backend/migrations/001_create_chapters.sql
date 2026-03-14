-- Migration 001: Create chapters table
-- Requires pgvector extension for embedding column

CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE IF NOT EXISTS chapters (
  id VARCHAR(20) PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  content TEXT,
  content_url VARCHAR(500),
  order_num INTEGER NOT NULL,
  prerequisites TEXT DEFAULT '[]',
  estimated_minutes INTEGER DEFAULT 15,
  tier_required VARCHAR(20) DEFAULT 'free',
  embedding vector(384),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_chapters_order ON chapters(order_num);
CREATE INDEX IF NOT EXISTS idx_chapters_tier ON chapters(tier_required);
CREATE INDEX IF NOT EXISTS idx_chapters_embedding ON chapters
  USING ivfflat (embedding vector_cosine_ops);
