# Phase 4: Custom Taskbar & Native App Integration (Summary)

## 1. Overview
Phase 4 focused on bridging the gap between the web-based overlay UI and the native Windows operating system. It introduced a Floating Glass Taskbar, an interactive Flyout Menu, and direct communication with the OS to extract native `.exe` icons and launch applications. This phase elevated the app from a simple web overlay to a true "Desktop Replacement".

## 2. Key Technology Choices
- **Tauri Commands (`system.rs`)**: Built custom Rust endpoints to communicate with Windows APIs without relying on heavy external node modules.
- **`windows` & `windows-icons` Crates**: Utilized the `windows` crate for `EnumWindows` to fetch running applications, and `windows-icons` to effortlessly extract Base64 encoded high-resolution icons from native executables.
- **TailwindCSS Glassmorphism**: Leveraged utility classes (`backdrop-blur-xl`, `bg-white/10`, `border-white/20`) to create a floating pill taskbar that blends seamlessly with any underlying desktop wallpaper.

## 3. Implementation Details

### 3.1 Floating Glass Taskbar (`FloatingGlassTaskbar.tsx`)
- Positioned absolutely at the bottom-center of the screen.
- Employs a glassmorphism design.
- Dynamically polls and renders a list of actively running Windows applications (via `get_running_apps`), displaying their first initials if icons are not yet cached.
- Provides a clean separation of pinned items (via the Flyout Menu) and running apps.

### 3.2 Flyout Menu (`FlyoutMenu.tsx`)
- An expandable menu triggered on `hover`.
- Uses CSS transitions to stagger the entrance of child icons along the Y-axis.
- Implements the specific easing curve `cubic-bezier(0.25, 0.46, 0.45, 0.94)` as defined in the original spec.

### 3.3 App Shortcut Blocks (`AppShortcutBlock.tsx`)
- A new widget block type added to the Bento grid.
- Accepts an `.exe` file path as input.
- Automatically communicates with the Rust backend (`extract_icon`) upon mounting to fetch the native icon as a Base64 string and displays it.
- Triggers `launch_shortcut` on double-click, natively spawning the target application on top of the workspace.

### 3.4 Zustand Store (`systemStore.ts`)
- A new dedicated store created to manage native integrations.
- Handles asynchronous polling (every 3 seconds) for running apps to keep the taskbar updated.
- Centralizes the Tauri `invoke` calls for clean UI code.

## 4. Result
The application now boasts a responsive, iOS/macOS-like dock that interacts directly with Windows processes. Users can drag shortcut blocks onto their grid, see the native icons, and launch software directly from the custom interface.
