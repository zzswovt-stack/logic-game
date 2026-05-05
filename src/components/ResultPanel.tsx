import type { Step } from '../types';
import { STEPS, CORRECT_ORDER } from '../data/steps';
import styles from './ResultPanel.module.css';

interface Props {
  isCorrect: boolean;
  autoSubmitted: boolean;
  studentOrder: Step[];
}

export default function ResultPanel({ isCorrect, autoSubmitted, studentOrder }: Props) {
  return (
    <div className={`${styles.panel} ${isCorrect ? styles.correct : styles.wrong}`}>
      <div className={styles.verdict}>
        {isCorrect ? '✅ 排序正确！' : '❌ 排序错误'}
      </div>
      {autoSubmitted && !isCorrect && (
        <div className={styles.timeoutNote}>时间到，已自动提交</div>
      )}

      <div className={styles.comparison}>
        <div className={styles.column}>
          <h3 className={styles.colTitle}>你的排序</h3>
          <ol className={styles.orderList}>
            {studentOrder.map((s, i) => {
              const isRightPosition = s.id === CORRECT_ORDER[i];
              return (
                <li key={s.id} className={isRightPosition ? styles.match : styles.mismatch}>
                  {s.text}
                </li>
              );
            })}
          </ol>
        </div>
        <div className={styles.column}>
          <h3 className={styles.colTitle}>正确顺序</h3>
          <ol className={styles.orderList}>
            {STEPS.map((s) => (
              <li key={s.id} className={styles.correctItem}>{s.text}</li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}
