import React from 'react';

interface InputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: 'text' | 'password' | 'number';
  disabled?: boolean;
  className?: string;
}

/**
 * Input — Glassmorphic text input with focus states and placeholder styling.
 * Automatically adapts to light/dark theme.
 */
export const Input: React.FC<InputProps> = ({
  value,
  onChange,
  placeholder = '',
  type = 'text',
  disabled = false,
  className = '',
}) => {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      className={[
        // Dark mode (default)
        'dark:bg-white/5 dark:border-white/10 dark:text-white dark:placeholder-white/40',
        'dark:focus:border-white/25 dark:focus:bg-white/10 dark:focus:ring-white/10',
        // Light mode
        'bg-black/5 border-black/5 text-gray-900 placeholder-gray-400',
        'focus:border-black/15 focus:bg-black/10 focus:ring-black/5',
        // Shared styles
        'w-full backdrop-blur-md border rounded-block',
        'px-3 py-2 text-sm',
        'outline-none transition-all duration-200',
        'focus:ring-1',
        // Disabled state
        disabled ? 'opacity-40 cursor-not-allowed' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    />
  );
};
