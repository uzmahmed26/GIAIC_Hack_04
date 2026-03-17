-- Migration 006: Create cost_logs table
-- Phase 2 — Tracks every LLM API call for cost monitoring
-- Constitutional requirement: Every LLM call in Phase 2 MUST be logged here.

CREATE TABLE IF NOT EXISTS cost_logs (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(100) NOT NULL,
    feature VARCHAR(50) NOT NULL,
    model VARCHAR(100) NOT NULL,
    input_tokens INTEGER NOT NULL,
    output_tokens INTEGER NOT NULL,
    cost_usd FLOAT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Index for per-user cost queries
CREATE INDEX IF NOT EXISTS idx_cost_logs_user_id ON cost_logs(user_id);

-- Index for per-feature analytics
CREATE INDEX IF NOT EXISTS idx_cost_logs_feature ON cost_logs(feature);

-- Index for time-series cost reporting
CREATE INDEX IF NOT EXISTS idx_cost_logs_created_at ON cost_logs(created_at);
