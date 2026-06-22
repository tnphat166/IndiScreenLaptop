import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { GripVertical, Maximize2 } from 'lucide-react';
import type { DemoBlockProps } from '../../types';

// TODO: placeholder — refactor in Phase 2 when implementing full block CRUD system

/**
 * DemoBlock — A placeholder glassmorphic card for testing drag & drop.
 *
 * Features:
 * - Glassmorphic card with rounded corners
 * - Drag handle icon (top-left)
 * - Visual resize indicator (bottom-right, visual only — resize logic in Phase 2)
 * - Smooth drag animation with slight scale-up when grabbed
 */
export const DemoBlock: React.FC<DemoBlockProps> = ({ id, label }) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id,
  });

  return (
    <div
      ref={setNodeRef}
      className={[
        'w-full h-full',
        // Glassmorphism - Dark mode
        'dark:bg-white/[0.07] dark:border-white/10 dark:text-white',
        // Glassmorphism - Light mode
        'bg-black/[0.04] border-black/[0.06] text-gray-800',
        // Shared glass styles
        'backdrop-blur-[16px] border rounded-block shadow-glass',
        // Layout
        'flex flex-col relative overflow-hidden',
        // Transitions
        'transition-all duration-200',
        // Hover glow effect
        'hover:shadow-glass-hover',
        'hover:dark:bg-white/10 hover:bg-black/[0.06]',
        // Dragging state
        isDragging ? 'opacity-50' : 'opacity-100',
      ].join(' ')}
    >
      {/* Drag Handle — top area */}
      <div
        {...listeners}
        {...attributes}
        className={[
          'flex items-center gap-2 px-3 py-2',
          'cursor-grab active:cursor-grabbing',
          'select-none',
        ].join(' ')}
      >
        <GripVertical
          size={14}
          className="dark:text-white/40 text-gray-400 flex-shrink-0"
        />
        <span className="text-xs font-medium dark:text-white/70 text-gray-600 truncate">
          {label}
        </span>
      </div>

      {/* Block content area */}
      <div className="flex-1 px-3 pb-2">
        <p className="text-2xs dark:text-white/30 text-gray-400">
          Drag to reposition
        </p>
      </div>

      {/* Resize indicator — visual only, resize logic in Phase 2 */}
      <div className="absolute bottom-1 right-1 dark:text-white/20 text-gray-300">
        <Maximize2 size={10} />
      </div>
    </div>
  );
};
