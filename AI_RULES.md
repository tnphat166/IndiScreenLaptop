# AI Working Rules & Development Conventions

## Project: SuperIndividuaMyScreenLaptopApp

This document defines the rules and conventions that ALL AI agents must follow when contributing to this project.

---

## 1. Development Workflow: Feature-by-Feature

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

## 2. Feature Spec Template

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

## 3. Project Directory Structure

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

## 4. Code Conventions

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

## 5. Feature Development Priority Order

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

## 6. Important Reminders for AI Agents

> **CAUTION:**
> - **NEVER** skip writing a feature spec before coding.
> - **NEVER** modify another feature's code without updating its spec.
> - **NEVER** use placeholder images or dummy data in the final implementation.
> - **ALWAYS** check the existing specs in `/docs/specs/` before starting work to understand context and dependencies.
> - **ALWAYS** commit frequently with meaningful messages.
> - **ALWAYS** verify that the app compiles and runs after each feature is complete.
