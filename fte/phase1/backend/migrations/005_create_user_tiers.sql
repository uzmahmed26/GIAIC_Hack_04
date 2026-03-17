-- Migration 005: Create user_tiers table and seed demo data

CREATE TABLE IF NOT EXISTS user_tiers (
  user_id VARCHAR(100) PRIMARY KEY,
  tier VARCHAR(20) DEFAULT 'free',
  valid_until TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Seed demo users for local development and testing
INSERT INTO user_tiers (user_id, tier) VALUES ('demo_user', 'pro')
  ON CONFLICT DO NOTHING;

INSERT INTO user_tiers (user_id, tier) VALUES ('free_user', 'free')
  ON CONFLICT DO NOTHING;

INSERT INTO user_tiers (user_id, tier) VALUES ('premium_user', 'premium')
  ON CONFLICT DO NOTHING;

INSERT INTO user_tiers (user_id, tier) VALUES ('team_user', 'team')
  ON CONFLICT DO NOTHING;
