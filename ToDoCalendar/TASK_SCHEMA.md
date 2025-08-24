# Task Data JSON Schema

This app supports **import/export** of tasks in JSON format.

The exported file has the following structure:

```json
{
  "tasks": [
    {
      "id": "123456789-1703456000000",
      "name": "Example Task",
      "tag": "home",
      "notes": "optional notes",
      "created_at": 1703456000000,
      "completed_at": null,
      "is_completed": 0
    }
  ],
  "tags": ["home"]
}
```

---

## Schema Definition

```ts
type Task = {
  id: string;              // unique ID
  name: string;            // required task name
  tag: string | null;      // optional tag
  notes: string;           // optional notes
  created_at: number;      // epoch ms timestamp
  completed_at: number | null; // epoch ms timestamp if completed
  is_completed: 0 | 1;     // completion flag
}

type AppState = {
  tasks: Task[];
  tags: string[];
}
```

---

## Import Behavior

- **Merge** (default): new tasks are added, duplicate IDs either kept (default) or overwritten.
- **Replace**: wipes all existing tasks and tags, replacing them with imported data.
- **Conflict Policy**: `keep` or `overwrite` (when duplicates are found).

---

## Notes

- Files are validated on import; malformed files are rejected.
- Timestamps are stored in **milliseconds since epoch (UTC)**.
- Export filenames include ISO timestamps, e.g.:  
  `todo-export-2025-08-23T14-15-30-123Z.json`.
