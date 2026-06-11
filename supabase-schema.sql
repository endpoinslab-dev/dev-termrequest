-- Run this in the Supabase SQL Editor (https://supabase.com > SQL Editor)

-- ============================================
-- USER PROGRESS TABLE
-- ============================================
CREATE TABLE user_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  completed_missions TEXT[] DEFAULT '{}',
  xp INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id)
);

ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own progress"
  ON user_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress"
  ON user_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress"
  ON user_progress FOR UPDATE
  USING (auth.uid() = user_id);

-- ============================================
-- CURRICULUM LEVELS TABLE (seed from app)
-- ============================================
CREATE TABLE curriculum_levels (
  id SERIAL PRIMARY KEY,
  num INTEGER NOT NULL UNIQUE,
  name TEXT NOT NULL,
  rank TEXT NOT NULL,
  description TEXT NOT NULL
);

ALTER TABLE curriculum_levels ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read levels"
  ON curriculum_levels FOR SELECT
  USING (true);

-- ============================================
-- MISSIONS TABLE
-- ============================================
CREATE TABLE missions (
  id TEXT PRIMARY KEY,
  level_num INTEGER REFERENCES curriculum_levels(num),
  title TEXT NOT NULL,
  subtitle TEXT NOT NULL,
  category TEXT NOT NULL,
  xp_reward INTEGER NOT NULL,
  story TEXT NOT NULL,
  objective TEXT NOT NULL,
  task_description TEXT NOT NULL,
  initial_vfs_state JSONB,
  validation_rules JSONB NOT NULL,
  hints TEXT[] DEFAULT '{}',
  solution_walkthrough TEXT NOT NULL,
  real_world_use_case TEXT NOT NULL,
  common_mistakes TEXT NOT NULL,
  debugging_tips TEXT NOT NULL,
  active_incident JSONB
);

ALTER TABLE missions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read missions"
  ON missions FOR SELECT
  USING (true);

-- ============================================
-- WIZARD TRACKS TABLE
-- ============================================
CREATE TABLE wizard_tracks (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL
);

ALTER TABLE wizard_tracks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read wizard tracks"
  ON wizard_tracks FOR SELECT
  USING (true);

-- ============================================
-- WIZARD MODULES TABLE
-- ============================================
CREATE TABLE wizard_modules (
  id TEXT PRIMARY KEY,
  track_id TEXT REFERENCES wizard_tracks(id),
  title TEXT NOT NULL,
  description TEXT NOT NULL
);

ALTER TABLE wizard_modules ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read wizard modules"
  ON wizard_modules FOR SELECT
  USING (true);

-- ============================================
-- WIZARD COMMANDS TABLE
-- ============================================
CREATE TABLE wizard_commands (
  id SERIAL PRIMARY KEY,
  module_id TEXT REFERENCES wizard_modules(id),
  command TEXT NOT NULL,
  description TEXT NOT NULL,
  syntax TEXT NOT NULL,
  syntax_parts JSONB NOT NULL,
  example TEXT NOT NULL,
  example_output TEXT,
  step_by_step TEXT[] NOT NULL,
  try_it TEXT NOT NULL,
  common_flags JSONB NOT NULL
);

ALTER TABLE wizard_commands ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read wizard commands"
  ON wizard_commands FOR SELECT
  USING (true);

-- ============================================
-- USERS TABLE (for leaderboard / admin)
-- ============================================
CREATE VIEW user_profiles AS
SELECT
  u.id,
  u.email,
  u.raw_user_meta_data->>'name' AS name,
  u.created_at
FROM auth.users u;
