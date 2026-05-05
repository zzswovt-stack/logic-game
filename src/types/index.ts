export interface Step {
  id: number;
  text: string;
}

export interface Submission {
  id: string;
  timestamp: number;
  studentOrder: number[];
  isCorrect: boolean;
  timeSpent: number;
  autoSubmitted: boolean;
}

export interface AdminStats {
  totalSubmissions: number;
  correctCount: number;
  accuracyRate: number;
  errorCountPerStep: number[];
}
