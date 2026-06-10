-- ============================================================
-- Run this in your Supabase SQL Editor to set up the leaderboard
-- Dashboard: https://supabase.com/dashboard/project/hqsoogjijtnaqikjlhl/sql/new
-- ============================================================

CREATE TABLE IF NOT EXISTS leaderboard (
  id SERIAL PRIMARY KEY,
  player_name TEXT NOT NULL,
  score INTEGER NOT NULL,
  kills INTEGER NOT NULL,
  level_reached INTEGER NOT NULL,
  difficulty TEXT DEFAULT 'normal',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE leaderboard ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read scores
CREATE POLICY anon_read ON leaderboard
  FOR SELECT
  USING (true);

-- Allow anyone to insert scores
CREATE POLICY anon_insert ON leaderboard
  FOR INSERT
  WITH CHECK (true);
