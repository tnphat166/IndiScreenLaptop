import React, { useState } from 'react';
import { useWorkspaceStore } from '../../stores/workspaceStore';
import { X } from 'lucide-react';

interface StickyNoteBlockProps {
  id: string;
  initialText?: string;
  onTextChange?: (id: string, text: string) => void;
}

export const StickyNoteBlock: React.FC<StickyNoteBlockProps> = ({ id, initialText = '', onTextChange }) => {
  const [text, setText] = useState(initialText);
  const removeBlock = useWorkspaceStore((state) => state.removeBlock);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    if (onTextChange) {
      onTextChange(id, e.target.value);
    }
  };

  return (
    <div className="w-full h-full bg-yellow-200 dark:bg-yellow-300 rounded-2xl p-4 shadow-lg flex flex-col relative group drag-handle cursor-grab active:cursor-grabbing">
      <button 
        onClick={(e) => {
          e.stopPropagation();
          removeBlock(id);
        }}
        className="absolute top-2 right-2 p-1 rounded-full bg-black/10 hover:bg-red-500 hover:text-white text-black/50 opacity-0 group-hover:opacity-100 transition-all cursor-pointer z-20"
      >
        <X size={14} />
      </button>

      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-3 bg-black/10 rounded-b-full"></div>
      
      <textarea 
        className="w-full h-full bg-transparent resize-none outline-none text-gray-800 placeholder-gray-500/50 mt-2 font-handwriting"
        placeholder="Type a quick note..."
        value={text}
        onChange={handleChange}
        onMouseDown={(e) => e.stopPropagation()} // Prevent dragging when clicking inside textarea
      />
    </div>
  );
};
