import styles from './StatsOverview.module.css';

interface Props {
  totalSubmissions: number;
  correctCount: number;
  accuracyRate: number;
}

export default function StatsOverview({ totalSubmissions, correctCount, accuracyRate }: Props) {
  return (
    <div className={styles.overview}>
      <div className={styles.card}>
        <div className={styles.cardValue}>{totalSubmissions}</div>
        <div className={styles.cardLabel}>提交人数</div>
      </div>
      <div className={styles.card}>
        <div className={styles.cardValue}>{correctCount}</div>
        <div className={styles.cardLabel}>正确人数</div>
      </div>
      <div className={styles.card}>
        <div className={styles.cardValue}>{accuracyRate}%</div>
        <div className={styles.cardLabel}>正确率</div>
      </div>
    </div>
  );
}
