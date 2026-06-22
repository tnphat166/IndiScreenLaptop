import { useEffect, useCallback } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { WorkspaceGrid } from './components/workspace/WorkspaceGrid';
import { useSystemTheme } from './hooks/useSystemTheme';
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
  const enableClickThrough = useCallback(async () => {
    try {
      await invoke('set_click_through', { label: 'main', enabled: true });
    } catch (error) {
      console.warn('Failed to enable click-through:', error);
    }
  }, []);

  const disableClickThrough = useCallback(async () => {
    try {
      await invoke('set_click_through', { label: 'main', enabled: false });
    } catch (error) {
      console.warn('Failed to disable click-through:', error);
    }
  }, []);

  useEffect(() => {
    // Start with click-through enabled (transparent overlay mode)
    enableClickThrough();
  }, [enableClickThrough]);

  return (
    <div
      className="fixed inset-0 w-full h-full"
      style={{ background: 'transparent' }}
      onMouseEnter={disableClickThrough}
      onMouseLeave={enableClickThrough}
    >
      <WorkspaceGrid />
    </div>
  );
}

export default App;
