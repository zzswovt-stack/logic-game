-- 在 Supabase SQL Editor 中运行此脚本
-- Run this in the Supabase SQL Editor

-- 删除旧表及所有数据，重建正确的结构
DROP TABLE IF EXISTS submissions;

CREATE TABLE submissions (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  student_order  INTEGER[] NOT NULL,
  is_correct     BOOLEAN NOT NULL,
  time_spent     INTEGER NOT NULL,
  auto_submitted BOOLEAN NOT NULL DEFAULT false
);

CREATE INDEX idx_submissions_created_at
  ON submissions (created_at DESC);

-- 启用 RLS
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;

-- 学生端可插入提交
CREATE POLICY "anyone_can_insert" ON submissions
  FOR INSERT TO anon WITH CHECK (true);

-- 教师端可查询所有数据
CREATE POLICY "anyone_can_select" ON submissions
  FOR SELECT TO anon USING (true);

-- 教师端可清空数据
CREATE POLICY "anyone_can_delete" ON submissions
  FOR DELETE TO anon USING (true);
