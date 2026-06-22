import React from 'react';
import { Rnd } from 'react-rnd';
import { useWorkspaceStore } from '../../stores/workspaceStore';
import { DemoBlock } from '../blocks/DemoBlock';
import { BlockData, GRID_CELL_SIZE, BLOCK_MIN_SIZE } from '../../types';

import { DotGrid } from './DotGrid';

const DEMO_LABELS: Record<string, string> = {
  '1': 'Weather Widget',
  '2': 'System Monitor',
  '3': 'Quick Notes',
};

const BlockRenderer: React.FC<{ block: BlockData }> = ({ block }) => {
  switch (block.type) {
    case 'demo':
      return <DemoBlock id={block.id} label={block.data?.label || DEMO_LABELS[block.id] || 'Demo Block'} />;
    default:
      return (
        <div className="w-full h-full bg-red-500/20 border border-red-500 flex items-center justify-center text-red-500">
          Unknown Block Type
        </div>
      );
  }
};

export const WorkspaceGrid: React.FC = () => {
  const blocks = useWorkspaceStore((state) => state.blocks);
  const updateBlockPosition = useWorkspaceStore((state) => state.updateBlockPosition);
  const updateBlockSize = useWorkspaceStore((state) => state.updateBlockSize);

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden">
      <DotGrid />
      {blocks.map((block) => (
        <Rnd
          key={block.id}
          default={{
            x: block.x,
            y: block.y,
            width: block.w,
            height: block.h,
          }}
          onDragStop={(_e, d) => {
            updateBlockPosition(block.id, d.x, d.y);
          }}
          onResizeStop={(_e, _direction, ref, _delta, position) => {
            updateBlockSize(
              block.id,
              parseInt(ref.style.width, 10),
              parseInt(ref.style.height, 10)
            );
            updateBlockPosition(block.id, position.x, position.y);
          }}
          dragHandleClassName="drag-handle"
          enableUserSelectHack={false}
          minWidth={BLOCK_MIN_SIZE}
          minHeight={BLOCK_MIN_SIZE}
          dragGrid={[GRID_CELL_SIZE, GRID_CELL_SIZE]}
          resizeGrid={[GRID_CELL_SIZE, GRID_CELL_SIZE]}
          style={{ zIndex: 1 }}
        >
          <div className="w-full h-full relative group">
            <BlockRenderer block={block} />
          </div>
        </Rnd>
      ))}
    </div>
  );
};
