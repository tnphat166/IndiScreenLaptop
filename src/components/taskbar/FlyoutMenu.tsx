import React, { useState } from 'react';

interface FlyoutMenuItem {
  id: string;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}

interface FlyoutMenuProps {
  icon: React.ReactNode;
  items: FlyoutMenuItem[];
  direction?: 'up' | 'down' | 'left' | 'right';
}

export const FlyoutMenu: React.FC<FlyoutMenuProps> = ({ icon, items, direction = 'up' }) => {
  const [isOpen, setIsOpen] = useState(false);

  const getMenuClasses = () => {
    let base = "absolute flex transition-all duration-300 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] ";
    if (!isOpen) {
      base += "opacity-0 pointer-events-none scale-95 ";
    } else {
      base += "opacity-100 scale-100 ";
    }

    switch (direction) {
      case 'up':
        base += "bottom-full left-1/2 -translate-x-1/2 mb-4 flex-col-reverse gap-2 ";
        if (!isOpen) base += "translate-y-4";
        break;
      case 'down':
        base += "top-full left-1/2 -translate-x-1/2 mt-4 flex-col gap-2 ";
        if (!isOpen) base += "-translate-y-4";
        break;
      case 'left':
        base += "right-full top-1/2 -translate-y-1/2 mr-4 flex-row-reverse gap-2 ";
        if (!isOpen) base += "translate-x-4";
        break;
      case 'right':
        base += "left-full top-1/2 -translate-y-1/2 ml-4 flex-row gap-2 ";
        if (!isOpen) base += "-translate-x-4";
        break;
    }
    return base;
  };

  return (
    <div 
      className="relative flex items-center justify-center pointer-events-auto"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button className="w-10 h-10 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 transition-colors backdrop-blur-md border border-white/10 text-white shadow-lg">
        {icon}
      </button>

      <div className={getMenuClasses()}>
        {items.map((item, index) => (
          <button
            key={item.id}
            onClick={item.onClick}
            title={item.label}
            style={{ transitionDelay: isOpen ? `${index * 50}ms` : '0ms' }}
            className="w-10 h-10 rounded-full flex items-center justify-center bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/20 text-white shadow-lg transition-all duration-300 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]"
          >
            {item.icon}
          </button>
        ))}
      </div>
    </div>
  );
};
