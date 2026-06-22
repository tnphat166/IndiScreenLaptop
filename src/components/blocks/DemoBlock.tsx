import React from 'react';
import { GripVertical, Maximize2 } from 'lucide-react';
import type { DemoBlockProps } from '../../types';

export const DemoBlock: React.FC<DemoBlockProps> = ({ label }) => {
  return (
    <div
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
      ].join(' ')}
    >
      {/* Drag Handle — top area */}
      <div
        className={[
          'flex items-center gap-2 px-3 py-2',
          'cursor-grab active:cursor-grabbing',
          'select-none drag-handle', // Class drag-handle dùng cho react-rnd
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
      <div className="flex-1 px-3 pb-2 select-none">
        <p className="text-2xs dark:text-white/30 text-gray-400">
          Drag header to move.<br/>
          Drag edges/corners to resize.
        </p>
      </div>

      {/* Resize indicator — purely visual */}
      <div className="absolute bottom-1 right-1 dark:text-white/20 text-gray-300 pointer-events-none">
        <Maximize2 size={10} />
      </div>
    </div>
  );
};
