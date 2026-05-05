import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import styles from './SortableStepCard.module.css';

interface Props {
  id: number;
  text: string;
  index: number;
  total: number;
  disabled: boolean;
  onMoveUp: () => void;
  onMoveDown: () => void;
}

export default function SortableStepCard({ id, text, index, total, disabled, onMoveUp, onMoveDown }: Props) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id, disabled });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`${styles.card} ${isDragging ? styles.dragging : ''} ${disabled ? styles.disabled : ''}`}
    >
      <div className={styles.dragHandle} {...attributes} {...listeners}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="9" cy="5" r="1.5" />
          <circle cx="15" cy="5" r="1.5" />
          <circle cx="9" cy="12" r="1.5" />
          <circle cx="15" cy="12" r="1.5" />
          <circle cx="9" cy="19" r="1.5" />
          <circle cx="15" cy="19" r="1.5" />
        </svg>
      </div>

      <span className={styles.indexBadge}>{index + 1}</span>
      <span className={styles.text}>{text}</span>

      <div className={styles.arrows}>
        <button
          className={styles.arrowBtn}
          disabled={disabled || index === 0}
          onClick={onMoveUp}
          title="上移"
        >
          ▲
        </button>
        <button
          className={styles.arrowBtn}
          disabled={disabled || index === total - 1}
          onClick={onMoveDown}
          title="下移"
        >
          ▼
        </button>
      </div>
    </div>
  );
}
