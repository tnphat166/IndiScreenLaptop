# Feature Spec: Block System & Interactive Workspace (Phase 2)

**Status:** [DRAFT]
**Branch:** feature/block_system
**Author:** AI
**Date:** 2026-06-22

---

## 1. Description

This feature establishes the core Block System for SuperIndividuaMyScreenLaptopApp. It introduces the ability to dynamically manage blocks (widgets) on the workspace grid, including dragging and custom resizing using React 19.

**Why:** In Phase 1, we established a static dot-grid and placeholder demo blocks. Phase 2 brings the grid to life by allowing users to add, move, and freely resize blocks. After evaluating the complexity of writing a custom 8-direction resize hook, we elected to retain React 18 and use `react-rnd`, disabling `React.StrictMode` to bypass known `findDOMNode` incompatibilities. This significantly accelerates development while providing a robust drag-and-resize experience.

**Scope includes:**
- Custom Resize hook (`useResize`) using native pointer events.
- Seamless integration with `@dnd-kit` for drag-and-drop.
- Centralized `workspaceStore` (Zustand) for block state management.
- Standardized Block Data Model.
- In-memory data storage (persistence is deferred to Phase 3).

**Scope excludes:**
- SQLite database / File System persistence.
- Complex collision resolution (blocks can overlap for now).
- Specialized widgets content (e.g., actual clock, monitor logic).

---

## 2. User Stories

- **US-01:** As a user, I want to be able to drag the edges or corners of a block to resize it, so that I can customize the layout of my workspace.
- **US-02:** As a user, I want blocks to automatically snap to the 16x16px grid when I finish dragging or resizing them, ensuring a neat and aligned layout.
- **US-03:** As a developer, I want a standardized `BlockData` interface and a `BlockContainer` component, so that I can easily create new widget types in future phases without rewriting drag/resize logic.
- **US-04:** As a developer, I want all block states managed in a single Zustand store, making it easy to serialize and persist data in Phase 3.

---

## 3. Acceptance Criteria

### 3.1 Custom Resizing (`useResize`)
- [ ] Blocks have visible or invisible handles on edges and corners (8 directions: n, s, e, w, ne, nw, se, sw).
- [ ] Dragging a handle updates the width and/or height of the block.
- [ ] Minimum block size is constrained (e.g., 2x2 grid cells = 32x32px).
- [ ] Resizing strictly follows the 16px grid step, preventing sub-pixel sizes.

### 3.2 Drag & Drop Integration
- [ ] Blocks can be moved by dragging their header/body.
- [ ] Custom `useResize` does not conflict with `@dnd-kit` dragging.
- [ ] Blocks snap to the 16px grid upon drop.

### 3.3 State Management
- [ ] A Zustand store (`workspaceStore`) manages an array of `BlockData`.
- [ ] Actions exist to `addBlock`, `removeBlock`, `updateBlockPosition`, and `updateBlockSize`.
- [ ] State updates cause the UI to re-render smoothly.
- [ ] State is held in-memory (resets on app restart).

---

## 4. Technical Design

### 4.1 Block Data Model (`src/types/block.ts`)
```typescript
export type BlockType = 'demo' | 'clock' | 'system_monitor' | 'shortcut';

export interface BlockData {
  id: string;
  type: BlockType;
  x: number;          // X coordinate (in pixels, multiple of 16)
  y: number;          // Y coordinate (in pixels, multiple of 16)
  w: number;          // Width (in pixels, multiple of 16)
  h: number;          // Height (in pixels, multiple of 16)
  data?: any;         // Custom configuration for specific block types
}
```

### 4.2 Workspace Store (`src/stores/workspaceStore.ts`)
```typescript
interface WorkspaceState {
  blocks: BlockData[];
  addBlock: (block: Omit<BlockData, 'id'>) => void;
  updatePosition: (id: string, x: number, y: number) => void;
  updateSize: (id: string, w: number, h: number) => void;
  removeBlock: (id: string) => void;
}
```

### 4.3 Custom Resize Logic (`useResize` hook)
Due to React 19 constraints, we will use native DOM `pointerdown`, `pointermove`, and `pointerup` events attached to resize handles.
1. When a handle is grabbed, record the initial mouse position and block dimensions.
2. On `pointermove`, calculate the delta `dx` and `dy`.
3. Apply `Math.round(value / 16) * 16` to ensure the delta snaps to the 16px grid.
4. Update the local state for smooth UI feedback during drag, and flush to `workspaceStore` on `pointerup`.

### 4.4 Component Hierarchy
- `WorkspaceGrid`: Subscribes to `workspaceStore`, loops through `blocks`, and renders `BlockContainer`s.
- `BlockContainer`: A wrapper that handles absolute positioning (`left: x, top: y, width: w, height: h`). Contains the `@dnd-kit` Draggable hook and the custom `useResize` handles.
- `BlockRenderer`: Inside `BlockContainer`, a switch statement that renders the specific widget component (e.g., `DemoBlock`) based on `BlockData.type`.

---

## 5. Edge Cases & Handling

| # | Edge Case | Handling |
|---|-----------|----------|
| 1 | Resizing too small | Constrain `w` and `h` to a minimum size (e.g., 64px) in the `useResize` logic. |
| 2 | Resizing off-screen | Clamp dimensions so the block's right/bottom edge does not exceed the window's `innerWidth` / `innerHeight`. |
| 3 | Conflicting drag/resize | Ensure event propagation is stopped (`e.stopPropagation()`) on resize handles so `@dnd-kit` does not trigger a move action while resizing. |

---

## 6. Verification Plan

1. **Snap accuracy:** Measure the DOM element dimensions and positions using DevTools to ensure they are always exactly divisible by 16.
2. **Performance:** Ensure no lag or high CPU usage occurs while dragging or resizing multiple blocks.
3. **Zustand State:** Use React/Zustand DevTools to observe that `updatePosition` and `updateSize` are correctly mutating the state.
