import { useState } from 'react';
import { getAdminStats, clearSubmissions } from '../utils/storage';
import type { AdminStats } from '../types';
import StatsOverview from '../components/StatsOverview';
import ErrorHeatMap from '../components/ErrorHeatMap';
import styles from './AdminPage.module.css';

export default function AdminPage() {
  const [stats, setStats] = useState<AdminStats>(() => getAdminStats());
  const [clearing, setClearing] = useState(false);

  function loadStats() {
    setStats(getAdminStats());
  }

  function handleClear() {
    if (!window.confirm('确定要清空所有提交数据吗？此操作不可恢复。')) return;
    setClearing(true);
    clearSubmissions();
    setClearing(false);
    loadStats();
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1>教师统计看板</h1>
        <div>
          <button className={styles.refreshBtn} onClick={loadStats}>
            刷新数据
          </button>
          <button
            className={styles.clearBtn}
            onClick={handleClear}
            disabled={clearing || stats.totalSubmissions === 0}
          >
            {clearing ? '清空中...' : '清空数据'}
          </button>
        </div>
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
