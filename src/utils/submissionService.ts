import type { Submission, AdminStats } from '../types';
import { CORRECT_ORDER } from '../data/steps';
import { supabase, isSupabaseAvailable } from './supabase';
import * as local from './storage';

type Row = {
  id: string;
  created_at: string;
  student_order: number[];
  is_correct: boolean;
  time_spent: number;
  auto_submitted: boolean;
};

function rowToSubmission(row: Row): Submission {
  return {
    id: row.id,
    timestamp: new Date(row.created_at).getTime(),
    studentOrder: row.student_order,
    isCorrect: row.is_correct,
    timeSpent: row.time_spent,
    autoSubmitted: row.auto_submitted,
  };
}

export async function addSubmission(submission: Submission): Promise<void> {
  local.addSubmission(submission);

  if (!isSupabaseAvailable()) return;

  const { error } = await supabase!.from('submissions').insert({
    student_order: submission.studentOrder,
    is_correct: submission.isCorrect,
    time_spent: submission.timeSpent,
    auto_submitted: submission.autoSubmitted,
  });

  if (error) {
    console.warn('[submissionService] Cloud save failed:', error.message);
  }
}

export async function getSubmissions(): Promise<Submission[]> {
  if (isSupabaseAvailable()) {
    const { data, error } = await supabase!
      .from('submissions')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      return (data as Row[]).map(rowToSubmission);
    }
    console.warn('[submissionService] Cloud fetch failed:', error?.message);
  }

  return local.getSubmissions();
}

export async function clearAllSubmissions(): Promise<{ cloud: boolean }> {
  local.clearSubmissions();
  let cloud = false;

  if (isSupabaseAvailable()) {
    const { error } = await supabase!.from('submissions').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    if (error) {
      console.warn('[submissionService] Cloud clear failed:', error.message);
    } else {
      cloud = true;
    }
  }

  return { cloud };
}

export async function getAdminStats(): Promise<AdminStats> {
  const submissions = await getSubmissions();
  const totalSubmissions = submissions.length;
  const correctCount = submissions.filter((s) => s.isCorrect).length;
  const accuracyRate =
    totalSubmissions > 0
      ? Math.round((correctCount / totalSubmissions) * 100)
      : 0;

  const errorCountPerStep = [0, 0, 0, 0, 0, 0];
  for (const sub of submissions) {
    if (!sub.isCorrect) {
      for (let i = 0; i < CORRECT_ORDER.length; i++) {
        if (sub.studentOrder[i] !== CORRECT_ORDER[i]) {
          errorCountPerStep[i]++;
        }
      }
    }
  }

  return { totalSubmissions, correctCount, accuracyRate, errorCountPerStep };
}
