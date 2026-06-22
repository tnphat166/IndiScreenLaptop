import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      /* ── Grid System ─────────────────────────────────── */
      spacing: {
        'grid-0.5': '8px',   // half-cell (gutter)
        'grid-1': '16px',    // 1 cell
        'grid-2': '32px',    // 2 cells
        'grid-3': '48px',    // 3 cells
        'grid-4': '64px',    // 4 cells
        'grid-5': '80px',    // 5 cells
        'grid-6': '96px',    // 6 cells
        'grid-8': '128px',   // 8 cells
        'grid-10': '160px',  // 10 cells
        'grid-12': '192px',  // 12 cells
        'grid-16': '256px',  // 16 cells
      },

      /* ── Colors ──────────────────────────────────────── */
      colors: {
        glass: {
          white: {
            5: 'rgba(255, 255, 255, 0.05)',
            10: 'rgba(255, 255, 255, 0.10)',
            15: 'rgba(255, 255, 255, 0.15)',
            20: 'rgba(255, 255, 255, 0.20)',
            30: 'rgba(255, 255, 255, 0.30)',
          },
          black: {
            5: 'rgba(0, 0, 0, 0.05)',
            10: 'rgba(0, 0, 0, 0.10)',
            15: 'rgba(0, 0, 0, 0.15)',
            20: 'rgba(0, 0, 0, 0.20)',
            30: 'rgba(0, 0, 0, 0.30)',
          },
          border: {
            light: 'rgba(0, 0, 0, 0.05)',
            dark: 'rgba(255, 255, 255, 0.10)',
          },
        },
        dot: {
          dark: 'rgba(255, 255, 255, 0.15)',
          light: 'rgba(156, 163, 175, 0.10)', // gray-400 @ 10%
        },
        accent: {
          primary: '#6366f1',     // Indigo-500
          secondary: '#8b5cf6',   // Violet-500
          success: '#22c55e',     // Green-500
          warning: '#f59e0b',     // Amber-500
          danger: '#ef4444',      // Red-500
        },
      },

      /* ── Border Radius ───────────────────────────────── */
      borderRadius: {
        bento: '16px',   // panels
        block: '12px',   // blocks
      },

      /* ── Backdrop Blur ───────────────────────────────── */
      backdropBlur: {
        'glass-sm': '8px',
        'glass-md': '12px',
        'glass-lg': '16px',
        'glass-xl': '24px',
      },

      /* ── Box Shadow ──────────────────────────────────── */
      boxShadow: {
        glass: '0 8px 32px 0 rgba(0, 0, 0, 0.15)',
        'glass-lg': '0 16px 48px 0 rgba(0, 0, 0, 0.20)',
        'glass-inner': 'inset 0 1px 1px 0 rgba(255, 255, 255, 0.08)',
        'glass-hover': '0 8px 32px 0 rgba(0, 0, 0, 0.25), inset 0 1px 1px 0 rgba(255, 255, 255, 0.12)',
      },

      /* ── Typography ──────────────────────────────────── */
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '0.875rem' }],  // 10px
      },

      /* ── Transitions ─────────────────────────────────── */
      transitionDuration: {
        theme: '300ms',
      },

      /* ── Opacity ─────────────────────────────────────── */
      opacity: {
        'glass-low': '0.05',
        'glass-medium': '0.10',
        'glass-high': '0.20',
      },
    },
  },
  plugins: [],
};

export default config;
