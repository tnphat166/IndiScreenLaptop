import React, { useState, useCallback } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from '@dnd-kit/core';
import { DotGrid } from './DotGrid';
import { DemoBlock } from '../blocks/DemoBlock';
import type { BlockPosition } from '../../types';
import { GRID_CELL_SIZE } from '../../types';

/** Snap a value to the nearest grid cell */
const snapToGrid = (value: number): number => {
  return Math.round(value / GRID_CELL_SIZE) * GRID_CELL_SIZE;
};

/** Clamp a position within viewport bounds */
const clampToViewport = (x: number, y: number, width: number, height: number) => {
  const maxX = window.innerWidth - width;
  const maxY = window.innerHeight - height;
  return {
    x: Math.max(0, Math.min(x, maxX)),
    y: Math.max(0, Math.min(y, maxY)),
  };
};

// TODO: placeholder — initial demo block positions. Refactor in Phase 2
const INITIAL_BLOCKS: BlockPosition[] = [
  { id: 'demo-1', x: 128, y: 96, width: 192, height: 128 },
  { id: 'demo-2', x: 384, y: 96, width: 192, height: 128 },
  { id: 'demo-3', x: 128, y: 288, width: 192, height: 128 },
];

const DEMO_LABELS: Record<string, string> = {
  'demo-1': 'Quick Notes',
  'demo-2': 'App Shortcuts',
  'demo-3': 'Task List',
};

/**
 * WorkspaceGrid — Main Bento grid workspace with drag & drop.
 *
 * Integrates:
 * - DotGrid (visual background)
 * - DndContext (@dnd-kit) for block drag & drop
 * - Grid snapping (16px cells)
 * - Viewport clamping (blocks can't be dragged off-screen)
 */
export const WorkspaceGrid: React.FC = () => {
  const [blocks, setBlocks] = useState<BlockPosition[]>(INITIAL_BLOCKS);
  const [activeId, setActiveId] = useState<string | null>(null);

  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 5, // 5px dead zone to prevent accidental drags
    },
  });

  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      delay: 150,
      tolerance: 5,
    },
  });

  const sensors = useSensors(mouseSensor, touchSensor);

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(String(event.active.id));
  }, []);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, delta } = event;
    const blockId = String(active.id);

    setBlocks((prevBlocks) =>
      prevBlocks.map((block) => {
        if (block.id !== blockId) return block;

        const rawX = block.x + delta.x;
        const rawY = block.y + delta.y;

        // Snap to grid
        const snappedX = snapToGrid(rawX);
        const snappedY = snapToGrid(rawY);

        // Clamp within viewport
        const { x, y } = clampToViewport(snappedX, snappedY, block.width, block.height);

        return { ...block, x, y };
      })
    );

    setActiveId(null);
  }, []);

  const handleDragCancel = useCallback(() => {
    setActiveId(null);
  }, []);

  const activeBlock = activeId ? blocks.find((b) => b.id === activeId) : null;

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden">
      {/* Dot grid background */}
      <DotGrid />

      {/* DnD Context for block dragging */}
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        {/* Render blocks at their absolute positions */}
        {blocks.map((block) => (
          <div
            key={block.id}
            style={{
              position: 'absolute',
              left: block.x,
              top: block.y,
              width: block.width,
              height: block.height,
              zIndex: activeId === block.id ? 9999 : 1,
            }}
          >
            <DemoBlock
              id={block.id}
              label={DEMO_LABELS[block.id] ?? 'Demo Block'}
            />
          </div>
        ))}

        {/* Drag overlay for smooth drag animation */}
        <DragOverlay dropAnimation={null}>
          {activeBlock ? (
            <div
              style={{
                width: activeBlock.width,
                height: activeBlock.height,
              }}
              className="block-dragging"
            >
              <DemoBlock
                id={activeBlock.id}
                label={DEMO_LABELS[activeBlock.id] ?? 'Demo Block'}
              />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
};
