import { useState } from 'react';
import { getAdminStats } from '../utils/storage';
import StatsOverview from '../components/StatsOverview';
import ErrorHeatMap from '../components/ErrorHeatMap';
import styles from './AdminPage.module.css';

export default function AdminPage() {
  const [stats, setStats] = useState(() => getAdminStats());

  function handleRefresh() {
    setStats(getAdminStats());
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1>教师统计看板</h1>
        <button className={styles.refreshBtn} onClick={handleRefresh}>
          刷新数据
        </button>
      </header>

      <StatsOverview
        totalSubmissions={stats.totalSubmissions}
        correctCount={stats.correctCount}
        accuracyRate={stats.accuracyRate}
      />

      {stats.totalSubmissions > 0 ? (
        <ErrorHeatMap
          errorCountPerStep={stats.errorCountPerStep}
          totalSubmissions={stats.totalSubmissions}
        />
      ) : (
        <p className={styles.empty}>暂无提交数据，请在学生页面完成排序并提交。</p>
      )}

      <p className={styles.note}>
        数据来自浏览器本地存储。如需跨设备统计，请连接后端服务。
      </p>
    </div>
  );
}
