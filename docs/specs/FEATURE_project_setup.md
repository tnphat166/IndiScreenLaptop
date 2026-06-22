# Feature Spec: Project Foundation Setup

**Status:** [COMPLETED]
**Branch:** feature/project_setup
**Author:** AI
**Date:** 2026-06-22

---

## 1. Description

This feature establishes the complete project foundation for SuperIndividuaMyScreenLaptopApp. It covers repository initialization, toolchain configuration, the transparent desktop overlay window, the Bento Box dot-grid workspace, and shared UI primitives.

**Why:** Every subsequent feature depends on a correctly configured project with a working transparent window and grid system. Consolidating these into a single foundational phase eliminates integration risks and provides an immediately testable visual result.

**Scope includes (merged from original Phases 1–3 + demo blocks):**
- Tauri v2 + React 18 + TypeScript + Vite project scaffolding
- TailwindCSS with full design token system
- ESLint + Prettier configuration
- Git workflow setup (.gitignore, branch strategy, conventional commits)
- Transparent, frameless, fullscreen overlay window (NOT always-on-top)
- Click-through behavior for empty areas
- Bento Box dot-grid layout (16px cell, circle dots)
- Basic drag & drop with @dnd-kit
- Placeholder demo blocks (test-only, to be refactored in Phase 2)
- Shared UI primitives (GlassPanel, Button, Input)
- Auto-sync Light/Dark theme with Windows OS setting

**Scope excludes:**
- SQLite / SQLCipher database setup (Phase 3+)
- Auto-start on Windows login (Phase 2 — Desktop Overlay dedicated)
- Full block CRUD system (Phase 2 — Block System)
- Wallpaper sync with Windows OS

---

## 2. User Stories

- **US-01:** As a developer, I want to clone the repo, run `npm install` and `npm run tauri dev`, and see a working transparent overlay window on my desktop so that I can immediately start building features on a solid foundation.

- **US-02:** As a user, I want to see a clean dot-grid workspace covering my desktop where I can drag placeholder blocks around so that I understand how the Bento Box layout will feel.

- **US-03:** As a developer, I want a pre-configured design token system (colors, glassmorphism utilities, spacing, typography) so that all UI components across future features have a consistent visual language without ad-hoc styling decisions.

- **US-04:** As a user, I want the app's theme (light/dark) to automatically match my Windows system setting so that the experience feels native and integrated.

- **US-05:** As a developer, I want shared UI primitives (GlassPanel, Button, Input) available from day one so that I can compose new features quickly with consistent styling.

---

## 3. Acceptance Criteria

### 3.1 Project Scaffolding
- [x] Running `npm install` succeeds with zero errors
- [x] Running `npm run tauri dev` launches the app and opens a window
- [x] TypeScript strict mode is enabled with no `any` types
- [x] ESLint + Prettier configs are present and `npm run lint` passes cleanly
- [x] Project directory structure matches Section 9 of AI_RULES.md
- [x] `.gitignore` covers node_modules, target/, dist/, .env, OS files

### 3.2 Transparent Overlay Window
- [x] Window is fullscreen, frameless, and has a transparent background
- [x] Window is NOT always-on-top — other applications can appear above it
- [x] Mouse clicks on empty/transparent areas pass through to the Windows desktop beneath
- [x] Mouse clicks on UI elements (blocks, taskbar area) are captured normally
- [x] Window does not appear in the Windows Alt+Tab switcher (optional, best-effort)

### 3.3 Bento Box Dot-Grid
- [x] A dot-grid with 16px cell size is rendered across the workspace
- [x] Dots are small circles with low opacity (subtle, not distracting)
- [x] Grid is responsive and fills the entire screen regardless of resolution
- [x] Dot-grid is purely visual — it does not interfere with click-through on empty areas

### 3.4 Drag & Drop (Demo Blocks)
- [x] At least 3 placeholder demo blocks are rendered on the grid
- [x] Demo blocks can be dragged and repositioned using @dnd-kit
- [x] Blocks snap to the 16px grid on drop
- [x] Demo blocks are clearly marked as `// TODO: placeholder — refactor in Phase 2`
- [x] Dragging feels smooth (60 FPS, no jank)

### 3.5 Design Tokens & Theming
- [x] `tailwind.config` contains a complete design token set: colors, spacing, border-radius, backdrop-blur, opacity, box-shadow
- [x] Glassmorphism utility classes are defined (e.g., `glass-panel`, `glass-panel-light`)
- [x] Light and Dark mode tokens are defined
- [x] App theme auto-syncs with the Windows OS theme setting on launch
- [x] Theme switches reactively if the user changes the Windows theme while the app is running

### 3.6 UI Primitives
- [x] `GlassPanel` component: renders a glassmorphic container with configurable blur, opacity, and border
- [x] `Button` component: supports primary/secondary/ghost variants with hover/active states
- [x] `Input` component: text input with glassmorphic styling, focus states, and placeholder text
- [x] All primitives support both light and dark themes
- [x] All primitives have TypeScript prop interfaces

