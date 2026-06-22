import { create } from 'zustand';
import { invoke } from '@tauri-apps/api/core';
import type { Theme } from '../types';

interface ThemeStore {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  syncWithSystem: () => Promise<void>;
}

/**
 * Zustand store for managing application theme state.
 * Syncs with the Windows OS theme setting via Tauri commands.
 */
export const useThemeStore = create<ThemeStore>((set) => ({
  theme: 'dark',

  setTheme: (theme: Theme) => {
    set({ theme });
    // Apply or remove the 'dark' class on the root HTML element
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  },

  syncWithSystem: async () => {
    try {
      const systemTheme = await invoke<string>('get_system_theme');
      const theme: Theme = systemTheme === 'dark' ? 'dark' : 'light';
      set({ theme });
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } catch (error) {
      // Fallback to dark theme if Rust command fails
      console.warn('Failed to sync with system theme, defaulting to dark:', error);
      set({ theme: 'dark' });
      document.documentElement.classList.add('dark');
    }
  },
}));
