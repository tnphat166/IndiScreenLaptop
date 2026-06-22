# Phase 2: Block System & Interactive Workspace (Summary)

## 1. Overview
Phase 2 transformed the static placeholder grid from Phase 1 into a fully interactive workspace. The primary goal was to allow users to add, drag, and resize blocks (widgets) smoothly across a customizable grid, serving as the foundational interaction model for SuperIndividuaMyScreenLaptopApp.

## 2. Key Technology Choices
- **React-Rnd (react-rnd):** Selected for handling both Drag-and-Drop (DnD) and Resizing. It provides out-of-the-box support for 8-direction resizing and grid snapping, significantly reducing custom boilerplate.
- **Zustand (`workspaceStore`):** Used as the central state manager to hold the array of `BlockData` in memory. It provides predictable, decoupled state updates (`updateBlockPosition`, `updateBlockSize`) outside of the React render cycle for maximum performance.
- **React 18 & StrictMode Disabled:** To accommodate `react-rnd`'s reliance on `findDOMNode` (which causes issues in React 19 / StrictMode), we elected to downgrade/retain React 18 and remove `<StrictMode>` from `main.tsx`. This was a necessary tradeoff to achieve robust dragging and resizing quickly.

## 3. Implementation Details

### 3.1 Block Data Model
A standardized `BlockData` interface was introduced in `src/types/index.ts`:
```typescript
export interface BlockData {
  id: string;
  type: BlockType;
  x: number;
  y: number;
  w: number;
  h: number;
  zIndex?: number;
  data?: Record<string, unknown>;
}
```

### 3.2 Zustand Store (`workspaceStore.ts`)
Manages the interactive lifecycle of blocks:
- `addBlock()`
- `removeBlock()`
- `updateBlockPosition()`
- `updateBlockSize()`
- `bringToFront()` (Updates z-index on click so the active block is always on top).

### 3.3 WorkspaceGrid Component
- Iterates over the `blocks` array from the Zustand store.
- Wraps each block in an `<Rnd>` component.
- Configured grid snapping (`dragGrid={[16, 16]}`, `resizeGrid={[16, 16]}`).
- Dynamically renders the correct widget via `BlockRenderer` based on `block.type` (currently only `'demo'` is supported).

## 4. Edge Cases Handled
- **Overlapping/Z-Index:** Blocks clicked by the user automatically receive a higher `zIndex` so they overlap correctly.
- **Minimum Constraints:** Blocks are constrained to a minimum size of 64x64px (`BLOCK_MIN_SIZE`) to prevent them from becoming un-clickable.

## 5. Result
The application now boasts a highly responsive, grid-aligned, free-form drag-and-resize dashboard experience. (Note: Data persistence for these interactions was deferred to and completed in Phase 3).
