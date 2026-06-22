import React from 'react';

interface GlassPanelProps {
  children: React.ReactNode;
  className?: string;
  blur?: 'sm' | 'md' | 'lg' | 'xl';
  opacity?: 'low' | 'medium' | 'high';
  border?: boolean;
  rounded?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

const BLUR_MAP: Record<NonNullable<GlassPanelProps['blur']>, string> = {
  sm: 'backdrop-blur-[8px]',
  md: 'backdrop-blur-[12px]',
  lg: 'backdrop-blur-[16px]',
  xl: 'backdrop-blur-[24px]',
};

const OPACITY_MAP_DARK: Record<NonNullable<GlassPanelProps['opacity']>, string> = {
  low: 'bg-white/5',
  medium: 'bg-white/10',
  high: 'bg-white/20',
};

const OPACITY_MAP_LIGHT: Record<NonNullable<GlassPanelProps['opacity']>, string> = {
  low: 'bg-black/5',
  medium: 'bg-black/10',
  high: 'bg-black/20',
};

const ROUNDED_MAP: Record<NonNullable<GlassPanelProps['rounded']>, string> = {
  sm: 'rounded-lg',
  md: 'rounded-xl',
  lg: 'rounded-2xl',
  xl: 'rounded-3xl',
  full: 'rounded-full',
};

/**
 * GlassPanel — A glassmorphic container with configurable blur, opacity, and border.
 * Automatically adapts to light/dark theme.
 */
export const GlassPanel: React.FC<GlassPanelProps> = ({
  children,
  className = '',
  blur = 'xl',
  opacity = 'low',
  border = true,
  rounded = 'lg',
}) => {
  const blurClass = BLUR_MAP[blur];
  const roundedClass = ROUNDED_MAP[rounded];

  const darkBg = OPACITY_MAP_DARK[opacity];
  const lightBg = OPACITY_MAP_LIGHT[opacity];

  const borderClass = border
    ? 'border border-white/10 dark:border-white/10 border-black/5'
    : '';

  return (
    <div
      className={[
        // Dark mode styles (default)
        `dark:${darkBg}`,
        // Light mode styles
        lightBg,
        blurClass,
        roundedClass,
        borderClass,
        'shadow-glass',
        'theme-transition',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </div>
  );
};
