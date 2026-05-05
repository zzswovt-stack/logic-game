-- 在 Supabase SQL Editor 中运行此脚本
-- Run this in the Supabase SQL Editor

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS submissions (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  student_order  INTEGER[] NOT NULL,
  is_correct     BOOLEAN NOT NULL,
  time_spent     INTEGER NOT NULL,
  auto_submitted BOOLEAN NOT NULL DEFAULT false
);

CREATE INDEX IF NOT EXISTS idx_submissions_created_at
  ON submissions (created_at DESC);

ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE policyname = 'anyone_can_insert' AND tablename = 'submissions'
  ) THEN
    CREATE POLICY "anyone_can_insert" ON submissions
      FOR INSERT TO anon WITH CHECK (true);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE policyname = 'anyone_can_select' AND tablename = 'submissions'
  ) THEN
    CREATE POLICY "anyone_can_select" ON submissions
      FOR SELECT TO anon USING (true);
  END IF;
END $$;
