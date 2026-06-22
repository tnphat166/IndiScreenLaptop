import { create } from 'zustand';
import { invoke } from '@tauri-apps/api/core';
import { RunningApp } from '../types';

interface SystemState {
  runningApps: RunningApp[];
  isPolling: boolean;
  startPollingRunningApps: () => void;
  stopPollingRunningApps: () => void;
  launchShortcut: (path: string) => Promise<void>;
  extractIcon: (path: string) => Promise<string | null>;
}

let pollingInterval: ReturnType<typeof setInterval> | null = null;

export const useSystemStore = create<SystemState>((set) => ({
  runningApps: [],
  isPolling: false,

  startPollingRunningApps: () => {
    if (pollingInterval) return;
    
    // Initial fetch
    invoke<RunningApp[]>('get_running_apps')
      .then((apps) => set({ runningApps: apps }))
      .catch(console.error);

    // Poll every 3 seconds (adjust as needed for performance)
    pollingInterval = setInterval(async () => {
      try {
        const apps = await invoke<RunningApp[]>('get_running_apps');
        set({ runningApps: apps });
      } catch (e) {
        console.error('Failed to poll running apps:', e);
      }
    }, 3000);

    set({ isPolling: true });
  },

  stopPollingRunningApps: () => {
    if (pollingInterval) {
      clearInterval(pollingInterval);
      pollingInterval = null;
    }
    set({ isPolling: false });
  },

  launchShortcut: async (path: string) => {
    try {
      await invoke('launch_shortcut', { path });
    } catch (e) {
      console.error('Failed to launch shortcut:', e);
    }
  },

  extractIcon: async (path: string) => {
    try {
      const base64 = await invoke<string>('extract_icon', { path });
      return base64;
    } catch (e) {
      console.error('Failed to extract icon:', e);
      return null;
    }
  }
}));
