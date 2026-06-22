import React, { useEffect, useState } from 'react';
import { useSystemStore } from '../../stores/systemStore';

interface AppShortcutBlockProps {
  id: string;
  label?: string;
  path?: string;
  initialIconBase64?: string;
}

export const AppShortcutBlock: React.FC<AppShortcutBlockProps> = ({ label, path, initialIconBase64 }) => {
  const [iconBase64, setIconBase64] = useState<string | null>(initialIconBase64 || null);
  const { extractIcon, launchShortcut } = useSystemStore();

  useEffect(() => {
    if (path && !iconBase64) {
      extractIcon(path).then((b64) => {
        if (b64) setIconBase64(b64);
      });
    }
  }, [path, iconBase64, extractIcon]);

  const handleLaunch = () => {
    if (path) {
      launchShortcut(path);
    } else {
      alert('No path configured for this shortcut');
    }
  };

  return (
    <div 
      className="w-full h-full bg-white/10 dark:bg-black/20 backdrop-blur-md rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-white/20 transition-colors border border-white/20 shadow-lg group pointer-events-auto"
      onDoubleClick={handleLaunch}
    >
      <div className="w-16 h-16 mb-2 rounded-xl flex items-center justify-center bg-white/5 group-hover:scale-105 transition-transform">
        {iconBase64 ? (
          <img src={iconBase64} alt={label || 'Shortcut'} className="w-12 h-12 object-contain" />
        ) : (
          <span className="text-3xl">🚀</span>
        )}
      </div>
      <span className="text-sm font-medium text-gray-800 dark:text-gray-200 text-center truncate w-full">
        {label || 'New Shortcut'}
      </span>
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 rounded-2xl transition-colors pointer-events-none" />
    </div>
  );
};
