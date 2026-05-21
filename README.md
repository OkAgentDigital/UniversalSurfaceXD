# UniversalSurfaceXD (USXD)

> **Local-first desktop editor** — combining task management with professional code editing.
> Repackaged and distributed from the Universui project.

![Version](https://img.shields.io/badge/version-1.6.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Platform](https://img.shields.io/badge/platform-macOS%20%7C%20Windows%20%7C%20Linux-lightgrey)

---

## ✨ Features

- **📝 Document Editor** — Monaco-based code editor with syntax highlighting for 8+ languages
- **📋 Task Board** — Kanban and Table views with drag-and-drop task management
- **🔍 Full-Text Search** — Search across all documents and tasks
- **💻 Integrated Terminal** — xterm.js terminal with shell integration
- **🔗 Git Integration** — Branch, commit, push, pull, and status from within the app
- **🤖 AI Chat** — DeepSeek-powered AI assistant with Chat, GitHub, and Explain modes
- **🔌 MCP Server Management** — Model Context Protocol server integration (GitHub, DeepSeek)
- **🧩 Extension API** — Build and install extensions with panels, icons, and commands
- **🔒 SonicScrewdriver Security** — AES-256-GCM encrypted secrets, API gateway, audit logging
- **📦 Sub-Sonic-Stack** — Modular build system for any platform (full, cloud, embedded, retro, cli, ci)
- **🔄 Autoloop Optimization** — Self-optimizing SQLite query performance

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm 9+

### Installation

```bash
# Clone the repository
git clone https://github.com/OkAgentDigital/UniversalSurfaceXD.git
cd UniversalSurfaceXD

# Install dependencies
npm install

# Build the application
npm run build

# Start in development mode
npm run start:dev

# Start in production mode
npm run start:prod
```

### macOS Launcher

Double-click `USXD.command` to start in development mode, or run from terminal:

```bash
./USXD.command
```

### Shell Wrapper

```bash
./USXD.sh
```

---

## 🏗️ Build for Distribution

```bash
# macOS DMG
npm run build:mac

# Windows NSIS installer
npm run build:win

# Linux AppImage
npm run build:linux
```

---

## 📦 Stacks

UniversalSurfaceXD includes a modular stack system for different use cases:

| Stack | Size | Target | Use Case |
| :--- | :--- | :--- | :--- |
| **full** | 120MB | macOS, Windows, Linux | Complete desktop development |
| **cloud** | 45MB | Linux (amd64, arm64) | Headless AI cloud service |
| **embedded** | 8MB | Linux (armv7l, arm64) | Raspberry Pi, IoT devices |
| **retro** | 35MB | All platforms | Retro gaming console |
| **cli** | 2MB | All platforms | Terminal scripting |
| **ci** | 15MB | Linux (amd64) | CI/CD pipelines |

```bash
npm run stack:list              # List stacks
npm run stack:install full      # Install full stack
npm run stack:build full        # Build full stack
```

---

## 🧩 Architecture

```
UniversalSurfaceXD/
├── src/
│   ├── main/                 # Electron main process
│   │   ├── main.ts           # App entry point
│   │   ├── database.ts       # SQLite database
│   │   ├── aiService.ts      # AI integration
│   │   ├── mcpService.ts     # MCP server manager
│   │   ├── extensionService.ts # Extension API
│   │   ├── sonicScrewdriver.ts # Security gateway
│   │   └── stackManager.ts   # Stack management
│   ├── preload/              # Preload scripts
│   ├── renderer/             # React UI
│   └── shared/               # Shared types & constants
├── stacks/                   # Stack definitions
├── scripts/                  # Build scripts
└── docs/                     # Documentation
```

---

## 📄 License

MIT — OkAgentDigital

---

*Built with ❤️ using Electron + React + Monaco + SQLite*
*Part of the **DevStudio Framework** — Build once, deploy everywhere.*
