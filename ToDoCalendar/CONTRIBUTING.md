# Contributing

Thanks for your interest in improving **To‑Do + SUSD Calendar**!

This project is a **single‑file app** (`ToDoCalendar_v1.html`). Contributions can include bug fixes, feature additions, documentation, or design improvements.

---

## Development Setup

1. Clone or fork the repository.
2. Open `ToDoCalendar_v1.html` directly in a browser. No build step or server is required.
3. Edit and test changes locally.

---

## Code Style

- Use **vanilla JS** only — no external dependencies.
- Keep helpers minimal (`h()`, `$`, `$$` are already provided).
- Follow existing patterns for **state mutation via `setState`** and **UI re‑rendering via `render()`**.
- CSS:
  - Prefer CSS variables for colors and spacing.
  - Maintain dark‑theme readability.
- Accessibility:
  - Retain keyboard navigation (e.g., split‑pane resize via arrows).
  - Add ARIA roles and labels where relevant.

---

## Git Workflow

1. Create a branch:  
   ```bash
   git checkout -b feature/my-enhancement
   ```
2. Commit changes with clear messages.
3. Push to your fork and open a Pull Request.

---

## Testing

- Verify both **desktop (wide layout)** and **mobile (stacked layout)** views.
- Ensure state persists across reloads (via `localStorage`).
- Test **import/export/reset** flows thoroughly with sample JSON.

---

## Feature Ideas

Contributors are welcome to tackle enhancements such as:
- Task search/filtering by keyword.
- ICS calendar import.
- Per‑tag color coding.
- Undo/redo for edits.
- Accessibility improvements.

---

## License

By contributing, you agree your code will be released under the repository’s license.
