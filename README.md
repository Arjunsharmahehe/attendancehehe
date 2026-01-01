# Attendance Tracker TUI

A personal attendance tracking terminal user interface built with [Bun](https://bun.sh) and [OpenTUI](https://github.com/sst/opentui). Log your daily attendance, manage subjects, create timetables, and track your attendance statistics right from the terminal.

## Screenshots

### Dashboard View
![Dashboard View](public/dashboard.png)

| Subjects Management | Settings (Timetable Configuration) |
|---|---|
| ![Subjects View](public/subjects.png) | ![Settings View](public/settings.png) |

## Features

- **Subject Management** - Add, edit, and remove subjects with names and codes
- **Weekly Timetable** - Configure 8 class slots for each weekday (Monday-Friday)
- **Daily Attendance Logging** - Mark attendance as Present (P), Absent (A), or Teacher Absent (T)
- **Statistics Dashboard** - View overall and per-subject attendance percentages
- **Smart Buffer Calculation** - See how many classes you can safely miss while maintaining 75% attendance
- **Persistent Storage** - All data saved automatically to `~/.attendancehehe/`
- **Keyboard-First Navigation** - Fully keyboard accessible with intuitive shortcuts

## Prerequisites

- [Bun](https://bun.sh) runtime (version 1.0 or later)
- Terminal with true color support (most modern terminals)

## Installation

### From Source

```bash
# Clone the repository
git clone git@github.com:Arjunsharmahehe/attendancehehe.git
cd attendancehehe

# Install dependencies
bun install

# Run in development mode
bun run dev
```

### Run Directly

```bash
bun run src/index.tsx
```

## Project Structure

```
attendance-tracker/
├── src/
│   ├── index.tsx              # Entry point
│   ├── app.tsx                # Main app with view navigation
│   ├── context/
│   │   └── app-context.tsx    # Global state & data management
│   ├── components/
│   │   ├── daily-schedule.tsx     # Daily schedule display
│   │   ├── daily-schedule-row.tsx # Individual slot row
│   │   ├── overall-stats.tsx      # Statistics panel
│   │   ├── schedule-cell.tsx      # Timetable cell
│   │   ├── schedule-row.tsx       # Timetable day row
│   │   ├── subject-row.tsx        # Subject list item
│   │   └── new-subject-row.tsx    # New subject input
│   └── pages/
│       ├── dashboard.tsx      # Main dashboard (attendance logging)
│       ├── subjects.tsx       # Subject management page
│       └── settings.tsx       # Timetable configuration page
├── package.json
├── tsconfig.json
└── README.md
```

## Usage

### Navigation

| Key | Action |
|-----|--------|
| `Tab` | Switch between views (Dashboard → Subjects → Settings → Dashboard) |
| `q` | Quit application |

### Dashboard View

The main dashboard shows today's schedule and allows you to log attendance.

| Key | Action |
|-----|--------|
| `←` / `→` | Navigate to previous/next day |
| `↑` / `↓` | Select class slot |
| `p` | Mark as Present |
| `a` | Mark as Absent |
| `t` | Mark as Teacher Absent |

### Subjects View

Manage your subjects list.

| Key | Action |
|-----|--------|
| `↑` / `↓` | Navigate through subjects |
| `←` / `→` | Switch between Name and Code columns |
| `Space` | Start editing selected subject |
| `Enter` | Save changes |
| `d` | Delete selected subject |
| `Esc` | Cancel editing |

### Settings View (Timetable)

Configure your weekly class schedule (8 slots per day).

| Key | Action |
|-----|--------|
| `↑` / `↓` | Navigate days |
| `←` / `→` | Navigate slots |
| `Space` | Start editing cell |
| `a` / `d` | Cycle through available subjects |
| `s` | Save and exit edit mode |
| `Ctrl+r` | Reset entire schedule |

## Data Storage

All data is stored in `~/.attendancehehe/` directory:

- `subjects.json` - List of subjects
- `schedule.json` - Weekly timetable configuration
- `master.csv` - Attendance records (date,slot,subjectId,status)

## Statistics Explained

The application calculates two key metrics for attendance tracking:

- **Buffer**: Number of classes you can safely miss while maintaining 75% attendance threshold
- **Lag**: Number of additional classes you need to attend to reach 75% if currently below

These calculations help you understand:
- If you're above 75%, the buffer shows how many classes you can skip
- If you're below 75%, the lag shows how many more classes you must attend to recover

## Tech Stack

- **Runtime**: [Bun](https://bun.sh) - Fast JavaScript runtime
- **TUI Framework**: [OpenTUI](https://github.com/sst/opentui) - React renderer for terminal UIs
- **UI Library**: React 19
- **Language**: TypeScript

## License

MIT License - feel free to use and modify for your needs.

## Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.
