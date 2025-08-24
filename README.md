# To‑Do + SUSD Calendar (Vanilla JS, No Deps)

A self‑contained web app that combines a **taggable to‑do list** with a **district calendar**. Built with **vanilla JavaScript**, pure CSS, and `localStorage` for persistence — no frameworks or external dependencies.

> This README summarizes the architecture and features of `ToDoCalendar_v1.html` and includes Mermaid diagrams that render on GitHub.

---

## Quick Start

1. Open `ToDoCalendar_v1.html` in any modern browser.
2. Add tasks on the left; navigate the SUSD calendar on the right.
3. Your data persists in `localStorage`. Use **Advanced → Export JSON** for backups, and **Import** to merge or replace.

---

## Features

- **Task management:** add, tag, write notes, complete, delete; group by tag. fileciteturn1file11L3-L16
- **Completed filters:** this week, month, year, or custom date range. fileciteturn1file11L35-L45 fileciteturn1file13L1-L8
- **Calendar:** month grid with tooltips and colored event dots (first day, last day, early release, no school). fileciteturn1file7L18-L25 fileciteturn1file7L38-L38
- **SUSD events preloaded for 2025–2026.** fileciteturn1file9L10-L21
- **Import/Export/Reset:** JSON export, conflict‑aware import (merge/replace, keep/overwrite), full reset with confirm. fileciteturn1file12L1-L8 fileciteturn1file12L10-L21
- **Persistent UI:** dark mode toggle and resizable split‑pane saved in `localStorage`. fileciteturn1file6L31-L37 fileciteturn1file16L1-L9
- **Responsive layout:** stacks to one column on small screens. fileciteturn1file3L27-L31

---

## Architecture Overview

### Rendering & State Flow

- `state` holds `{ tasks, tags }`; `ui` holds view settings (filters, month/year, dark, panel width). fileciteturn1file6L14-L25
- `setState(mut)` persists to `localStorage` and triggers `render()`. fileciteturn1file6L27-L27
- **Actions** drive all mutations (add/toggle/delete/update/clear tasks, import/export, calendar nav, theme). fileciteturn1file6L29-L37 fileciteturn1file2L1-L7

```mermaid
flowchart TD
  A[User input<br/>clicks/typing] --> B[Actions]
  B -->|mutate| C[setState(mut)]
  C -->|persist| D[localStorage]
  C -->|re-render| E[render()]
  E --> F[UI Components]
  F -->|events| B

  subgraph Actions
    addTask --> toggleTask --> deleteTask --> updateNotes --> clearCompleted
    exportJSON --> importFromObject --> calPrev --> calNext --> calToday --> toggleDark
  end
```
> The `setState` function saves state and triggers `render()`, ensuring a simple one‑way data flow. fileciteturn1file0L1-L9

### Component Tree (Conceptual)

```mermaid
mindmap
  root((App))
    Left Panel
      "New Task Form"
      "Active Tasks"
        "Tag Filter / Group"
        "TaskItem xN"
      "Completed Tasks"
        "Filters (week/month/year/custom)"
        "Tag Filter / Group"
      "Advanced"
        "Export JSON"
        "Import (merge/replace; keep/overwrite)"
        "Reset App"
    Right Panel
      "SUSD Calendar"
        "Month Header & Nav (‹ Today ›)"
        "Grid (7x6)"
        "Event dots + tooltips"
        "Legend"
```
- **TaskItem** shows checkbox, name, tag chip, timestamp, delete, and inline notes. fileciteturn1file11L7-L16 fileciteturn1file11L17-L33
- **Completed filtering** adjusts the completed list at render time. fileciteturn1file10L3-L12
- **Calendar panel** computes the month grid, attaches hover tooltips, and shows a legend. fileciteturn1file8L10-L18 fileciteturn1file7L25-L33 fileciteturn1file1L14-L16

---

## Data Model

### Task
```ts
type Task = {
  id: string
  name: string
  tag: string | null
  notes: string
  created_at: number
  completed_at: number | null
  is_completed: 0 | 1
}
```
- Minimal validation is applied on import. fileciteturn1file5L29-L34

### App State
```ts
type AppState = {
  tasks: Task[]
  tags: string[]
}
```
- Stored under `todo_local_state_v1` in `localStorage`. fileciteturn1file5L17-L25 fileciteturn1file5L35-L38

---

## Import / Export

- **Export**: Downloads a timestamped `todo-export-<ISO>.json`. fileciteturn1file0L11-L12
- **Import**:
  - **Merge** (recommended): de‑dupes by `id`, optional overwrite of duplicates. fileciteturn1file12L11-L14
  - **Replace**: confirmation required; fully overwrites current state. fileciteturn1file12L15-L18
  - Merge summary previews approximate changes before proceeding. fileciteturn1file12L1-L3
- **Conflict policy**: `keep` (default) or `overwrite` for duplicates. fileciteturn1file0L12-L12

---

## Calendar

- Monthly grid is computed from the selected year/month; today is outlined. fileciteturn1file7L15-L16
- Events per day are looked up from `SUSD_EVENTS[YYYY-MM]` and rendered as dots; tooltips show labels. fileciteturn1file7L11-L14 fileciteturn1file7L25-L33
- Event legend covers: First Day, Last Day, No School, Early Release, Conf. Early Release. fileciteturn1file7L38-L38

---

## Styling & UX

- Dark‑theme variables and cards, with responsive grid layout. fileciteturn1file3L8-L15 fileciteturn1file3L27-L43
- Calendar cell states: `muted`, `today`, `has-events`, `danger` (no school). fileciteturn1file4L6-L12
- Resizable split‑pane with mouse, touch, and keyboard; width is persisted. fileciteturn1file16L1-L9

---

## Possible Enhancements

- Optional ICS import for external calendars.
- Search across tasks and notes.
- Per‑tag color coding and sorting options.
- Undo/redo stack for edits.
- Accessibility polishing (ARIA on buttons, focus states already present). fileciteturn1file15L27-L30

---

## File Map

- `ToDoCalendar_v1.html` — the entire app (HTML+CSS+JS).
- `README.md` — this document with diagrams and architecture notes.

