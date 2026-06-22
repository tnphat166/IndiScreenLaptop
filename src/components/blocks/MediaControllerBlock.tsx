import React from 'react';
import { useWidgetStore } from '../../stores/widgetStore';
import { useWorkspaceStore } from '../../stores/workspaceStore';
import { X } from 'lucide-react';

export const MediaControllerBlock: React.FC<{ id: string }> = ({ id }) => {
  const { mediaInfo, mediaPlayPause, mediaNext, mediaPrev } = useWidgetStore();
  const removeBlock = useWorkspaceStore((state) => state.removeBlock);

  return (
    <div className="w-full h-full bg-white/20 dark:bg-black/40 backdrop-blur-md rounded-2xl flex flex-col p-4 border border-white/30 dark:border-white/10 text-gray-800 dark:text-gray-200 overflow-hidden relative drag-handle cursor-grab active:cursor-grabbing group">
      <button 
        onClick={(e) => {
          e.stopPropagation();
          removeBlock(id);
        }}
        className="absolute top-2 right-2 p-1 rounded-full bg-black/20 hover:bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-all cursor-pointer z-20"
      >
        <X size={14} />
      </button>

      {/* Background blur of album art */}
      {mediaInfo?.album_art_url && (
        <div 
          className="absolute inset-0 opacity-20 bg-cover bg-center blur-xl scale-110"
          style={{ backgroundImage: `url(${mediaInfo.album_art_url})` }}
        />
      )}

      <div className="relative z-10 flex-1 flex flex-col">
        <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
          <span>🎵</span> Now Playing
        </h3>

        <div className="flex-1 flex items-center gap-3">
          <div className="w-16 h-16 rounded-xl bg-black/10 dark:bg-white/10 overflow-hidden shrink-0 flex items-center justify-center">
            {mediaInfo?.album_art_url ? (
              <img src={mediaInfo.album_art_url} alt="Album Art" className="w-full h-full object-cover" />
            ) : (
              <span className="text-2xl">💿</span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold truncate">{mediaInfo?.title || 'Not Playing'}</div>
            <div className="text-xs opacity-70 truncate">{mediaInfo?.artist || 'Unknown Artist'}</div>
          </div>
        </div>

        <div 
          className="flex items-center justify-center gap-4 mt-2"
          onMouseDown={(e) => e.stopPropagation()}
        >
          <button onClick={mediaPrev} className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors cursor-pointer">
            ⏮️
          </button>
          <button onClick={mediaPlayPause} className="w-10 h-10 flex items-center justify-center bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors shadow-lg cursor-pointer">
            {mediaInfo?.is_playing ? '⏸' : '▶️'}
          </button>
          <button onClick={mediaNext} className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors cursor-pointer">
            ⏭️
          </button>
        </div>
      </div>
    </div>
  );
};
