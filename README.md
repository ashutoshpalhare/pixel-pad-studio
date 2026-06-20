# Pixel Pad — Notepad++ Clone (Web Edition)

A full-featured, web-based code editor inspired by **Notepad++** and **VS Code**. Built with React, TypeScript, Monaco Editor, and Tailwind CSS. Runs entirely in the browser with local session persistence.

![Pixel Pad Screenshot](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)
![Monaco Editor](https://img.shields.io/badge/Monaco_Editor-%E2%9C%94-lightgrey)

---

## Features

### Core Editing
- **Multi-Tab Editor** — unlimited tabs with instant switching
- **Syntax Highlighting** — powered by Monaco Editor for 10+ languages (HTML, CSS, JS, TS, JSON, Markdown, Python, SQL, XML, and more)
- **Language Auto-Detection** — detects language from file extension automatically
- **Find & Replace** — built-in Monaco search with regex support
- **Go to Line** (`Ctrl+G`) — jump to any line instantly
- **Line Operations** — duplicate, delete, move, and toggle comment on lines

### Tab Management
- Create, rename, and close tabs
- Unsaved changes indicator (dot / asterisk)
- Drag & drop files to open
- Recent files history (last 15 files)

### File Operations
- **New File** (`Ctrl+N`)
- **Open File** (`Ctrl+O`) — `.txt`, `.html`, `.css`, `.js`, `.jsx`, `.ts`, `.tsx`, `.json`, `.md`, `.py`, `.sql`, `.xml`, `.svg`
- **Save** (`Ctrl+S`) — marks tab as saved
- **Save As / Download** (`Ctrl+Shift+S`) — download as any filename

### Live Preview
- **HTML Preview** — renders HTML in a sandboxed iframe
- **Markdown Preview** — live-rendered Markdown with GitHub-style styling
- Toggle preview pane on/off

### Split Editor
- Enable side-by-side split view for comparing or referencing
- Both panes stay synchronized with the same tab content

### Command Palette
- Quick access to all commands via `Ctrl+Shift+P`
- Fuzzy search through actions

### Customizable UI
- **Three Themes**: Light, Dark, VS Code (custom "notepad-vscode")
- **Font Size** zoom controls
- **Word Wrap** toggle
- **Minimap** toggle
- **Status Bar** toggle
- **Sidebar** toggle (Explorer, Recent Files, File Info)

### Session Persistence
- Auto-saves session to LocalStorage every 5 seconds
- Restores tabs, active tab, settings, and recent files on reload

### Keyboard Shortcuts
| Shortcut | Action |
|----------|--------|
| `Ctrl+N` | New File |
| `Ctrl+O` | Open File |
| `Ctrl+S` | Save |
| `Ctrl+Shift+S` | Save As / Download |
| `Ctrl+F` | Find |
| `Ctrl+H` | Replace |
| `Ctrl+G` | Go to Line |
| `Ctrl+Shift+P` | Command Palette |
| `Ctrl+A` | Select All |
| `Ctrl+Z` / `Ctrl+Y` | Undo / Redo |
| `Ctrl+=` / `Ctrl+-` | Zoom In / Out |

---

## Tech Stack

| Technology | Purpose |
|------------|---------|
| [React 19](https://react.dev) | UI framework |
| [TypeScript](https://www.typescriptlang.org) | Type safety |
| [TanStack Start](https://tanstack.com/start) | Full-stack React framework |
| [TanStack Router](https://tanstack.com/router) | File-based routing |
| [Monaco Editor](https://microsoft.github.io/monaco-editor/) | Code editor engine (same as VS Code) |
| [Tailwind CSS v4](https://tailwindcss.com) | Utility-first styling |
| [Radix UI](https://www.radix-ui.com) | Accessible UI primitives |
| [Lucide React](https://lucide.dev) | Icon set |
| [shadcn/ui](https://ui.shadcn.com) | Component patterns |

---

## Project Structure

```
src/
├── components/
│   ├── notepad/
│   │   ├── CommandPalette.tsx      # Ctrl+Shift+P quick command search
│   │   ├── MonacoPane.tsx          # Monaco Editor wrapper
│   │   ├── NotepadApp.tsx          # Main orchestrator component
│   │   ├── PreviewPane.tsx         # HTML / Markdown live preview
│   │   ├── PromptDialog.tsx        # Rename / Save As / Go To Line dialogs
│   │   ├── SettingsPanel.tsx       # Theme & editor settings
│   │   ├── Sidebar.tsx             # Explorer, Recent, File Info
│   │   ├── StatusBar.tsx           # Cursor position, file stats
│   │   ├── TabBar.tsx              # Multi-tab navigation
│   │   └── Toolbar.tsx             # Top action bar
│   └── ui/                         # shadcn/ui components
├── hooks/
│   └── useNotepadStore.ts          # Global state + LocalStorage persistence
├── lib/
│   └── notepad/
│       ├── languages.ts            # Language definitions & detection
│       └── types.ts                # TypeScript types
├── routes/
│   └── index.tsx                   # Home route (editor)
└── styles.css                      # Tailwind theme + custom tokens
```

---

## Getting Started

### Prerequisites
- [Bun](https://bun.sh) (or Node.js + npm)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/pixel-pad.git
cd pixel-pad

# Install dependencies
bun install

# Start the development server
bun dev
```

The app will be available at `http://localhost:8080`.

### Build for Production

```bash
bun run build
```

Output is generated in `dist/`.

---

## Architecture Decisions

1. **Client-Side Only** — The editor runs entirely in the browser. No backend is required for core functionality; session persistence uses LocalStorage.

2. **Monaco Editor over CodeMirror** — Monaco provides VS Code-grade IntelliSense, error highlighting, and theming out of the box.

3. **Custom Store over Redux/Zustand** — `useNotepadStore` is a lightweight hook-based state manager with built-in LocalStorage sync, avoiding unnecessary dependencies.

4. **File-Based Routing** — TanStack Start's file-based routing keeps the project structure predictable and type-safe.

---

## Browser Support

- Chrome / Edge (recommended)
- Firefox
- Safari 14+

Requires modern ES2020+ and WebAssembly support (for Monaco Editor).

---

## Roadmap

- [ ] Search across all open tabs
- [ ] Multi-cursor editing shortcuts
- [ ] Custom keybindings editor
- [ ] Plugin / extension system
- [ ] Git diff view
- [ ] Cloud sync (optional backend)

---

## License

[MIT](LICENSE) — feel free to fork, modify, and distribute.

---

## Acknowledgements

- [Notepad++](https://notepad-plus-plus.org) — the original inspiration
- [VS Code](https://code.visualstudio.com) — UI/UX inspiration and Monaco Editor
- [Monaco Editor](https://microsoft.github.io/monaco-editor/) — the engine powering the editor