### 3.7 Git & Developer Experience
- [x] `.gitignore` is comprehensive (node_modules, target/, dist/, .env, OS files)
- [x] Branch naming follows convention: `main`, `develop`, `feature/*`
- [x] Commit messages follow conventional commits format
- [x] README.md contains setup instructions and npm scripts

---

## 4. Technical Design

### 4.1 Project Structure

```
SuperIndividuaMyScreenLaptopApp/
├── docs/
│   ├── specs/                    # Feature specifications
│   │   ├── README.md
│   │   └── FEATURE_project_setup.md
│   └── architecture.md
├── src-tauri/                    # Rust backend (Tauri v2)
│   ├── src/
│   │   ├── commands/             # Tauri command handlers
│   │   │   └── mod.rs
│   │   ├── services/             # OS integration services
│   │   │   ├── mod.rs
│   │   │   └── theme.rs          # Windows theme detection
│   │   ├── lib.rs
│   │   └── main.rs
│   ├── tauri.conf.json
│   ├── Cargo.toml
│   └── build.rs
├── src/                          # React frontend
│   ├── components/
│   │   ├── blocks/               # Block components
│   │   │   └── DemoBlock.tsx     # Placeholder demo block (test-only)
│   │   ├── taskbar/              # (empty — Phase 3)
│   │   ├── widgets/              # (empty — Phase 7)
│   │   ├── workspace/
│   │   │   ├── WorkspaceGrid.tsx # Main Bento grid + dot-grid rendering
│   │   │   └── DotGrid.tsx       # Canvas/SVG dot-grid overlay
│   │   └── ui/                   # Shared UI primitives
│   │       ├── GlassPanel.tsx
│   │       ├── Button.tsx
│   │       └── Input.tsx
│   ├── hooks/
│   │   └── useSystemTheme.ts     # Hook to detect & sync Windows theme
│   ├── stores/
│   │   └── themeStore.ts         # Zustand store for theme state
│   ├── styles/
│   │   └── globals.css           # Tailwind directives + custom utilities
│   ├── types/
│   │   └── index.ts              # Shared TypeScript types
│   ├── utils/                    # (empty — future utilities)
│   ├── App.tsx                   # Root component
│   └── main.tsx                  # Entry point
├── AI_RULES.md
├── README.md
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── postcss.config.js
├── eslint.config.js
├── .prettierrc
└── .gitignore
```

### 4.2 Tauri Window Configuration

```json
// tauri.conf.json — key window settings
{
  "app": {
    "windows": [
      {
        "label": "main",
        "title": "SuperIndividuaMyScreenLaptopApp",
        "fullscreen": true,
        "decorations": false,
        "transparent": true,
        "alwaysOnTop": false,
        "skipTaskbar": true
      }
    ]
  }
}
```

### 4.3 Click-Through Implementation (Rust)

The transparent overlay must pass mouse events through empty areas to the Windows desktop. This requires the `WS_EX_TRANSPARENT` and `WS_EX_LAYERED` extended window styles via the `windows-rs` crate.

**Approach:**
1. After Tauri creates the window, use `windows-rs` to get the HWND
2. Apply `WS_EX_TRANSPARENT | WS_EX_LAYERED` to enable click-through
3. The frontend manages "interactive zones" — areas with visible UI elements intercept clicks while transparent areas pass through

**Key Consideration:** When `WS_EX_TRANSPARENT` is applied globally, ALL clicks pass through. To selectively capture clicks on UI elements (blocks, buttons), we need one of these strategies:
- **Strategy A (Recommended):** Use a secondary invisible input-capture window layered on top, sized and positioned to match interactive UI regions. Complex but precise.
- **Strategy B:** Toggle `WS_EX_TRANSPARENT` on/off based on cursor position. The frontend sends cursor coordinates to Rust, which adds/removes the flag. Simpler but has a slight latency.
- **Strategy C:** Use `WS_EX_TRANSPARENT` only on the main window, and render interactive elements in a separate non-transparent child window. Moderate complexity.

> **Decision implemented:** Strategy B (simplest) has been prototyped first. 

### 4.4 Windows Theme Detection (Rust)

```rust
// services/theme.rs — Read Windows theme setting from Registry
// Key: HKCU\SOFTWARE\Microsoft\Windows\CurrentVersion\Themes\Personalize
// Value: AppsUseLightTheme (DWORD: 0 = dark, 1 = light)

// Tauri command exposed to frontend:
#[tauri::command]
fn get_system_theme() -> String {
    // Read registry value
    // Return "dark" or "light"
}

// Watcher for registry changes emits event to frontend
// via tauri::Emitter for reactive theme switching
```

### 4.5 Bento Grid System

```
Grid Specifications:
- Cell size: 16px × 16px
- Dot style: circle, radius 1px, opacity 0.15 (dark mode) / 0.1 (light mode)
- Dot color: white (dark mode) / gray-400 (light mode)
- Rendering: CSS background-image (radial-gradient)
- Block sizes: multiples of 16px (e.g., 1×1 = 16px, 4×4 = 64px, 8×8 = 128px)
- Gutter: 8px (0.5 cell) between blocks
- Snap: blocks snap to nearest grid cell on drop
```

### 4.6 Component Specifications

