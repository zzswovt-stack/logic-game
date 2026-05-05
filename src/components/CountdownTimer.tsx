import { useEffect, useState, useRef } from 'react';
import styles from './CountdownTimer.module.css';

interface Props {
  seconds: number;
  running: boolean;
  onTimeout: () => void;
}

export default function CountdownTimer({ seconds, running, onTimeout }: Props) {
  const [remaining, setRemaining] = useState(seconds);
  const onTimeoutRef = useRef(onTimeout);
  onTimeoutRef.current = onTimeout;

  useEffect(() => {
    setRemaining(seconds);
  }, [seconds]);

  useEffect(() => {
    if (!running) return;
    if (remaining <= 0) {
      onTimeoutRef.current();
      return;
    }
    const timer = setInterval(() => {
      setRemaining((r) => r - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [running, remaining]);

  const pct = (remaining / seconds) * 100;
  const urgent = remaining <= 10;

  return (
    <div className={`${styles.timer} ${urgent ? styles.urgent : ''}`}>
      <div className={styles.label}>剩余时间</div>
      <div className={styles.digits}>{remaining}s</div>
      <div className={styles.barTrack}>
        <div
          className={styles.barFill}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
