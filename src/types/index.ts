/* ── Shared TypeScript types for SuperIndividuaMyScreenLaptopApp ── */

/** Theme mode */
export type Theme = 'light' | 'dark';

/** Position and size of a block on the Bento grid */
export interface BlockPosition {
  id: string;
  x: number;      // Grid-aligned X coordinate (px)
  y: number;      // Grid-aligned Y coordinate (px)
  width: number;  // Width in px (multiple of GRID_CELL_SIZE)
  height: number; // Height in px (multiple of GRID_CELL_SIZE)
}

/** Props for the DemoBlock component */
export interface DemoBlockProps {
  id: string;
  label: string;
  icon?: string;
}

/** Theme event payload from Rust backend */
export interface ThemeChangedPayload {
  theme: Theme;
}

/* ── Grid Constants ─────────────────────────────────── */
export const GRID_CELL_SIZE = 16;     // 16px per cell
export const GRID_GUTTER = 8;         // 0.5 cell gutter between blocks
export const BLOCK_MIN_SIZE = 64;     // 4×4 cells minimum block size
export const DOT_RADIUS = 1;          // Dot radius in px
export const DOT_OPACITY_DARK = 0.15;
export const DOT_OPACITY_LIGHT = 0.10;
