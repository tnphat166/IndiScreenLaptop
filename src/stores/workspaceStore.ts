import { create } from 'zustand';
import { BlockData } from '../types';
import { saveBlocksToStore, loadBlocksFromStore } from '../utils/store';

interface WorkspaceState {
  blocks: BlockData[];
  activeBlockId: string | null;
  isLoaded: boolean;
  addBlock: (block: Omit<BlockData, 'id'>) => void;
  updateBlockPosition: (id: string, x: number, y: number) => void;
  updateBlockSize: (id: string, w: number, h: number) => void;
  removeBlock: (id: string) => void;
  bringToFront: (id: string) => void;
  loadBlocks: (blocks: BlockData[]) => void;
  initializeStore: () => Promise<void>;
}

// Default demo blocks
const defaultBlocks: BlockData[] = [
  { id: '1', type: 'demo', x: 64, y: 64, w: 256, h: 128, zIndex: 1, data: { label: 'Weather Block' } },
  { id: '2', type: 'demo', x: 384, y: 64, w: 256, h: 256, zIndex: 2, data: { label: 'System Monitor' } },
  { id: '3', type: 'demo', x: 64, y: 256, w: 128, h: 128, zIndex: 3, data: { label: 'Shortcut' } },
];

let saveTimeout: ReturnType<typeof setTimeout> | null = null;

const debouncedSave = (blocks: BlockData[]) => {
  if (saveTimeout) clearTimeout(saveTimeout);
  saveTimeout = setTimeout(() => {
    saveBlocksToStore(blocks);
  }, 500);
};

export const useWorkspaceStore = create<WorkspaceState>((set, get) => ({
  blocks: [],
  activeBlockId: null,
  isLoaded: false,
  
  initializeStore: async () => {
    const loadedBlocks = await loadBlocksFromStore();
    if (loadedBlocks && loadedBlocks.length > 0) {
      const validTypes = ['demo', 'clock', 'system_monitor', 'shortcut'];
      const validBlocks = loadedBlocks.filter(b => validTypes.includes(b.type));
      
      set({ blocks: validBlocks.length > 0 ? validBlocks : defaultBlocks, isLoaded: true });
      if (validBlocks.length === 0) {
        saveBlocksToStore(defaultBlocks);
      } else if (validBlocks.length !== loadedBlocks.length) {
        saveBlocksToStore(validBlocks); // Resave to clean up invalid blocks
      }
    } else {
      set({ blocks: defaultBlocks, isLoaded: true });
      saveBlocksToStore(defaultBlocks);
    }
  },

  addBlock: (block) => {
    const maxZ = Math.max(0, ...get().blocks.map(b => b.zIndex || 0));
    const newId = crypto.randomUUID();
    set((state) => {
      const newBlocks = [...state.blocks, { ...block, id: newId, zIndex: maxZ + 1 }];
      saveBlocksToStore(newBlocks); // save instantly on add
      return { blocks: newBlocks, activeBlockId: newId };
    });
  },

  updateBlockPosition: (id, x, y) =>
    set((state) => {
      const newBlocks = state.blocks.map((b) =>
        b.id === id ? { ...b, x, y } : b
      );
      debouncedSave(newBlocks);
      return { blocks: newBlocks };
    }),

  updateBlockSize: (id, w, h) =>
    set((state) => {
      const newBlocks = state.blocks.map((b) =>
        b.id === id ? { ...b, w, h } : b
      );
      debouncedSave(newBlocks);
      return { blocks: newBlocks };
    }),

  removeBlock: (id) =>
    set((state) => {
      const newBlocks = state.blocks.filter((b) => b.id !== id);
      saveBlocksToStore(newBlocks); // save instantly on remove
      return {
        blocks: newBlocks,
        activeBlockId: state.activeBlockId === id ? null : state.activeBlockId,
      };
    }),

  bringToFront: (id) => {
    const maxZ = Math.max(0, ...get().blocks.map(b => b.zIndex || 0));
    set((state) => {
      const newBlocks = state.blocks.map((b) => 
        b.id === id ? { ...b, zIndex: maxZ + 1 } : b
      );
      saveBlocksToStore(newBlocks); // save instantly on z-index change
      return {
        blocks: newBlocks,
        activeBlockId: id,
      };
    });
  },

  loadBlocks: (blocks) => set({ blocks }),
}));
