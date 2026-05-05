import { STEPS } from '../data/steps';
import styles from './ErrorHeatMap.module.css';

interface Props {
  errorCountPerStep: number[];
  totalSubmissions: number;
}

const HEAT_COLORS = [
  '#e8f5e9', // 0% error
  '#c8e6c9',
  '#fff9c4',
  '#ffecb3',
  '#ffcc80',
  '#ffab91',
  '#ef9a9a',
  '#e57373', // high error
];

function getHeatColor(errorCount: number, total: number): string {
  if (total === 0 || errorCount === 0) return HEAT_COLORS[0];
  const ratio = errorCount / total;
  const idx = Math.min(Math.floor(ratio * HEAT_COLORS.length), HEAT_COLORS.length - 1);
  return HEAT_COLORS[idx];
}

export default function ErrorHeatMap({ errorCountPerStep, totalSubmissions }: Props) {
  const maxError = Math.max(...errorCountPerStep, 1);

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>各步骤错误频率</h2>
      <div className={styles.chart}>
        {STEPS.map((step, i) => {
          const errors = errorCountPerStep[i];
          const pct = totalSubmissions > 0 ? Math.round((errors / totalSubmissions) * 100) : 0;
          const barWidth = maxError > 0 ? (errors / maxError) * 100 : 0;
          const bg = getHeatColor(errors, totalSubmissions);

          return (
            <div key={step.id} className={styles.row}>
              <span className={styles.stepLabel}>
                {i + 1}. {step.text}
              </span>
              <div className={styles.barTrack}>
                <div
                  className={styles.bar}
                  style={{ width: `${barWidth}%`, background: bg }}
                />
              </div>
              <span className={styles.count}>
                {errors}次 ({pct}%)
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
