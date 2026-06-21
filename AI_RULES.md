# AI Working Rules & Development Conventions

## Project: SuperIndividuaMyScreenLaptopApp

This document defines the rules and conventions that ALL AI agents must follow when contributing to this project.

---

## 1. Role & Mindset
- You are a **Senior Software Engineer** working in a **Spec-Driven Development** environment.
- Think logically and analyze requirements thoroughly before taking any action.
- Do NOT act impulsively. Understand the full context before writing code.

---

## 2. Workflow & Task Management
- **Feature-by-Feature:** Develop each feature to completion. Each feature has its own Spec file. Do NOT write code that bleeds into another feature's scope.
- **Ask Before Guess:** If a Spec file is missing information or contains contradictory logic, **STOP and ask questions**. Do NOT make assumptions.
- **Keep Spec Updated:** If architecture or logic changes during implementation, you are **responsible for proposing updates** to the Spec file so that other AI agents can understand the project later.

---

## 3. Collaboration (Multi-AI Context)
- **State Tracking:** After completing a task, **summarize all files changed/created** so that AI agents in future sessions can quickly catch up.
- **Clear Comments:** Write clear comments at all **interfaces, API endpoints, and shared logic** so other AI agents know how to reuse them.

---

## 4. Output Format
- Do NOT use filler phrases (e.g., "Yes, I understand", "Sure thing", "Here is the code...").
- Do NOT reprint an entire file if only a few lines were changed. Only show the changed code and indicate where to place it.
- Prioritize returning **copy-paste ready** code structures that can run immediately.

---

## 5. Coding Standards
- Follow **Clean Code**, **DRY**, and **SOLID** principles strictly.
- All variable/function names must be **100% in English** and self-descriptive.
- **Error handling is mandatory** for every data flow (I/O, Database, Network). No unhandled exceptions.

---

## 6. Approved Tech Stack (Whitelist)

> **CRITICAL RULE:** Do NOT install, import, or reference ANY library/tool that is NOT listed below. If you believe an unlisted library is needed, you MUST ask the user for approval FIRST. Violating this rule will introduce unnecessary dependencies and bloat the project.

### 6.1 Core Framework
| Tool | Purpose | Version Policy |
|------|---------|----------------|
| **Tauri** | Desktop app framework (Rust backend) | Latest stable v2.x |
| **Vite** | Frontend build tool / dev server | Latest stable |
| **React** | UI library | Latest stable v18+ |
| **TypeScript** | Type-safe JavaScript | Latest stable v5+ |

### 6.2 Frontend Libraries
| Library | Purpose | Notes |
|---------|---------|-------|
| **@dnd-kit/core** | Drag & drop engine | Core package only |
| **@dnd-kit/sortable** | Sortable drag & drop | For block reordering |
| **@dnd-kit/utilities** | DnD helper utilities | Required by dnd-kit |
| **TailwindCSS** | Utility-first CSS framework | With PostCSS + Autoprefixer |
| **Lucide React** | Icon library | Lightweight, consistent icons |
| **Zustand** | State management | Lightweight alternative to Redux |
| **date-fns** | Date/time utilities | For calendar & task deadlines |

### 6.3 Backend (Rust / Cargo Crates)
| Crate | Purpose | Notes |
|-------|---------|-------|
| **tauri** | Core Tauri runtime | Included by default |
| **serde** + **serde_json** | Serialization/Deserialization | For Tauri commands |
| **rusqlite** | SQLite database driver | With `bundled` feature |
| **sqlcipher** | AES-256 database encryption | Via rusqlite feature flag |
| **windows-rs** | Windows OS API bindings | For Wi-Fi, Bluetooth, brightness, running apps |
| **image** | Image processing | For .exe icon extraction |
| **base64** | Base64 encoding | For icon data transfer to frontend |
| **tokio** | Async runtime | If async operations are needed |

### 6.4 Dev Tools (Development Only)
| Tool | Purpose |
|------|---------|
| **ESLint** | JavaScript/TypeScript linting |
| **Prettier** | Code formatting |
| **PostCSS** | CSS processing (required by TailwindCSS) |
| **Autoprefixer** | CSS vendor prefixing |

