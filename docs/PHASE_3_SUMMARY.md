# Phase 3: Data Persistence SDD (Software Design Document)

## 1. Overview
Phase 3 introduces a local persistence layer for SuperIndividuaMyScreenLaptopApp. This ensures that the user's workspace layout—including widget positions, sizes, overlapping (z-index), and configuration data—is saved between sessions.

## 2. Architecture & Technology Choices
Based on technical constraints and the need for simplicity on Windows, we elected to use **JSON File System Persistence** via `@tauri-apps/plugin-store` rather than a full SQLite/SQLCipher database.
- **Simplicity:** Avoids complex C++ build requirements on Windows.
- **Sufficiency:** The workspace layout state is relatively small (an array of block objects), which easily fits into a fast, single JSON file read/write cycle.
- **Location:** The state is saved to the OS-specific application data directory (e.g., `%APPDATA%\com.superindividua.screenlaptop\workspace.json` on Windows).

## 3. Implementation Details

### 3.1 Store Wrapper (`src/utils/store.ts`)
A dedicated utility was created to handle communication with the Tauri backend.
- `loadBlocksFromStore()`: Asynchronously reads the `blocks` array from `workspace.json`.
- `saveBlocksToStore(blocks)`: Asynchronously serializes and writes the `blocks` array to disk.

### 3.2 Zustand State Management (`src/stores/workspaceStore.ts`)
The `workspaceStore` was modified to be the single source of truth that synchronizes with the Tauri store.

**Initialization (`initializeStore`):**
- Called from `App.tsx` on mount.
- Fetches existing blocks from disk.
- Applies a **validation filter** to ensure only recognized block types (`'demo'`, `'clock'`, `'system_monitor'`, `'shortcut'`) are loaded. This cleans up any corrupted or legacy data (e.g., `'generic'`).
- If no valid blocks are found, it initializes the store with default placeholder blocks.

**Debounced Saving:**
To prevent performance degradation (disk thrashing) during rapid, continuous events like dragging and resizing:
- Actions like `updateBlockPosition` and `updateBlockSize` trigger a **debounced save** (500ms).
- This ensures the UI remains completely responsive at 60fps while dragging, and the file is only written when the user pauses or stops.

**Instant Saving:**
- Discrete actions that do not fire continuously (e.g., `addBlock`, `removeBlock`, `bringToFront`) bypass the debounce and trigger an immediate disk write.

### 3.3 Error Handling UI
In `WorkspaceGrid.tsx`, a safety mechanism was added:
- If a block with an unknown type manages to bypass validation, it renders an explicit "Unknown Block Type" red error block.
- This error block now includes a **Close button** to allow users to manually delete corrupted data from the UI without having to clear their entire application data folder.

## 4. State Diagram
1. **Startup:** `App.tsx` -> `initializeStore()` -> `loadBlocksFromStore()` -> Wait for data -> Render.
2. **Move/Resize:** User drags block -> Zustand state updates -> UI re-renders -> 500ms idle -> `saveBlocksToStore()`.
3. **Add/Remove:** User adds block -> Zustand state updates -> UI re-renders -> `saveBlocksToStore()` (instant).
