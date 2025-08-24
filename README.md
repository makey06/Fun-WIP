# To-Do + SUSD Calendar

A comprehensive task management application with an integrated Scottsdale Unified School District (SUSD) calendar viewer. This is a standalone HTML application that requires no external dependencies and stores data locally in your browser.

## Features

### Task Management
- **Add Tasks**: Create tasks with optional tags and notes
- **Task Organization**: 
  - Filter tasks by tags or show all
  - Group tasks by tags for better organization
  - Separate views for active and completed tasks
- **Task Details**: Each task includes timestamps for creation and completion
- **Notes**: Add detailed notes to any task with inline editing
- **Smart Filtering**: Filter completed tasks by time periods (week, month, year, or custom range)

### SUSD School Calendar Integration
- **Academic Year 2025-2026**: Pre-loaded with official SUSD dates
- **Event Types**:
  - 🟢 First/Last day of school
  - 🔴 No school days
  - 🟣 Early release days
  - 🩷 Conference early release days
- **Interactive Calendar**: 
  - Navigate between months
  - Hover over dates to see event details
  - Visual indicators for different event types
  - "Today" highlighting

### Data Management
- **Local Storage**: All data stored in browser's localStorage
- **Import/Export**: 
  - Export tasks as JSON files
  - Import tasks with merge or replace options
  - Conflict resolution for duplicate task IDs
- **Data Persistence**: Automatically saves changes

### User Interface
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Dark Theme**: Optimized for readability with high contrast
- **Resizable Panels**: Drag the splitter to adjust layout on desktop
- **Keyboard Shortcuts**: Enter key to quickly add tasks

## Usage

### Getting Started
1. Open the HTML file in any modern web browser
2. Start adding tasks using the form in the left panel
3. View the SUSD calendar in the right panel

### Adding Tasks
1. Enter task name in the input field
2. Optionally select an existing tag or create a new one
3. Add notes if needed
4. Click "Add Task" or press Enter

### Managing Tasks
- **Complete**: Check the checkbox next to any task
- **Edit Notes**: Click in the notes area and edit inline
- **Delete**: Click the ✕ button on any task
- **Filter**: Use the tag dropdown to filter by specific tags
- **Group**: Enable "Group by tag" to organize tasks by their tags

### Calendar Navigation
- Use ‹ and › buttons to navigate months
- Click "Today" to jump to current month
- Hover over dates with events to see details

### Data Management
1. **Export**: Click "Export JSON" to download your tasks
2. **Import**: Use "Choose File…" in Advanced section
   - **Merge**: Combines with existing tasks (recommended)
   - **Replace**: Completely replaces current data
3. **Reset**: "Reset App" clears all data (requires confirmation)

## Technical Details

### Storage
- Uses browser localStorage with key `todo_local_state_v1`
- UI preferences stored separately
- No server or external dependencies required

### Data Structure
```json
{
  "tasks": [
    {
      "id": "unique-id",
      "name": "Task name",
      "tag": "optional-tag",
      "notes": "Optional notes",
      "created_at": 1234567890,
      "completed_at": null,
      "is_completed": 0
    }
  ],
  "tags": ["tag1", "tag2"]
}
```

### Browser Compatibility
- Modern browsers with ES6+ support
- localStorage support required
- No Internet connection needed after initial load

### File Structure
- Single HTML file with embedded CSS and JavaScript
- No external dependencies or CDN requirements
- Fully self-contained application

## SUSD Calendar Data

The application includes pre-loaded data for the 2025-2026 academic year:
- First day: August 4, 2025
- Last day: May 22, 2026 (Early Release)
- Major breaks: Fall break, Thanksgiving, Winter break, Spring break
- Professional development days and early release schedules

## Customization

### Modifying School Events
To update or change the calendar data, modify the `SUSD_EVENTS` object in the JavaScript section:

```javascript
const SUSD_EVENTS = {
  '2025-08': [
    {type: 'first_day', days: [4]},
    {type: 'early_release', days: [27]}
  ],
  // Add more months as needed
};
```

### Styling
The application uses CSS custom properties (variables) for theming. Modify the `:root` section to customize colors and spacing.

## Privacy & Security
- All data stored locally in your browser
- No data transmitted to external servers
- No user tracking or analytics
- Works completely offline

## Troubleshooting

### Data Not Saving
- Ensure localStorage is enabled in your browser
- Check if you're in private/incognito mode (may limit storage)
- Try exporting data as backup before troubleshooting

### Calendar Not Displaying Correctly
- Ensure JavaScript is enabled
- Try refreshing the page
- Check browser console for any error messages

### Import Issues
- Verify JSON file format matches expected structure
- Use "Merge" mode if unsure about conflicts
- Export current data before importing as backup

## License
This is a standalone application. Modify and use as needed for personal or educational purposes.
