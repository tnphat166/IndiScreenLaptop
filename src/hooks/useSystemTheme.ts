import { useEffect } from 'react';
import { listen } from '@tauri-apps/api/event';
import { useThemeStore } from '../stores/themeStore';
import type { ThemeChangedPayload } from '../types';

/**
 * Hook that syncs the app theme with the Windows OS theme setting.
 *
 * - On mount: invokes `get_system_theme` Tauri command to read current OS theme.
 * - Reactively: listens for `theme-changed` events emitted by the Rust backend
 *   when the user changes the Windows theme while the app is running.
 */
export function useSystemTheme(): void {
  const { syncWithSystem, setTheme } = useThemeStore();

  useEffect(() => {
    // Initial sync with system theme on mount
    syncWithSystem();

    // Listen for theme changes from the Rust backend
    let unlisten: (() => void) | undefined;

    const setupListener = async () => {
      try {
        unlisten = await listen<ThemeChangedPayload>('theme-changed', (event) => {
          setTheme(event.payload.theme);
        });
      } catch (error) {
        console.warn('Failed to listen for theme changes:', error);
      }
    };

    setupListener();

    // Cleanup listener on unmount
    return () => {
      if (unlisten) {
        unlisten();
      }
    };
  }, [syncWithSystem, setTheme]);
}
