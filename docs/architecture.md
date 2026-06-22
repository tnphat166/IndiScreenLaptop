# System Architecture: SuperIndividuaMyScreenLaptopApp

> This document provides the high-level architectural overview of the project.  
> For detailed feature specifications, see [docs/specs/](./specs/).

## 1. Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    Windows Desktop                       │
│  ┌───────────────────────────────────────────────────┐  │
│  │         Tauri Transparent Overlay Window           │  │
│  │  ┌─────────────────────────────────────────────┐  │  │
│  │  │            React Frontend (UI)               │  │  │
│  │  │  ┌──────────┐ ┌──────────┐ ┌─────────────┐ │  │  │
│  │  │  │Workspace │ │ Widgets  │ │  Control    │ │  │  │
│  │  │  │  Grid    │ │  Hub     │ │  Center     │ │  │  │
│  │  │  └──────────┘ └──────────┘ └─────────────┘ │  │  │
│  │  │  ┌──────────────────────────────────────────┐│  │  │
│  │  │  │       Floating Glass Taskbar             ││  │  │
│  │  │  └──────────────────────────────────────────┘│  │  │
│  │  └─────────────────────────────────────────────┘  │  │
│  │                    ▲ Tauri IPC                     │  │
│  │  ┌─────────────────────────────────────────────┐  │  │
│  │  │            Rust Backend (Core)               │  │  │
│  │  │  ┌──────────┐ ┌──────────┐ ┌─────────────┐ │  │  │
│  │  │  │ Commands │ │ Services │ │  Database   │ │  │  │
│  │  │  │ Handler  │ │ (OS API) │ │  (SQLite)   │ │  │  │
│  │  │  └──────────┘ └──────────┘ └─────────────┘ │  │  │
│  │  └─────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

## 2. Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Framework** | Tauri v2 + Rust | Desktop app framework, native OS integration |
| **Frontend** | React 18+ + TypeScript | UI rendering |
| **Build Tool** | Vite | Fast dev server & bundling |
| **Styling** | TailwindCSS | Utility-first CSS, glassmorphism design |
| **Drag & Drop** | @dnd-kit | Block reordering & placement |
| **State** | Zustand | Lightweight state management |
| **Icons** | Lucide React | Consistent icon library |
| **Dates** | date-fns | Date/time utilities |
| **Database** | SQLite + SQLCipher | Encrypted local storage |
| **OS APIs** | windows-rs | Wi-Fi, Bluetooth, brightness, running apps |

## 3. Data Flow

```
User Interaction
       │
       ▼
React Component ──(state)──► Zustand Store
       │                          │
       ▼                          ▼
Tauri IPC invoke()          Re-render UI
       │
       ▼
Rust Command Handler
       │
       ├──► SQLite (CRUD operations)
       ├──► OS API (system controls)
       └──► File System (icon extraction, shortcuts)
```

## 4. Key Design Decisions

- **Local-first:** All data stored locally with SQLCipher encryption (AES-256).
- **Click-through overlay:** Empty areas pass mouse events to Windows desktop.
- **Bento Box grid:** Flexible dot-grid system for block placement.
- **Glassmorphism UI:** Consistent frosted-glass aesthetic across all floating elements.
- **Feature isolation:** Each feature developed independently with its own spec file.

## 5. Performance Targets

| Metric | Target |
|--------|--------|
| RAM usage | < 100MB |
| Startup time | < 2 seconds |
| UI frame rate | 60 FPS |
| Database encryption | AES-256 (transparent) |