#### GlassPanel
```typescript
interface GlassPanelProps {
  children: React.ReactNode;
  className?: string;
  blur?: 'sm' | 'md' | 'lg' | 'xl';   // backdrop-blur intensity
  opacity?: 'low' | 'medium' | 'high';  // background opacity
  border?: boolean;                      // subtle light border
  rounded?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}
```

#### Button
```typescript
interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
}
```

#### Input
```typescript
interface InputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: 'text' | 'password' | 'number';
  disabled?: boolean;
  className?: string;
}
```

### 4.7 State Management

```typescript
// stores/themeStore.ts
interface ThemeStore {
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  syncWithSystem: () => Promise<void>;
}
```

### 4.8 Key Dependencies (Phase 1 only)

| Package | Purpose |
|---------|---------|
| `@tauri-apps/cli` | Tauri CLI for dev/build |
| `@tauri-apps/api` | Frontend ↔ Rust IPC |
| `react`, `react-dom` | UI library |
| `typescript` | Type safety |
| `vite`, `@vitejs/plugin-react` | Build tool |
| `tailwindcss`, `postcss`, `autoprefixer` | Styling |
| `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities` | Drag & drop |
| `zustand` | State management |
| `lucide-react` | Icons |
| `eslint`, `prettier` | Code quality (dev) |

Rust crates:
| Crate | Purpose |
|-------|---------|
| `tauri` | Core framework |
| `serde`, `serde_json` | Serialization |
| `windows-rs` | OS API (click-through, theme detection) |

---

## 5. UI/UX Reference

### 5.1 Dot Grid Visual
```
· · · · · · · · · · · · · · · · · ·
· · · · · · · · · · · · · · · · · ·
· · · ┌─────────────┐ · · · · · · ·
· · · │             │ · · · · · · ·
· · · │  Demo Block │ · · · · · · ·
· · · │   (drag me) │ · · · · · · ·
· · · └─────────────┘ · · · · · · ·
· · · · · · · · · · · · · · · · · ·
```

### 5.2 Glassmorphism Style Reference
- **Dark mode:** `bg-white/5 backdrop-blur-xl border border-white/10 shadow-xl`
- **Light mode:** `bg-black/5 backdrop-blur-xl border border-black/5 shadow-lg`
- Rounded corners: `rounded-2xl` (16px) for panels, `rounded-xl` (12px) for blocks
- Subtle inner glow on hover

### 5.3 Demo Block Appearance
- Glassmorphic card with rounded corners
- Displays block label and a drag handle icon
- Shows a subtle resize indicator at bottom-right (visual only, resize logic in Phase 2)
- Smooth drag animation with slight scale-up (`transform: scale(1.02)`) when grabbed

---

## 6. Edge Cases

| # | Edge Case | Handling |
|---|-----------|----------|
| 1 | Multiple monitors | Phase 1: render on primary monitor only. Multi-monitor support is a future enhancement. |
| 2 | High-DPI / scaling (125%, 150%, 200%) | Grid cell size must be calculated using `window.devicePixelRatio`. Dots and blocks must render crisp at all scaling factors. |
| 3 | Windows theme changes while app is running | The `useSystemTheme` hook listens for Tauri events emitted by the Rust theme watcher. Theme transitions smoothly with CSS transitions. |
| 4 | Very low resolution (< 1280×720) | Minimum supported resolution: 1280×720. Below this, the grid may clip but should not crash. |
| 5 | Tauri window fails to set transparent | Fallback to a solid dark background with a warning toast. Log the error. |
| 6 | `windows-rs` click-through API fails | Fallback to a normal (non-click-through) window. Log a warning and surface it to the user. |
| 7 | User drags a demo block off-screen | Clamp block position to viewport bounds on drop. |
| 8 | Rust prerequisites missing (MSVC, WebView2) | README must document all prerequisites. `npm run tauri dev` will surface clear error messages from Tauri CLI. |

---

## 7. Dependencies

- **External prerequisites (must be pre-installed by developer):**
  - Node.js 18+ and npm
  - Rust toolchain (rustup, stable channel)
  - Microsoft Visual Studio C++ Build Tools (MSVC)
  - WebView2 runtime (bundled in Windows 11, may need install on Windows 10)

- **No dependency on other features** — this is the foundational feature that all others depend on.

---

## 8. Verification Plan

### 8.1 Automated
- `npm run lint` — ESLint + Prettier pass with zero errors/warnings
- `npm run build` — TypeScript compiles with zero errors
- `npm run tauri build` — Tauri builds successfully (debug mode)

### 8.2 Manual
- [x] App launches as a transparent overlay on the desktop
- [x] Desktop icons and wallpaper visible through the transparent window
- [x] Clicking on empty space interacts with the desktop (click-through works)
- [x] Clicking on a demo block selects/drags it (click capture works)
- [x] Dot grid renders correctly at the user's screen resolution and DPI scaling
- [x] Demo blocks snap to 16px grid when dropped
- [x] Changing Windows theme (Settings > Personalization > Colors) updates the app theme
- [x] All three UI primitives (GlassPanel, Button, Input) render correctly in both themes
