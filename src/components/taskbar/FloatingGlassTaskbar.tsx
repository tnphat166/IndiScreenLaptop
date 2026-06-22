import React, { useEffect } from 'react';
import { useSystemStore } from '../../stores/systemStore';
import { FlyoutMenu } from './FlyoutMenu';

export const FloatingGlassTaskbar: React.FC = () => {
  const { runningApps, startPollingRunningApps, stopPollingRunningApps, launchShortcut } = useSystemStore();

  useEffect(() => {
    startPollingRunningApps();
    return () => {
      stopPollingRunningApps();
    };
  }, [startPollingRunningApps, stopPollingRunningApps]);

  const handleAppClick = (path: string, hwnd: number) => {
    // Basic implementation: if we have a path, we could launch it.
    // In a real scenario, we might want to bring the window to front using the hwnd.
    console.log(`Clicked app with hwnd: ${hwnd}`);
    if (path) {
      launchShortcut(path);
    }
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] pointer-events-none flex items-center justify-center">
      <div className="pointer-events-auto flex items-center gap-4 px-6 py-3 rounded-full backdrop-blur-xl bg-white/10 dark:bg-black/20 border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.1)]">
        
        {/* Flyout Menu for system controls or pinned items */}
        <FlyoutMenu 
          icon={<span className="text-xl">🚀</span>} 
          direction="up"
          items={[
            { id: 'settings', label: 'Settings', icon: <span>⚙️</span>, onClick: () => console.log('Settings clicked') },
            { id: 'wifi', label: 'Wi-Fi', icon: <span>📶</span>, onClick: () => console.log('WiFi clicked') },
          ]}
        />

        <div className="w-[1px] h-8 bg-white/20 mx-2" />

        {/* Running Apps List */}
        <div className="flex gap-2">
          {runningApps.slice(0, 8).map((app) => (
            <button
              key={app.hwnd}
              onClick={() => handleAppClick(app.path as string, app.hwnd)}
              title={app.title as string}
              className="w-10 h-10 rounded bg-white/5 hover:bg-white/20 backdrop-blur-sm border border-transparent hover:border-white/20 transition-all flex items-center justify-center text-white text-xs truncate overflow-hidden"
            >
              {/* Fallback to first letter of title if no icon is available yet */}
              <span className="font-bold">
                {(app.title as string).charAt(0).toUpperCase()}
              </span>
            </button>
          ))}
          {runningApps.length === 0 && (
            <span className="text-white/50 text-sm italic">No apps</span>
          )}
        </div>
      </div>
    </div>
  );
};
