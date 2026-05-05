import { useState, useEffect } from 'react';
import { getAdminStats } from '../utils/submissionService';
import { isSupabaseAvailable } from '../utils/supabase';
import type { AdminStats } from '../types';
import StatsOverview from '../components/StatsOverview';
import ErrorHeatMap from '../components/ErrorHeatMap';
import CloudStatus from '../components/CloudStatus';
import styles from './AdminPage.module.css';

export default function AdminPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  async function loadStats() {
    setLoading(true);
    const s = await getAdminStats();
    setStats(s);
    setLoading(false);
  }

  useEffect(() => {
    loadStats();
  }, []);

  if (loading) {
    return <div className={styles.page}><p className={styles.empty}>加载中...</p></div>;
  }

  if (!stats) {
    return <div className={styles.page}><p className={styles.empty}>暂无数据</p></div>;
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1>教师统计看板</h1>
        <CloudStatus />
        <button className={styles.refreshBtn} onClick={loadStats}>
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
        {isSupabaseAvailable()
          ? '数据来自云端数据库。'
          : '数据来自浏览器本地存储。如需跨设备统计，请配置 Supabase 后端。'}
      </p>
    </div>
  );
}
