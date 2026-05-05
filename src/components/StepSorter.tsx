import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import SortableStepCard from './SortableStepCard';
import type { Step } from '../types';
import styles from './StepSorter.module.css';

interface Props {
  steps: Step[];
  disabled: boolean;
  onReorder: (steps: Step[]) => void;
}

export default function StepSorter({ steps, disabled, onReorder }: Props) {
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = steps.findIndex((s) => s.id === active.id);
    const newIndex = steps.findIndex((s) => s.id === over.id);
    onReorder(arrayMove(steps, oldIndex, newIndex));
  }

  function moveUp(index: number) {
    if (index === 0) return;
    onReorder(arrayMove(steps, index, index - 1));
  }

  function moveDown(index: number) {
    if (index === steps.length - 1) return;
    onReorder(arrayMove(steps, index, index + 1));
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={steps.map((s) => s.id)} strategy={verticalListSortingStrategy}>
        <div className={styles.list}>
          {steps.map((step, index) => (
            <SortableStepCard
              key={step.id}
              id={step.id}
              text={step.text}
              index={index}
              total={steps.length}
              disabled={disabled}
              onMoveUp={() => moveUp(index)}
              onMoveDown={() => moveDown(index)}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
