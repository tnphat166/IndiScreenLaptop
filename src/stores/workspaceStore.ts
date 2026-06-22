import { create } from 'zustand';
import { BlockData } from '../types';

interface WorkspaceState {
  blocks: BlockData[];
  addBlock: (block: Omit<BlockData, 'id'>) => void;
  updateBlockPosition: (id: string, x: number, y: number) => void;
  updateBlockSize: (id: string, w: number, h: number) => void;
  removeBlock: (id: string) => void;
  loadBlocks: (blocks: BlockData[]) => void;
}

export const useWorkspaceStore = create<WorkspaceState>((set) => ({
  blocks: [
    { id: '1', type: 'demo', x: 64, y: 64, w: 256, h: 128, data: { label: 'Weather Block' } },
    { id: '2', type: 'demo', x: 384, y: 64, w: 256, h: 256, data: { label: 'System Monitor' } },
    { id: '3', type: 'demo', x: 64, y: 256, w: 128, h: 128, data: { label: 'Shortcut' } },
  ],
  addBlock: (block) =>
    set((state) => ({
      blocks: [...state.blocks, { ...block, id: crypto.randomUUID() }],
    })),
  updateBlockPosition: (id, x, y) =>
    set((state) => ({
      blocks: state.blocks.map((b) =>
        b.id === id ? { ...b, x, y } : b
      ),
    })),
  updateBlockSize: (id, w, h) =>
    set((state) => ({
      blocks: state.blocks.map((b) =>
        b.id === id ? { ...b, w, h } : b
      ),
    })),
  removeBlock: (id) =>
    set((state) => ({
      blocks: state.blocks.filter((b) => b.id !== id),
    })),
  loadBlocks: (blocks) => set({ blocks }),
}));
