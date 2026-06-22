import { load } from '@tauri-apps/plugin-store';
import { BlockData } from '../types';

let storeInstance: Awaited<ReturnType<typeof load>> | null = null;

const getStore = async () => {
  if (!storeInstance) {
    storeInstance = await load('workspace.json', { autoSave: false, defaults: {} });
  }
  return storeInstance;
};

export const loadBlocksFromStore = async (): Promise<BlockData[] | null> => {
  try {
    const store = await getStore();
    const blocks = await store.get<BlockData[]>('blocks');
    return blocks || null;
  } catch (error) {
    console.error('Failed to load blocks from store', error);
    return null;
  }
};

export const saveBlocksToStore = async (blocks: BlockData[]): Promise<void> => {
  try {
    const store = await getStore();
    await store.set('blocks', blocks);
    await store.save();
  } catch (error) {
    console.error('Failed to save blocks to store', error);
  }
};
