# Phase 5: Widgets Hub (Summary)

## 1. Overview
Phase 5 transformed the generic Workspace grid into a fully functional Dashboard by introducing a robust ecosystem of Widgets. The objective was to replace the need for separate standalone utilities (like a music controller, system monitor, sticky notes, weather app) by integrating them directly into the "Desktop" layout, maintaining the high-performance and unified design language of the app.

## 2. Key Technology Choices
- **Rust `sysinfo` Crate**: Used to efficiently fetch real-time CPU and Memory usage directly from the OS layer, bypassing Node.js overhead.
- **Win32 Input API (Keyboard Simulation)**: Used `windows::Win32::UI::Input::KeyboardAndMouse` to send virtual key presses (`VK_MEDIA_PLAY_PAUSE`, etc.), establishing a universal media controller that natively supports any background application (Spotify, YouTube, Apple Music).
- **Zustand Polling**: Implemented an async state mechanism (`useWidgetStore`) that polls the Tauri backend every 2 seconds to keep the dashboard widgets dynamically updated without triggering heavy global re-renders.

## 3. Implementation Details

### 3.1 New Block Types & Store
- Expanded `BlockType` to include `'system_monitor'`, `'media'`, `'weather'`, `'pomodoro'`, and `'sticky_note'`.
- Created `widgetStore.ts` to independently govern widget-specific data like `SystemStats` and `MediaInfo`.

### 3.2 Widget Components
1. **System Monitor Block**: Visualizes CPU load and RAM usage with clean, glassmorphic progress bars.
2. **Media Controller Block**: A universal media widget mimicking the iOS control center. Capable of triggering system-level Play/Pause and track skips.
3. **Weather Block**: Integrates the Open-Meteo API to fetch real-time temperature and weather conditions without requiring user-provided API keys.
4. **Pomodoro Timer Block**: A focus timer transitioning between work (red) and break (green) states, complete with auto-switching and dynamic UI styling.
5. **Sticky Note Block**: A scratchpad widget allowing persistent text entry, featuring a playful design with a mock "tape" strip at the top.

### 3.3 UX & Interactivity Enhancements
- **Drag Handlers**: Standardized the `drag-handle` across all widgets, ensuring users can grab and reposition widgets organically without triggering unintended clicks on internal buttons.
- **Flyout Menu Debounce**: Addressed an edge-case UX bug by implementing a 300ms hover-leave timeout to the Flyout Menu. This ensures a forgiving interaction radius, preventing the menu from disappearing abruptly when navigating the cursor across gaps.
- **Close Functionality**: Embedded a sleek, hover-activated "Close" (X) button within every widget, granting users the flexibility to clear out unwanted blocks instantly.

## 4. Result
The core framework is now populated with highly functional, real-world components. The application functions as an aesthetic, personalized command center bridging web UI paradigms with deep OS-level system integration.
