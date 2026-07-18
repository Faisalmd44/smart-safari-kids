/*
# Smart Safari Kids - Game Progress Schema

1. Purpose
   Stores per-device player progress for a no-auth kids learning game.
   Single-tenant: all data keyed by device_id, no user accounts.

2. New Tables
   - `players`: one row per device. Stores player name, avatar, currencies
     (stars, coins, gems, trophies), XP, level, streak, unlocked worlds/levels,
     screen-time tracking, and story progress.
   - `attempts`: quiz/minigame attempt history for analytics and AI tutor recommendations.

3. Security
   - RLS enabled on both tables.
   - Policies allow anon + authenticated full CRUD (single-tenant, shared data model).
   - No user_id / auth.uid() since there is no sign-in.

4. Notes
   - `device_id` is generated client-side and stored in localStorage.
   - `unlocked_worlds` and `unlocked_levels` are text arrays for flexibility.
   - `story_progress` tracks which story chapters the player has seen.
*/

CREATE TABLE IF NOT EXISTS players (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id text UNIQUE NOT NULL,
  player_name text NOT NULL DEFAULT 'Explorer',
  avatar text NOT NULL DEFAULT 'lion',
  current_class int NOT NULL DEFAULT 1,
  stars int NOT NULL DEFAULT 0,
  coins int NOT NULL DEFAULT 0,
  gems int NOT NULL DEFAULT 0,
  trophies int NOT NULL DEFAULT 0,
  xp int NOT NULL DEFAULT 0,
  level int NOT NULL DEFAULT 1,
  streak int NOT NULL DEFAULT 0,
  last_played_date date,
  unlocked_worlds text[] NOT NULL DEFAULT ARRAY['jungle']::text[],
  unlocked_levels text[] NOT NULL DEFAULT ARRAY[]::text[],
  unlocked_stickers text[] NOT NULL DEFAULT ARRAY[]::text[],
  badges text[] NOT NULL DEFAULT ARRAY[]::text[],
  story_progress int NOT NULL DEFAULT 0,
  today_screen_seconds int NOT NULL DEFAULT 0,
  screen_time_limit_minutes int NOT NULL DEFAULT 60,
  last_screen_reset date,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE players ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_players" ON players;
CREATE POLICY "anon_select_players" ON players FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_players" ON players;
CREATE POLICY "anon_insert_players" ON players FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_players" ON players;
CREATE POLICY "anon_update_players" ON players FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_players" ON players;
CREATE POLICY "anon_delete_players" ON players FOR DELETE
  TO anon, authenticated USING (true);

CREATE TABLE IF NOT EXISTS attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id text NOT NULL,
  subject text NOT NULL,
  topic text NOT NULL,
  difficulty text NOT NULL DEFAULT 'easy',
  world text,
  mode text NOT NULL DEFAULT 'level',
  level_num int,
  correct int NOT NULL DEFAULT 0,
  total int NOT NULL DEFAULT 0,
  stars_earned int NOT NULL DEFAULT 0,
  coins_earned int NOT NULL DEFAULT 0,
  boss_defeated boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_attempts_device ON attempts(device_id);
CREATE INDEX IF NOT EXISTS idx_attempts_created ON attempts(created_at DESC);

ALTER TABLE attempts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_attempts" ON attempts;
CREATE POLICY "anon_select_attempts" ON attempts FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_attempts" ON attempts;
CREATE POLICY "anon_insert_attempts" ON attempts FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_attempts" ON attempts;
CREATE POLICY "anon_update_attempts" ON attempts FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_attempts" ON attempts;
CREATE POLICY "anon_delete_attempts" ON attempts FOR DELETE
  TO anon, authenticated USING (true);
