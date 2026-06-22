# Feature Spec: Data Persistence (Phase 3)

**Status:** [DONE]
**Branch:** feature/persistence
**Author:** AI
**Date:** 2026-06-22

---

## 1. Description

This feature implements the persistent storage layer for SuperIndividuaMyScreenLaptopApp. It ensures that the state of the workspace (block positions, sizes, z-index, and content data) is saved locally and securely, so the user's desktop layout is restored exactly as they left it upon restarting the application.

**Why:** Phase 2 established a fully functional interactive block system, but the state is held purely in-memory (in the Zustand `workspaceStore`). To make this a viable desktop replacement, the layout and widget configurations must survive app restarts and system reboots.

**Scope includes:**
- Setup SQLite database via Tauri plugins (`@tauri-apps/plugin-sql` or raw file system JSON as a fallback).
- Database encryption (SQLCipher) for secure local-first data privacy.
- Syncing Zustand store (`workspaceStore`) with the local database.
- Auto-save mechanism (debounced) when blocks are moved, resized, added, or deleted.

**Scope excludes:**
- Cloud sync (this is a strictly local-first application).

---

## 2. User Stories

- **US-01:** As a user, I want my workspace layout (block positions and sizes) to be exactly the same when I restart the app, so I don't have to rearrange my widgets every time.
- **US-02:** As a user, I want my widget configurations (e.g., location for weather, selected shortcuts) to be saved locally and securely.

---

## 3. Acceptance Criteria

- [ ] Tauri SQL plugin (or FS plugin) is installed and configured.
- [ ] On app launch, `workspaceStore` is populated from the local database.
- [ ] Moving or resizing a block triggers a database update (debounced by ~500ms to avoid performance hits).
- [ ] Adding or removing a block instantly updates the database.
- [ ] Data is stored locally on the user's machine (e.g., in `AppData/Roaming/...`).

---

## 4. Technical Design

### 4.1 Database Schema (Conceptual)
**Table: `blocks`**
- `id` (UUID, Primary Key)
- `type` (String: 'demo', 'clock', etc.)
- `x` (Integer)
- `y` (Integer)
- `w` (Integer)
- `h` (Integer)
- `z_index` (Integer)
- `data` (JSON string for block-specific configs)

### 4.2 Zustand Middleware
Implement a custom persistence middleware or hook in `workspaceStore.ts` that listens for state changes.
- Use `tauri-plugin-sql-api` to execute async `INSERT/UPDATE/DELETE` operations.
- Ensure loading state is handled so the UI doesn't render empty blocks before the DB is queried.
