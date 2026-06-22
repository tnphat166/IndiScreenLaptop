import React, { useState, useEffect } from 'react';
import { useWorkspaceStore } from '../../stores/workspaceStore';
import { X } from 'lucide-react';

export const PomodoroBlock: React.FC<{ id: string }> = ({ id }) => {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 mins
  const [isActive, setIsActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const removeBlock = useWorkspaceStore((state) => state.removeBlock);

  useEffect(() => {
    let interval: any = null;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      // Auto switch
      setIsBreak(!isBreak);
      setTimeLeft(isBreak ? 25 * 60 : 5 * 60);
      setIsActive(false);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft, isBreak]);

  const toggleTimer = () => setIsActive(!isActive);
  
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(isBreak ? 5 * 60 : 25 * 60);
  };

  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;

  return (
    <div className={`w-full h-full backdrop-blur-md rounded-2xl flex flex-col p-4 border text-white shadow-lg transition-colors duration-500 drag-handle cursor-grab active:cursor-grabbing group relative
      ${isBreak ? 'bg-green-500/80 border-green-400' : 'bg-red-500/80 border-red-400'}`}
    >
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
        <span>🍅</span> {isBreak ? 'Short Break' : 'Pomodoro'}
      </h3>
      
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="text-5xl font-mono font-bold mb-4 tracking-wider">
          {mins.toString().padStart(2, '0')}:{secs.toString().padStart(2, '0')}
        </div>
        
        <div className="flex gap-2" onMouseDown={(e) => e.stopPropagation()}>
          <button 
            onClick={toggleTimer}
            className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-full font-medium transition-colors"
          >
            {isActive ? 'Pause' : 'Start'}
          </button>
          <button 
            onClick={resetTimer}
            className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
          >
            🔄
          </button>
        </div>
      </div>
    </div>
  );
};
