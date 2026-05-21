# UniversalSurfaceXD Roadmap

> **UniversalSurfaceXD (USXD)** — A local-first desktop editor where tasks meet documents.
> Built with Electron + React + Monaco + SQLite.
> Part of the **DevStudio Framework**.

---

## 🏆 v1.6.0 — Current Release (Complete)

### 🎨 Material3 Design System

Applied the full Material3 design system with Material Symbols Rounded icons across the entire USXD app.

- ✅ **Material3 Design Tokens** — Comprehensive M3 token system (color, shape, typography, elevation, motion, spacing)
- ✅ **Material Symbols Rounded** — Replaced Codicons with 700+ Material Symbols icon mappings
- ✅ **M3 Shape System** — Consistent border-radius tokens (xs, sm, md, lg, xl, full, dialog, button, nav, card)
- ✅ **M3 Elevation** — Shadow levels 0-5 with proper M3 shadow values
- ✅ **M3 Motion** — Duration and easing tokens for smooth animations
- ✅ **M3 Typography** — Full type scale (display, headline, title, body, label) with weight/line-height
- ✅ **Flowbite Theme Bridge** — Updated to reference M3 shape tokens
- ✅ **Backward Compatible** — All existing USX CSS variables mapped to M3 tokens
- ✅ **Zero TypeScript compilation errors**
- ✅ **Icon component accepts both string and numeric sizes**
- ✅ **Added `title` prop support to Icon component**
- ✅ **Removed duplicate icon map entries (300+ lines cleaned up)**

## 🏆 v1.5.0 — Previous Release (Complete)

- ✅ **Mono Color Scheme** — Unified mono palette across all components
- ✅ **ChatGPT-style Chat Panel** — Redesigned OK Chat with centered composer, message bubbles, typing indicator
- ✅ **Consistent Icon Sizing** — Standardized 24px icons across activity bar, title bar, status bar
- ✅ **Font Pack Integration** — USX Font Pack with 10+ retro and modern fonts
- ✅ **App Rename** — Renamed to "Surface" for product name
- ✅ **Flowbite React migration** with mono theme
- ✅ **USX Story Form** with variable handles, JSON storage, overlay system
- ✅ **60px activity bar, 56px title bar, 28px status bar**
- ✅ **Centered search layout**

## 🏆 v1.4.0 — Initial Release (Complete)

A local-first document hub with AI-powered collaboration and GitHub integration, repackaged as UniversalSurfaceXD.

- ✅ **3-Column Layout** — Left sidebar (Explorer) + Center (Editor) + Right panel (AI Chat)
- ✅ **Custom Title Bar** — VS Code-style chrome with app icon, version, and window controls
- ✅ **Resizable Right Panel** — Draggable divider for AI Chat panel (200-600px)
- ✅ **DeepSeek AI Integration** — Chat, Explain, and GitHub modes via DeepSeek API
- ✅ **GitHub MCP Server Bridge** — Connect to GitHub repos, issues, PRs from within the app
- ✅ **AI Chat Panel** — Three modes: Chat, GitHub, Explain with message history
- ✅ **Activity Bar toggle** — AI Chat toggle in both Activity Bar and Status Bar
- ✅ **Status Bar indicators** — Terminal and AI Chat status indicators
- ✅ **SonicScrewdriver Security** — AES-256-GCM encrypted secrets, API gateway, audit logging
- ✅ **Autoloop Optimization** — Self-optimizing SQLite query program
- ✅ **Sub-Sonic-Stack System** — 6 modular stack definitions (full, cloud, embedded, retro, cli, ci)
- ✅ **Stack Manager** — Install, build, validate, and run modular stacks
- ✅ **DevStudio Framework** — Unified workspace, CLI, and documentation
- ✅ **MIT License** for open distribution
- ✅ **GitHub Releases** publishing pipeline
- ✅ **electron-builder** configured for macOS, Windows, Linux

### The Evolution