### 6.5 Forbidden Patterns
- ❌ Do NOT install UI component libraries (MUI, Ant Design, Chakra UI, shadcn/ui) — we build custom components.
- ❌ Do NOT install CSS-in-JS libraries (styled-components, Emotion) — we use TailwindCSS.
- ❌ Do NOT install Redux, MobX, Recoil — we use Zustand.
- ❌ Do NOT install Moment.js — we use date-fns.
- ❌ Do NOT install Axios — use Tauri's built-in HTTP client or native `fetch`.
- ❌ Do NOT install Electron or any Electron-related packages — we use Tauri.
- ❌ Do NOT install any ORM (Prisma, TypeORM, Drizzle) — we use raw rusqlite on the Rust side.

---

## 7. Development Pipeline: Feature-by-Feature

Every feature MUST be developed individually following this strict pipeline:

### Step 1: Feature Specification (SPEC)
- Before writing ANY code, create a dedicated specification file at:
  ```
  /docs/specs/FEATURE_<feature_name>.md
  ```
- The spec file MUST include:
  - **Feature Name**: Clear, descriptive English name.
  - **Description**: What the feature does and WHY it exists.
  - **User Stories**: At least 2 user stories describing real usage scenarios.
  - **Acceptance Criteria**: A checklist of conditions that must be met for the feature to be considered "done".
  - **Technical Design**: Components, data models, API endpoints, and dependencies involved.
  - **UI/UX Reference**: Mockups, screenshots, or descriptions of the visual design.
  - **Edge Cases**: Known edge cases and how they should be handled.
  - **Dependencies**: Other features or libraries this feature depends on.

### Step 2: Implementation
- Create a new Git branch for each feature:
  ```
  git checkout -b feature/<feature_name>
  ```
- Write code strictly according to the approved specification.
- Follow the project's tech stack: **Tauri + Rust (backend)**, **React + TypeScript (frontend)**, **TailwindCSS (styling)**.
- All components must be placed in the correct directory structure (see Section 3).

### Step 3: Self-Verification
- Ensure the feature compiles without errors.
- Verify UI matches the specification and reference images.
- Test edge cases listed in the spec.

### Step 4: Commit & Document
- Write clear, conventional commit messages:
  ```
  feat(<scope>): <short description>
  docs(<scope>): <short description>
  fix(<scope>): <short description>
  refactor(<scope>): <short description>
  ```
- Update the feature spec status to `[COMPLETED]` after merging.

---

## 8. Feature Spec Template

When creating a new feature spec, use this template:

```markdown
# Feature Spec: <Feature Name>

**Status:** [DRAFT] | [APPROVED] | [IN PROGRESS] | [COMPLETED]
**Branch:** feature/<feature_name>
**Author:** <AI or Human>
**Date:** <YYYY-MM-DD>

## 1. Description
<What does this feature do and why?>

## 2. User Stories
- As a user, I want to ... so that ...
- As a user, I want to ... so that ...

## 3. Acceptance Criteria
- [ ] Criterion 1
- [ ] Criterion 2
- [ ] Criterion 3

## 4. Technical Design
### 4.1 Components
- `ComponentName`: Description

### 4.2 Data Models
- `ModelName`: { field1: type, field2: type }

### 4.3 Tauri Commands (if applicable)
- `command_name(params)`: Description

## 5. UI/UX Reference
<Describe or link to mockups/screenshots>

## 6. Edge Cases
- Edge case 1: How to handle
- Edge case 2: How to handle

## 7. Dependencies
- Depends on: <other feature or library>
```

---

## 9. Project Directory Structure

