import { create } from 'zustand';
import { BlockData } from '../types';

interface WorkspaceState {
  blocks: BlockData[];
  activeBlockId: string | null;
  addBlock: (block: Omit<BlockData, 'id'>) => void;
  updateBlockPosition: (id: string, x: number, y: number) => void;
  updateBlockSize: (id: string, w: number, h: number) => void;
  removeBlock: (id: string) => void;
  bringToFront: (id: string) => void;
  loadBlocks: (blocks: BlockData[]) => void;
}

export const useWorkspaceStore = create<WorkspaceState>((set, get) => ({
  blocks: [
    { id: '1', type: 'demo', x: 64, y: 64, w: 256, h: 128, zIndex: 1, data: { label: 'Weather Block' } },
    { id: '2', type: 'demo', x: 384, y: 64, w: 256, h: 256, zIndex: 2, data: { label: 'System Monitor' } },
    { id: '3', type: 'demo', x: 64, y: 256, w: 128, h: 128, zIndex: 3, data: { label: 'Shortcut' } },
  ],
  activeBlockId: null,
  addBlock: (block) => {
    const maxZ = Math.max(0, ...get().blocks.map(b => b.zIndex || 0));
    const newId = crypto.randomUUID();
    set((state) => ({
      blocks: [...state.blocks, { ...block, id: newId, zIndex: maxZ + 1 }],
      activeBlockId: newId,
    }));
  },
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
      activeBlockId: state.activeBlockId === id ? null : state.activeBlockId,
    })),
  bringToFront: (id) => {
    const maxZ = Math.max(0, ...get().blocks.map(b => b.zIndex || 0));
    set((state) => ({
      blocks: state.blocks.map((b) => 
        b.id === id ? { ...b, zIndex: maxZ + 1 } : b
      ),
      activeBlockId: id,
    }));
  },
  loadBlocks: (blocks) => set({ blocks }),
}));
