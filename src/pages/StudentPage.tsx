import { useState, useCallback, useRef } from 'react';
import type { Step } from '../types';
import { STEPS, CORRECT_ORDER } from '../data/steps';
import { shuffle } from '../utils/shuffle';
import { addSubmission } from '../utils/storage';
import CountdownTimer from '../components/CountdownTimer';
import StepSorter from '../components/StepSorter';
import ResultPanel from '../components/ResultPanel';
import styles from './StudentPage.module.css';

const TOTAL_SECONDS = 60;

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function getInitialSteps(): Step[] {
  return shuffle(STEPS);
}

export default function StudentPage() {
  const [steps, setSteps] = useState<Step[]>(getInitialSteps);
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<{ isCorrect: boolean; autoSubmitted: boolean } | null>(null);
  const [running, setRunning] = useState(true);
  const startTimeRef = useRef(Date.now());
  const submittedRef = useRef(false);

  const handleSubmit = useCallback(
    (auto = false) => {
      if (submittedRef.current) return;
      submittedRef.current = true;
      setRunning(false);

      const studentIds = steps.map((s) => s.id);
      const isCorrect = studentIds.every((id, i) => id === CORRECT_ORDER[i]);
      const timeSpent = Math.round((Date.now() - startTimeRef.current) / 1000);

      addSubmission({
        id: generateId(),
        timestamp: Date.now(),
        studentOrder: studentIds,
        isCorrect,
        timeSpent,
        autoSubmitted: auto,
      });

      setResult({ isCorrect, autoSubmitted: auto });
      setSubmitted(true);
    },
    [steps]
  );

  const handleTimeout = useCallback(() => {
    handleSubmit(true);
  }, [handleSubmit]);

  function handleReset() {
    setSteps(getInitialSteps());
    setSubmitted(false);
    setResult(null);
    setRunning(true);
    startTimeRef.current = Date.now();
    submittedRef.current = false;
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1>时序逻辑电路分析步骤排序</h1>
        <p className={styles.subtitle}>请将以下6个步骤按正确的分析顺序排列</p>
      </header>

      <div className={styles.timerRow}>
        <CountdownTimer seconds={TOTAL_SECONDS} running={running} onTimeout={handleTimeout} />
      </div>

      <main className={styles.main}>
        <StepSorter steps={steps} disabled={submitted} onReorder={setSteps} />

        {!submitted && (
          <button className={styles.submitBtn} onClick={() => handleSubmit(false)}>
            提交排序
          </button>
        )}

        {result && (
          <ResultPanel
            isCorrect={result.isCorrect}
            autoSubmitted={result.autoSubmitted}
            studentOrder={steps}
          />
        )}

        {submitted && (
          <button className={styles.resetBtn} onClick={handleReset}>
            重新开始
          </button>
        )}
      </main>
    </div>
  );
}
