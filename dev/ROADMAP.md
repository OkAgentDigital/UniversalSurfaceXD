# Universui Roadmap

> **Universui** — A local-first desktop editor where tasks meet documents.
> Built with Electron + React + Monaco + SQLite.

---

## 🏆 v1.2.0 — Current Release (Complete)

A fully functional local-first desktop IDE with:

- ✅ Professional VS Code-inspired Workbench layout
- ✅ Full SQLite persistence with 4 tables (tasks, documents, views, sync_metadata)
- ✅ Monaco editor with 8 languages + auto-save
- ✅ TaskBoard with Kanban + Table views
- ✅ **5 production-grade panels** (Search, Source Control, Terminal, Settings, Property)
- ✅ Git integration (branch, status, commit, push/pull)
- ✅ Integrated terminal (child_process spawn)
- ✅ Dark theme with VS Code color tokens
- ✅ Codicons throughout

### The Evolution

| Version | Key Additions | Panels | Lines of Code (est.) |
| :--- | :--- | :--- | :--- |
| v1.0.0 | Core editor + SQLite | 2 | ~800 |
| v1.1.0 | Workbench layout + FileExplorer | 4 | ~1,500 |
| v1.2.0 | 5 new functional panels | **9 total** | ~3,000+ |

---

## 🎯 What Universui Is

A **local-first, cross-platform alternative** to:

| Tool | Universui Equivalent |
| :--- | :--- |
| **Notion** | TaskBoard + Property Panel + Kanban views |
| **VS Code** | Workbench layout + Monaco + Terminal + Git |
| **Obsidian** | Local SQLite + markdown editing + file explorer |
| **Trello** | Kanban drag-drop task management |

---

## 🚀 v1.3.0 — "Rock Solid" Polish Release

Before adding more features, focus on making Universui **ready to share**.

### Performance
- [ ] Virtual scrolling in FileExplorer (for 1000+ tasks)
- [ ] Lazy-load Monaco editor (reduce startup time)
- [ ] Debounce SQLite writes (batch auto-saves)

### Reliability
- [ ] Error boundaries around each panel
- [ ] Crash recovery (auto-save unsaved documents)
- [ ] Graceful handling of SQLite lock/errors

### UX
- [ ] Keyboard shortcuts (Ctrl+F for search, Ctrl+` for terminal, Ctrl+S to save)
- [ ] Command Palette (Ctrl+P / Cmd+P)
- [ ] Onboarding tour for first-time users
- [ ] Toast notifications for save/error states

### Testing
- [ ] Unit tests for IPC handlers + SQLite operations
- [ ] Component tests for TaskBoard and DocumentEditor
- [ ] Integration test: Create task → open editor → edit → save → verify SQLite

### Documentation
- [ ] README with screenshots + setup guide
- [ ] CONTRIBUTING.md for open-source contributors
- [ ] CHANGELOG.md

### Build & Distribution
- [ ] Test .exe (Windows) binary
- [ ] Test .dmg (macOS) binary
- [ ] Test .AppImage (Linux) binary
- [ ] Auto-updater via electron-updater
- [ ] GitHub Release with built binaries

---

## 🧭 Future Directions

### Path A: Deepen the Editor Experience
| Feature | Description |
| :--- | :--- |
| **Multiple Tabs** | Open several documents, tabbed interface |
| **Split Editor** | View two files side-by-side |
| **Command Palette** | Ctrl+P to run commands (VS Code style) |
| **Extensions API** | Allow users to add their own panels |
| **File Watcher** | Auto-refresh explorer on external changes |

### Path B: Enhance Collaboration (local-first sync)
| Feature | Description |
| :--- | :--- |
| **iCloud Drive sync** | Sync SQLite file via iCloud |
| **GitHub sync** | Push/pull documents as markdown files |
| **Real-time presence** | Who else is editing (future) |
| **Comments/Annotations** | Task-level discussions |

### Path C: Add Power User Features
| Feature | Description |
| :--- | :--- |
| **Snippets** | Reusable text/code blocks |
| **Tasks from Markdown** | Parse `- [ ]` checklist items |
| **Templates** | Document templates for projects |
| **Export/Import** | JSON, Markdown, HTML |
| **Keyboard shortcuts** | Fully configurable |

### Path D: Polish & Distribution
| Feature | Description |
| :--- | :--- |
| **Auto-updater** | electron-updater for seamless updates |
| **Analytics (opt-in)** | Usage metrics (if you want) |
| **Onboarding tour** | First-run experience |
| **Website / Docs** | universui.com with screenshots |
| **Homebrew / Chocolatey** | Package managers |

---

## 📦 Share the Project

When ready for public release:

1. **Add a proper README** with screenshots and demo GIF
2. **Create a GitHub Release** with built binaries
3. **Post on**:
   - r/electronjs
   - r/reactjs
   - Hacker News (Show HN)
   - Product Hunt (when ready)

---

## 📊 Version History

| Version | Date | Highlights |
| :--- | :--- | :--- |
| v1.0.0 | May 2026 | Core editor + SQLite + TaskBoard |
| v1.1.0 | May 2026 | VS Code Workbench layout + FileExplorer |
| v1.2.0 | May 2026 | Search, Source Control, Terminal, Settings, Property panels |
| v1.3.0 | TBD | Polish, performance, testing, distribution |

---

*Built with ❤️ using Electron + React + Monaco + SQLite*
