import React from 'react';
import { Rnd } from 'react-rnd';
import { useWorkspaceStore } from '../../stores/workspaceStore';
import { DemoBlock } from '../blocks/DemoBlock';
import { AppShortcutBlock } from '../blocks/AppShortcutBlock';
import { FloatingGlassTaskbar } from '../taskbar/FloatingGlassTaskbar';
import { SystemMonitorBlock } from '../blocks/SystemMonitorBlock';
import { MediaControllerBlock } from '../blocks/MediaControllerBlock';
import { WeatherBlock } from '../blocks/WeatherBlock';
import { PomodoroBlock } from '../blocks/PomodoroBlock';
import { StickyNoteBlock } from '../blocks/StickyNoteBlock';
import { BlockData, GRID_CELL_SIZE, BLOCK_MIN_SIZE, ShortcutBlockData } from '../../types';

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
    case 'shortcut': {
      const shortcutData = block.data as ShortcutBlockData['data'] || {};
      return (
        <AppShortcutBlock 
          id={block.id}
          label={shortcutData.name || 'Shortcut'} 
          path={shortcutData.path}
          initialIconBase64={shortcutData.iconBase64}
        />
      );
    }
    case 'system_monitor':
      return <SystemMonitorBlock id={block.id} />;
    case 'media':
      return <MediaControllerBlock id={block.id} />;
    case 'weather':
      return <WeatherBlock id={block.id} />;
    case 'pomodoro':
      return <PomodoroBlock id={block.id} />;
    case 'sticky_note':
      return <StickyNoteBlock id={block.id} initialText={block.data?.text as string} />;
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

      {/* Floating Taskbar */}
      <FloatingGlassTaskbar />

      {/* Temporary Add Block Buttons */}
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-2">
        <button 
          onClick={() => {
            addBlock({
              type: 'system_monitor',
              x: 128, y: 128, w: 256, h: 128,
            });
          }}
          className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded shadow-lg backdrop-blur text-xs"
        >
          + Add System Monitor
        </button>
        <button 
          onClick={() => {
            addBlock({
              type: 'weather',
              x: 400, y: 128, w: 256, h: 128,
            });
          }}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded shadow-lg backdrop-blur text-xs"
        >
          + Add Weather
        </button>
        <button 
          onClick={() => {
            addBlock({
              type: 'media',
              x: 128, y: 280, w: 256, h: 128,
            });
          }}
          className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded shadow-lg backdrop-blur text-xs"
        >
          + Add Media
        </button>
        <button 
          onClick={() => {
            addBlock({
              type: 'pomodoro',
              x: 400, y: 280, w: 256, h: 180,
            });
          }}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded shadow-lg backdrop-blur text-xs"
        >
          + Add Pomodoro
        </button>
        <button 
          onClick={() => {
            addBlock({
              type: 'sticky_note',
              x: 128, y: 440, w: 256, h: 256,
            });
          }}
          className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded shadow-lg backdrop-blur text-xs"
        >
          + Add Sticky Note
        </button>
        <button 
          onClick={() => {
            addBlock({
              type: 'shortcut',
              x: 400, y: 440, w: 128, h: 128,
              data: { name: 'Notepad', path: 'C:\\Windows\\notepad.exe' }
            });
          }}
          className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded shadow-lg backdrop-blur text-xs"
        >
          + Add Shortcut
        </button>
      </div>
    </div>
  );
};
