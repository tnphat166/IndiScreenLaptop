import { useEffect, useCallback } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { WorkspaceGrid } from './components/workspace/WorkspaceGrid';
import { useSystemTheme } from './hooks/useSystemTheme';
import { useWorkspaceStore } from './stores/workspaceStore';
import './styles/globals.css';

/**
 * App — Root component for SuperIndividuaMyScreenLaptopApp.
 *
 * Responsibilities:
 * - Initialize theme sync with Windows OS
 * - Manage click-through behavior based on cursor position
 * - Render the full-viewport transparent workspace
 */
function App() {
  // Sync theme with Windows OS setting
  useSystemTheme();

  /**
   * Click-through management (Strategy B):
   * - When cursor is over empty/transparent areas → enable click-through
   * - When cursor is over interactive elements → disable click-through
   *
   * We track mouseenter/mouseleave on the workspace container.
   * Interactive elements (blocks, buttons) stop propagation to prevent
   * click-through from being enabled while interacting with UI.
   */
  // enableClickThrough removed as it permanently locks the UI

  const disableClickThrough = useCallback(async () => {
    try {
      await invoke('set_click_through', { label: 'main', enabled: false });
    } catch (error) {
      console.warn('Failed to disable click-through:', error);
    }
  }, []);

  const { isLoaded, initializeStore } = useWorkspaceStore();

  useEffect(() => {
    initializeStore();
  }, [initializeStore]);

  useEffect(() => {
    // Start with click-through DISABLED so the window captures clicks.
    // If WebView2 natively supports pixel-level alpha hit-testing, transparent areas will pass through.
    disableClickThrough();
  }, [disableClickThrough]);

  if (!isLoaded) {
    return null; // or a loading spinner
  }

  return (
    <div
      className="fixed inset-0 w-full h-full"
      style={{ background: 'transparent' }}
    >
      <WorkspaceGrid />
    </div>
  );
}

export default App;
