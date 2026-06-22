import React from 'react';
import { useThemeStore } from '../../stores/themeStore';
import { GRID_CELL_SIZE, DOT_RADIUS, DOT_OPACITY_DARK, DOT_OPACITY_LIGHT } from '../../types';

/**
 * DotGrid — Renders a subtle dot-grid pattern across the entire workspace.
 * Uses CSS radial-gradient for lightweight, resolution-independent rendering.
 *
 * Grid specs (from FEATURE_project_setup.md):
 * - Cell size: 16px × 16px
 * - Dot style: circle, radius 1px
 * - Opacity: 0.15 (dark mode) / 0.10 (light mode)
 * - Dot color: white (dark mode) / gray-400 (light mode)
 *
 * The dot-grid is purely visual and does NOT interfere with click-through.
 */
export const DotGrid: React.FC = () => {
  const theme = useThemeStore((state) => state.theme);

  const dotColor =
    theme === 'dark'
      ? `rgba(255, 255, 255, ${DOT_OPACITY_DARK})`
      : `rgba(156, 163, 175, ${DOT_OPACITY_LIGHT})`;

  const backgroundStyle: React.CSSProperties = {
    position: 'fixed',
    inset: 0,
    width: '100%',
    height: '100%',
    backgroundImage: `radial-gradient(circle, ${dotColor} ${DOT_RADIUS}px, transparent ${DOT_RADIUS}px)`,
    backgroundSize: `${GRID_CELL_SIZE}px ${GRID_CELL_SIZE}px`,
    backgroundPosition: '0 0',
    pointerEvents: 'none', // Ensure dots don't interfere with click-through
    zIndex: 0,
  };

  return <div style={backgroundStyle} aria-hidden="true" />;
};
