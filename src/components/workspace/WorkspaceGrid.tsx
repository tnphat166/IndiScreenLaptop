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

const BlockRenderer: React.FC<{ block: BlockData; onRemove: (id: string) => void }> = ({ block, onRemove }) => {
  switch (block.type) {
    case 'demo':
      return <DemoBlock id={block.id} label={String(block.data?.label || DEMO_LABELS[block.id] || 'Demo Block')} />;
    default:
      return (
        <div className="relative w-full h-full bg-red-500/20 border border-red-500 flex flex-col items-center justify-center text-red-500 p-2 overflow-auto text-xs break-all group pointer-events-auto">
          <button 
            className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 bg-red-500 text-white rounded px-2 py-1 hover:bg-red-600 cursor-pointer z-50 transition-opacity"
            onPointerDown={(e) => { e.stopPropagation(); onRemove(block.id); }}
          >
            Close
          </button>
          <b>Unknown Block Type: {String(block.type)}</b>
          <pre className="mt-2 text-[10px]">{JSON.stringify(block, null, 2)}</pre>
        </div>
      );
  }
};

export const WorkspaceGrid: React.FC = () => {
  const blocks = useWorkspaceStore((state) => state.blocks);
  const updateBlockPosition = useWorkspaceStore((state) => state.updateBlockPosition);
  const updateBlockSize = useWorkspaceStore((state) => state.updateBlockSize);
  const bringToFront = useWorkspaceStore((state) => state.bringToFront);
  const addBlock = useWorkspaceStore((state) => state.addBlock);
  const removeBlock = useWorkspaceStore((state) => state.removeBlock);

  const handleAddDemoBlock = () => {
    addBlock({
      type: 'demo',
      x: 128,
      y: 128,
      w: 256,
      h: 128,
      data: { label: 'New Block ' + Math.floor(Math.random() * 100) }
    });
  };

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden">
      <DotGrid />
      {blocks.map((block) => (
        <Rnd
          key={block.id}
          bounds="parent"
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
          onMouseDown={() => bringToFront(block.id)}
          dragHandleClassName="drag-handle"
          enableUserSelectHack={false}
          minWidth={BLOCK_MIN_SIZE}
          minHeight={BLOCK_MIN_SIZE}
          dragGrid={[GRID_CELL_SIZE, GRID_CELL_SIZE]}
          resizeGrid={[GRID_CELL_SIZE, GRID_CELL_SIZE]}
          style={{ zIndex: block.zIndex || 1 }}
        >
          <div className="w-full h-full relative group">
            <BlockRenderer block={block} onRemove={removeBlock} />
          </div>
        </Rnd>
      ))}

      {/* Temporary Add Block Button */}
      <div className="fixed bottom-6 right-6 z-[9999]">
        <button 
          onClick={handleAddDemoBlock}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded shadow-lg backdrop-blur"
        >
          + Add Block
        </button>
      </div>
    </div>
  );
};