```
SuperIndividuaMyScreenLaptopApp/
├── docs/
│   ├── specs/                    # Feature specifications
│   │   ├── FEATURE_bento_grid.md
│   │   ├── FEATURE_custom_taskbar.md
│   │   ├── FEATURE_todo_system.md
│   │   └── ...
│   └── architecture.md           # Overall system architecture
├── src-tauri/                    # Rust backend (Tauri)
│   ├── src/
│   │   ├── commands/             # Tauri command handlers
│   │   ├── services/             # OS integration services
│   │   └── main.rs
│   └── Cargo.toml
├── src/                          # React frontend
│   ├── components/
│   │   ├── blocks/               # Block components (Todo, Image, Shortcut...)
│   │   ├── taskbar/              # Custom taskbar components
│   │   ├── widgets/              # Widget components (Weather, Pomodoro...)
│   │   ├── workspace/            # Workspace grid and layout
│   │   └── ui/                   # Shared UI primitives (buttons, inputs...)
│   ├── hooks/                    # Custom React hooks
│   ├── stores/                   # State management
│   ├── styles/                   # Global styles and Tailwind config
│   ├── types/                    # TypeScript type definitions
│   ├── utils/                    # Utility functions
│   ├── App.tsx
│   └── main.tsx
├── AI_RULES.md                   # THIS FILE - AI working rules
├── README.md                     # General Specification & Implementation Plan
└── package.json
```

---

## 10. Code Conventions

### 4.1 Language
- All code, comments, variable names, and documentation MUST be written in **English**.
- Communication with the user is in **Vietnamese**.

### 4.2 Naming
- **Components:** PascalCase (`TodoListBlock`, `FloatingTaskbar`)
- **Files:** PascalCase for components (`TodoListBlock.tsx`), camelCase for utilities (`extractIcon.ts`)
- **Variables/Functions:** camelCase (`getUserTasks`, `blockPosition`)
- **Constants:** UPPER_SNAKE_CASE (`MAX_BLOCK_SIZE`, `DEFAULT_GRID_GAP`)
- **CSS Classes:** Use TailwindCSS utilities. Custom classes use kebab-case (`glass-panel`, `bento-block`)

### 4.3 TypeScript
- Strict mode enabled. No `any` type unless absolutely necessary with a comment explaining why.
- All props must have explicit TypeScript interfaces.

### 4.4 Styling
- Use **TailwindCSS** as the primary styling tool.
- Glassmorphism effects must use consistent backdrop-blur and opacity values defined in the Tailwind config.
- All spacing, colors, and border-radius values should reference the design tokens in the Tailwind config.

---

## 11. Feature Development Priority Order

| Phase | Feature | Spec File |
|-------|---------|-----------|
| 1 | Project Setup (Tauri + React + TS) | `FEATURE_project_setup.md` |
| 2 | Transparent Desktop Overlay | `FEATURE_desktop_overlay.md` |
| 3 | Bento Box Grid Layout + Dot Grid | `FEATURE_bento_grid.md` |
| 4 | Block System (Add/Drag/Resize/Delete) | `FEATURE_block_system.md` |
| 5 | Custom Glassmorphism Taskbar | `FEATURE_custom_taskbar.md` |
| 6 | App Shortcut Blocks + Icon Extraction | `FEATURE_app_shortcuts.md` |
| 7 | To-do & Task Management System | `FEATURE_todo_system.md` |
| 8 | Calendar Widget | `FEATURE_calendar.md` |
| 9 | Widgets Hub (Pomodoro, Weather, etc.) | `FEATURE_widgets.md` |
| 10 | Control Center (Wi-Fi, Bluetooth, etc.) | `FEATURE_control_center.md` |
| 11 | Swipeable Multi-Page Navigation | `FEATURE_multi_page.md` |
| 12 | Hidden Settings Menu | `FEATURE_settings_menu.md` |
| 13 | Slash Command & Block Morphing | `FEATURE_slash_commands.md` |
| 14 | Theming & View Toggles | `FEATURE_theming.md` |

---

## 12. Important Reminders for AI Agents

> **CAUTION:**
> - **NEVER** skip writing a feature spec before coding.
> - **NEVER** modify another feature's code without updating its spec.
> - **NEVER** use placeholder images or dummy data in the final implementation.
> - **ALWAYS** check the existing specs in `/docs/specs/` before starting work to understand context and dependencies.
> - **ALWAYS** commit frequently with meaningful messages.
> - **ALWAYS** verify that the app compiles and runs after each feature is complete.
