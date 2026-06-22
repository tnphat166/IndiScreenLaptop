import React from 'react';
import { useWidgetStore } from '../../stores/widgetStore';
import { useWorkspaceStore } from '../../stores/workspaceStore';
import { X } from 'lucide-react';

export const SystemMonitorBlock: React.FC<{ id: string }> = ({ id }) => {
  const { systemStats } = useWidgetStore();
  const removeBlock = useWorkspaceStore((state) => state.removeBlock);

  if (!systemStats) {
    return (
      <div className="w-full h-full bg-white/20 dark:bg-black/40 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/30 dark:border-white/10">
        <span className="text-sm font-medium opacity-70">Loading Stats...</span>
      </div>
    );
  }

  const memoryUsedGB = (systemStats.memory_used / 1024 / 1024 / 1024).toFixed(1);
  const memoryTotalGB = (systemStats.memory_total / 1024 / 1024 / 1024).toFixed(1);
  const memoryPercent = (systemStats.memory_used / systemStats.memory_total) * 100;

  return (
    <div className="w-full h-full bg-white/20 dark:bg-black/40 backdrop-blur-md rounded-2xl flex flex-col p-4 border border-white/30 dark:border-white/10 text-gray-800 dark:text-gray-200 drag-handle cursor-grab active:cursor-grabbing group relative">
      <button 
        onClick={(e) => {
          e.stopPropagation();
          removeBlock(id);
        }}
        className="absolute top-2 right-2 p-1 rounded-full bg-black/20 hover:bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-all cursor-pointer z-20"
      >
        <X size={14} />
      </button>

      <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
        <span>⚙️</span> System Stats
      </h3>
      
      <div className="flex-1 flex flex-col justify-center gap-3">
        {/* CPU */}
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span>CPU</span>
            <span className="font-mono">{systemStats.cpu_usage.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-black/10 dark:bg-white/10 h-2 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-500 rounded-full transition-all duration-500"
              style={{ width: `${systemStats.cpu_usage}%` }}
            />
          </div>
        </div>

        {/* RAM */}
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span>RAM</span>
            <span className="font-mono">{memoryUsedGB} / {memoryTotalGB} GB</span>
          </div>
          <div className="w-full bg-black/10 dark:bg-white/10 h-2 rounded-full overflow-hidden">
            <div 
              className="h-full bg-purple-500 rounded-full transition-all duration-500"
              style={{ width: `${memoryPercent}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
