import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
}

const SIZE_CLASSES: Record<NonNullable<ButtonProps['size']>, string> = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
};

const VARIANT_CLASSES: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary: [
    'bg-accent-primary/90 hover:bg-accent-primary text-white',
    'shadow-md hover:shadow-lg',
    'active:scale-[0.97]',
    'border border-white/10',
  ].join(' '),
  secondary: [
    'dark:bg-white/10 dark:hover:bg-white/15 dark:text-white',
    'bg-black/5 hover:bg-black/10 text-gray-900',
    'border dark:border-white/10 border-black/5',
    'active:scale-[0.97]',
  ].join(' '),
  ghost: [
    'bg-transparent hover:dark:bg-white/10 hover:bg-black/5',
    'dark:text-white/70 dark:hover:text-white text-gray-600 hover:text-gray-900',
    'active:scale-[0.97]',
  ].join(' '),
};

/**
 * Button — Glassmorphic button with primary/secondary/ghost variants.
 * Supports hover, active, and disabled states with smooth transitions.
 */
export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  onClick,
  className = '',
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={[
        'inline-flex items-center justify-center',
        'font-medium rounded-block',
        'backdrop-blur-sm',
        'transition-all duration-200 ease-out',
        'select-none cursor-pointer',
        'focus:outline-none focus:ring-2 focus:ring-accent-primary/50',
        SIZE_CLASSES[size],
        VARIANT_CLASSES[variant],
        disabled ? 'opacity-40 cursor-not-allowed pointer-events-none' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </button>
  );
};
