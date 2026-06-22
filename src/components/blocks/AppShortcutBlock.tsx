import React, { useEffect, useState } from 'react';
import { useSystemStore } from '../../stores/systemStore';
import { useWorkspaceStore } from '../../stores/workspaceStore';
import { X } from 'lucide-react';

interface AppShortcutBlockProps {
  id: string;
  label?: string;
  path?: string;
  initialIconBase64?: string;
}

export const AppShortcutBlock: React.FC<AppShortcutBlockProps> = ({ id, label, path, initialIconBase64 }) => {
  const [iconBase64, setIconBase64] = useState<string | null>(initialIconBase64 || null);
  const { extractIcon, launchShortcut } = useSystemStore();
  const removeBlock = useWorkspaceStore((state) => state.removeBlock);

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
      className="w-full h-full bg-white/20 dark:bg-black/40 backdrop-blur-md rounded-2xl flex flex-col items-center justify-center p-4 border border-white/30 dark:border-white/10 hover:bg-white/30 dark:hover:bg-black/50 transition-colors drag-handle cursor-grab active:cursor-grabbing group relative"
      onDoubleClick={handleLaunch}
    >
      <button 
        onClick={(e) => {
          e.stopPropagation();
          removeBlock(id);
        }}
        className="absolute top-2 right-2 p-1 rounded-full bg-black/20 hover:bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-all cursor-pointer z-10"
      >
        <X size={14} />
      </button>

      <div className="w-16 h-16 mb-3 flex items-center justify-center rounded-xl bg-white/5 group-hover:scale-105 transition-transform">
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