| Version | Key Additions | Panels | Lines of Code (est.) |
| :--- | :--- | :--- | :--- |
| v1.0.0 | Core editor + SQLite | 2 | ~800 |
| v1.1.0 | Workbench layout + FileExplorer | 4 | ~1,500 |
| v1.2.0 | 5 new functional panels | **9 total** | ~3,000+ |
| v1.3.0 | 3-column layout + AI + MCP + Custom Chrome | **10 total** | ~4,500+ |
| v1.3.0+ | SonicScrewdriver + Autoloop + Sub-Sonic-Stack | **10 total** | ~6,000+ |
| v1.4.0 | Repackaged as UniversalSurfaceXD (USXD) | **10 total** | ~6,000+ |
| v1.5.0 | Mono color scheme, ChatGPT chat, Font Pack | **10 total** | ~7,000+ |
| v1.6.0 | Material3 Design System, Material Symbols | **10 total** | ~8,000+ |

---

## 🎯 What UniversalSurfaceXD Is

A **local-first, cross-platform alternative** to:

| Tool | USXD Equivalent |
| :--- | :--- |
| **Notion** | TaskBoard + Property Panel + Kanban views |
| **VS Code** | Workbench layout + Monaco + Terminal + Git |
| **Obsidian** | Local SQLite + markdown editing + file explorer |
| **Trello** | Kanban drag-drop task management |
| **1Password** | SonicScrewdriver AES-256 encrypted secrets |
| **Cloudflare** | SonicScrewdriver API gateway + rate limiting |

---

## 🚀 v1.5.0 — "Sub-Sonic-Stack" Release (Planned)

### Stack System (✅ Complete)
- [x] 6 stack YAML definitions (full, cloud, embedded, retro, cli, ci)
- [x] Stack Manager with CLI (install, build, run, validate, create)
- [x] Build script for stack binaries
- [x] Component registry (npm + GitHub Packages)
- [x] DevStudio workspace configuration

### Distribution
- [ ] Build production binaries (macOS, Windows, Linux)
- [ ] Create GitHub Release v1.5.0
- [ ] Publish npm packages to GitHub Packages
- [ ] Build and push Docker images
- [ ] Create Linux package repositories (APT, RPM)

### Documentation
- [x] `docs/SUB_SONIC_STACK_BRIEF.md` — Stack system architecture
- [x] `docs/DEVSTUDIO.md` — Framework overview
- [ ] `docs/INSTALL.md` — Installation guide
- [ ] `docs/EXTENSIONS.md` — Extension development guide
- [ ] `docs/SONIC.md` — SonicScrewdriver security guide

### Example Extensions
- [ ] `@universalsurfacexd/extension-github` — GitHub panel + MCP + Sonic secrets
- [ ] `@universalsurfacexd/extension-deepseek` — AI chat + skills + rate limiting
- [ ] `@universalsurfacexd/extension-autoloop` — Self-optimization UI + program runner
- [ ] `@universalsurfacexd/extension-skills` — Markdown skill loader

---

## 🚀 v1.4.0 — "Rock Solid" Polish Release

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

### Path D: Sub-Sonic-Stack Expansion
| Feature | Description |
| :--- | :--- |
| **Component Registry API** | Dynamic component discovery and versioning |
| **ARM64 Embedded Builds** | Raspberry Pi 5 native binaries |
| **Docker-based Stack Building** | Reproducible builds in containers |
| **GUI Stack Configurator** | Visual stack builder UI |
| **Stack Marketplace** | Community-shared stack definitions |

### Path E: Polish & Distribution
| Feature | Description |
| :--- | :--- |
| **Auto-updater** | electron-updater for seamless updates |
| **Analytics (opt-in)** | Usage metrics (if you want) |
| **Onboarding tour** | First-run experience |
| **Website / Docs** | universalsurfacexd.com with screenshots |
| **Homebrew / Chocolatey** | Package managers |

---

## 🚀 v2.0.0 — "Surface Convergence" Release (Planned)

