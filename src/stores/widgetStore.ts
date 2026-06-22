import { create } from 'zustand';
import { invoke } from '@tauri-apps/api/core';

export interface SystemStats {
  cpu_usage: number;
  memory_used: number;
  memory_total: number;
}

export interface MediaInfo {
  title: string;
  artist: string;
  album_art_url: string | null;
  is_playing: boolean;
  last_updated: number;
}

interface WidgetState {
  systemStats: SystemStats | null;
  mediaInfo: MediaInfo | null;
  fetchSystemStats: () => Promise<void>;
  fetchMediaInfo: () => Promise<void>;
  mediaPlayPause: () => Promise<void>;
  mediaNext: () => Promise<void>;
  mediaPrev: () => Promise<void>;
}

export const useWidgetStore = create<WidgetState>((set) => ({
  systemStats: null,
  mediaInfo: null,

  fetchSystemStats: async () => {
    try {
      const stats = await invoke<SystemStats>('get_system_stats');
      set({ systemStats: stats });
    } catch (error) {
      console.error('Failed to fetch system stats:', error);
    }
  },

  fetchMediaInfo: async () => {
    try {
      const info = await invoke<MediaInfo>('get_current_media_info');
      set({ mediaInfo: info });
    } catch (error) {
      console.error('Failed to fetch media info:', error);
    }
  },

  mediaPlayPause: async () => {
    try {
      await invoke('media_play_pause');
    } catch (error) {
      console.error('Failed to play/pause media:', error);
    }
  },

  mediaNext: async () => {
    try {
      await invoke('media_next');
    } catch (error) {
      console.error('Failed to next media:', error);
    }
  },

  mediaPrev: async () => {
    try {
      await invoke('media_prev');
    } catch (error) {
      console.error('Failed to prev media:', error);
    }
  }
}));

// Start polling for system stats and media info
setInterval(() => {
  const store = useWidgetStore.getState();
  store.fetchSystemStats();
  store.fetchMediaInfo();
}, 2000);
