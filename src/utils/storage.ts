import type { Submission, AdminStats } from '../types';
import { CORRECT_ORDER } from '../data/steps';

const STORAGE_KEY = 'logic-game-submissions';

export function getSubmissions(): Submission[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function addSubmission(submission: Submission): void {
  const submissions = getSubmissions();
  submissions.push(submission);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(submissions));
}

export function getAdminStats(): AdminStats {
  const submissions = getSubmissions();
  const totalSubmissions = submissions.length;
  const correctCount = submissions.filter((s) => s.isCorrect).length;
  const accuracyRate = totalSubmissions > 0 ? Math.round((correctCount / totalSubmissions) * 100) : 0;

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