**Goal:** Reunite the three USXD eras — beta surface documents, current Electron app, and OBF style guide — into a single coherent application.

> **Context:** See [`docs/USXD_LEGACY_ASSESSMENT.md`](https://github.com/OkAgentDigital/DevStudio/blob/main/docs/USXD_LEGACY_ASSESSMENT.md) for the full evolutionary analysis of the beta archive, current app, and OBF spec.

### Phase 1: Theme System (v2.0.0-alpha)
- [ ] Add design token system (color, typography, spacing JSON)
- [ ] Implement CSS variable theming
- [ ] Port Classic Modern palette as built-in theme
- [ ] Add theme switcher UI in AppearancePanel
- [ ] Document theme development guide

### Phase 2: Surface Documents (v2.0.0-beta)
- [ ] Integrate surface-document JSON schema from beta archive
- [ ] Add surface import/export (JSON + YAML)
- [ ] Implement grid canon rendering (80×30 viewport, 16×24 cells)
- [ ] Add surface composer panel
- [ ] Validate against `interchange/schemas/surface-document.schema.json`

### Phase 3: OBF Light (v2.0.0)
- [ ] Define lightweight OBF theme bundle format (`.usxd-theme`)
- [ ] Add bundle import/export
- [ ] Publish example themes (Classic Modern, Chunky, Dark)
- [ ] Theme marketplace / gallery

### Phase 4: Marksmith Bridge (v2.1.0)
- [ ] Share theme system with Marksmith
- [ ] Cross-app surface document compatibility
- [ ] Unified design token registry
- [ ] Shared component library

### Surface Examples to Support
| Profile | Source | Description |
|---------|--------|-------------|
| `udos.classic-modern` | Beta archive | Classic Modern desktop wireframe |
| `sonic.console` | Beta archive | Sonic Screwdriver operator console |
| `udos.thinui` | Beta archive | uDOS ThinUI workspace |
| `udos.host` | Beta archive | uDOS host command centre |
| `uhome.thin` | Beta archive | uHOME thin kiosk handoff |
| `usxd.default` | New | Default USXD workspace layout |

### Design Tokens to Port
| Token File | Source | Contents |
|-----------|--------|----------|
| `color.json` | Beta `spine/tokens/` | Color palette |
| `typography.json` | Beta `spine/tokens/` | Font families, sizes, weights |
| `spacing.json` | Beta `spine/tokens/` | 8px-based spacing scale |
| `radius.json` | Beta `spine/tokens/` | Border radius values |
| `classic-modern-inspiration.yaml` | Beta `tokens/` | Classic Modern palette + fonts |

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
| v1.3.0 | May 2026 | 3-column layout, Custom Chrome, DeepSeek AI, GitHub MCP Server |
| v1.3.0+ | May 2026 | SonicScrewdriver, Autoloop, Sub-Sonic-Stack, DevStudio Framework |
| v1.4.0 | May 2026 | Repackaged as UniversalSurfaceXD (USXD) |

---

## 📁 Project Structure

```
UniversalSurfaceXD/
├── src/
│   ├── main/                 # Electron main process
│   │   ├── main.ts           # App entry point
│   │   ├── stackManager.ts   # Stack management
│   │   ├── sonicScrewdriver.ts # Security gateway
│   │   ├── mcpService.ts     # MCP server manager
│   │   ├── extensionService.ts # Extension API
│   │   ├── aiService.ts      # AI integration
│   │   ├── database.ts       # SQLite database
│   │   └── ipcHandlers.ts    # IPC communication
│   ├── preload/              # Preload scripts
│   ├── renderer/             # React UI
│   └── shared/               # Shared types
├── stacks/                   # Stack definitions
├── scripts/                  # Build scripts
└── docs/                     # Documentation
```

---

*Built with ❤️ using Electron + React + Monaco + SQLite*
*Part of the **DevStudio Framework** — Build once, deploy everywhere.*
