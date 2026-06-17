# General Specification & Implementation Plan: SuperIndividuaMyScreenLaptopApp

## 1. Product Overview
**SuperIndividuaMyScreenLaptopApp** is a borderless workspace that runs automatically on system startup, displaying immediately as the desktop overlay once the lock screen is dismissed. It breaks the boundaries between physical file management, project/task management systems, and UI personalization. It provides a smooth, multitasking experience akin to a mobile OS right on a personal computer.
- **Core Value Proposition (UVP):** Freedom like Canva, Discipline like Notion, Smoothness like iOS, and Deep System Integration like a native OS component.
- **Operating Model:** Local-first, prioritizing personal data security and high performance.
- **Primary Platform:** Windows 10/11.

## 2. Architecture & Tech Stack
- **Core/Backend:** Tauri + Rust. Handles physical file linking, native OS API interactions (Wi-Fi/Bluetooth), `.exe` icon extraction, and complex window state management. Target RAM consumption < 100MB.
- **Frontend (UI/UX):** ReactJS + TypeScript + `dnd-kit` + **TailwindCSS** (for rapid glassmorphism styling).
- **Data Storage:** SQLite + SQLCipher (AES-256 encryption, automatically decrypted via Windows Credential Manager).

## 3. System Features
### 3.1 Transparent Overlay Desktop
- **Startup:** Launches automatically and replaces the visual desktop experience immediately upon login.
- **Native Interaction (Click-Through):** Empty spaces allow mouse clicks to pass through to the Windows Desktop (for lasso-select, right-click context menus).
- **Window Management:** Standard behavior; launching applications opens them natively on top of the workspace without blurring or altering the workspace background.
- **Wallpaper Sync:** Changing the wallpaper within the app updates the native Windows OS wallpaper.

### 3.2 Swipeable Multi-Page Interface
- **Workspace (Bento Box UI):** Flat architecture using a "Bento Box" grid system. Blocks containing apps/files can expand in-place. Small blocks support internal pagination (iOS folder style). External files dragged here create **shortcuts** (saving disk space). If the original physical file is deleted, the app shortcut becomes invalid/deleted to optimize performance.
- **Widgets Hub:** Core widgets include Pomodoro timer, Spotify/Apple Music controller, Weather, System CPU/RAM monitor, and Sticky Notes.
- **Control Center:** Direct OS communication for Wi-Fi, Bluetooth, brightness, and volume.

### 3.3 Custom Taskbar & Flyout Menu
- **Aesthetic:** A "Floating Pill" design utilizing heavy **Glassmorphism** (frosted glass, backdrop blur, semi-transparent dark/light backgrounds with subtle light borders), as per the user's reference images.
- **Positioning:** User-selectable (all 4 edges). Floats elegantly over the native Windows taskbar or on the sides like a macOS/Ubuntu dock.
- **Active App Integration:** Displays currently running Windows applications alongside pinned shortcuts. minimalist white/monochrome icons are preferred for system functions.
- **Flyout Menu Animation:** Child icons slide out along X/Y axes (`duration: 300ms`, `easing: cubic-bezier(0.25, 0.46, 0.45, 0.94)`, `stagger_delay: 50ms`).

## 4. Task & Block Architecture
### 4.1 Comprehensive Task Management (To-do & Goals)
- **Hierarchy:** Daily (recurring, auto-reset), Monthly, Long-term Goals.
- **Features:** Sub-tasks, deadlines, push notifications, folders, tags, color-coding, smart filters.
- **Status:** Auto-changing icons. Pin functionality.
- **Calendar:** Scalable local database to support future Cloud Sync (Google Calendar/Outlook).

### 4.2 Block-based Architecture & UI
- **Visual Drag & Drop (Bento Grid):** Fine-grained dot-grid system ("chấm bi") combined with a Bento box structure. Blocks have varying dimensions (1x1, 2x1, 2x2) but maintain consistent gutters and rounded corners for a clean, aesthetic look.
- **Native Icon Extraction:** The Rust backend automatically extracts and renders the embedded high-res icons from dragged `.exe` files for immediate visual recognition.
- **Slash Command (`/`):** Quick insert menu for text, lists, media.
- **Block Morphing:** 1-click conversion between text and to-do lists.

## 5. UI/UX & Micro-interactions
- **Aesthetic Design:** High emphasis on customizable block backgrounds, elegant typography, and consistent "Bento Box" spacing. Floating elements (menus, taskbars) use **Glassmorphism** to blend beautifully with any wallpaper.
- **Views:** List, Kanban Board, Canva-style, Calendar.
- **Density & Theme:** Comfortable/Compact modes. Auto-sync Light/Dark modes (affecting the glassmorphism tint).
- **Dopamine Hit:** Smooth strikethrough animation and confetti icon effect on task completion.
- **Empty States:** Elegant illustrations with CTA buttons.

---

## 6. Software Design Document (SDD) Draft

### 6.1 Database Schema (SQLite)
- `Blocks`: id, type (image, todo, shortcut, widget), x, y, width, height, content (JSON payload), page_id, background_color.
- `Tasks`: id, block_id, title, status, deadline, is_recurring, parent_task_id.
- `Shortcuts`: id, block_id, target_path, extracted_icon_path.

### 6.2 Component Tree (React)
- `AppOverlay` (Main transparent container)
  - `WorkspaceGrid` (Handles the dot-grid and dnd-kit logic)
    - `BlockContainer` (Generic wrapper for Bento blocks)
      - `AppShortcutBlock` / `FileShortcutBlock`
      - `TodoListBlock`
      - `MediaBlock` (Images/Spotify)
      - `WidgetBlock` (Weather/Clock)
  - `FloatingGlassTaskbar` (Pill-shaped, glassmorphic dock)
  - `HiddenSettingsMenu` (Top-right hover menu)

### 6.3 Tauri API Layer (Rust)
- `extract_icon(path)`: Reads .exe and returns a base64 image string.
- `launch_shortcut(path)`: Uses OS native APIs to execute the file.
- `toggle_wifi()`, `toggle_bluetooth()`, `set_brightness()`: Windows API integrations.
- `get_running_apps()`: Returns a list of active windows and their icons for the taskbar.

---
## Phase 1: Execution Plan
If approved, the first phase of development will focus on setting up the foundation:
1. Initialize the **Tauri + React + TypeScript** repository.
2. Configure **TailwindCSS** for UI styling.
3. Set up the basic transparent, frameless, full-screen window that launches on top of the desktop.
4. Implement the "Bento Box" dot-grid layout using `dnd-kit` for basic block dragging.
