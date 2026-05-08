import { isSupabaseAvailable } from '../utils/supabase';

export default function CloudStatus() {
  const online = isSupabaseAvailable();
  return (
    <span
      style={{
        display: 'inline-block',
        padding: '2px 12px',
        borderRadius: 12,
        fontSize: 13,
        fontWeight: 500,
        background: online ? '#e6f7e6' : '#fff7e6',
        color: online ? '#389e0d' : '#d48806',
        border: `1px solid ${online ? '#b7eb8f' : '#ffe58f'}`,
        marginLeft: 12,
      }}
    >
      {online ? '云端已连接' : '仅本地数据'}
    </span>
  );
}
