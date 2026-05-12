# DevStudio Framework

> **The Universal Development Framework** — Build, deploy, and run UniversalSurfaceXD anywhere.

---

## 📋 Overview

DevStudio is the overarching framework that unifies **UniversalSurfaceXD** (the desktop app), **SonicScrewdriver** (the API gateway & security layer), and **Sub-Sonic-Stack** (the modular build system) into a cohesive ecosystem.

```
┌─────────────────────────────────────────────────────────────┐
│                    DevStudio Framework                       │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              UniversalSurfaceXD (USXD)               │   │
│  │           Local-first Desktop Platform               │   │
│  └─────────────────────────────────────────────────────┘   │
│                              │                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │               SonicScrewdriver                      │   │
│  │        API Gateway + Security Layer                  │   │
│  └─────────────────────────────────────────────────────┘   │
│                              │                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              Sub-Sonic-Stack                        │   │
│  │        Modular Build & Distribution System           │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 🏗️ Architecture

### Three Layers

| Layer | Product | Purpose |
| :--- | :--- | :--- |
| **Framework** | DevStudio | Orchestration, CLI, workspace management |
| **Desktop** | UniversalSurfaceXD | Electron + React + Monaco + SQLite |
| **Security** | SonicScrewdriver | AES-256 secrets, proxy, containers, audit |
| **Build** | Sub-Sonic-Stack | Modular stack definitions, component registry |

### USX Surface Format

UniversalSurfaceXD uses the **USX (Universal Surface eXchange)** format for all surface layouts. USX combines:

- **JSON/YAML schemas** — Portable layout trees describing grid-based UIs
- **Liquid templates** — Dynamic content rendering via the uCode1 Liquid Engine
- **Grid canon** — 80×30 viewport with teletext heritage

The USX pipeline flows through uCode1's Python core (`core_py/usxd/` and `core_py/liquid_engine/`) for parsing, component mapping, and rendering before being displayed in the Electron + React frontend.

See the [Surface Document Specification](./specs/SURFACE_DOCUMENT_SPEC.md) for the full schema reference.

### Component Map

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

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm 9+
- Git
- Electron (installed via devDependencies)

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

### Quick Start with Stacks

```bash
# List available stacks
npm run stack list

# Validate a stack definition
npm run stack validate stacks/full.yaml

# Install a stack (dry run first)
npm run stack:install full

# Build a stack binary
bash scripts/build-stack.sh stacks/full.yaml ./dist
```

---

## 🧩 Components

### Core Components

| Component | Package | Description |
| :--- | :--- | :--- |
| **@universui/core** | `packages/core` | Electron main process, IPC, window management |
| **@universui/workbench** | Built-in | Activity Bar, Side Bar, Custom Title Bar, Command Center |
| **@universui/extension-api** | `packages/extension-api` | Extension registration, panels, icons, commands |

### SonicScrewdriver Components

| Component | Package | Description |
| :--- | :--- | :--- |
| **sonic-vault** | `@universui/sonic-vault` | AES-256-GCM encrypted secret store |
| **sonic-run** | `@universui/sonic-run` | MCP Manager + container runtime |
| **sonic-agent** | `@universui/sonic-agent` | DeepSeek + GitHub MCP agents |
| **sonic-chasis** | `@universui/chasis` | Skin/lens engine, themes, overlays |
| **sonic-logs** | `@universui/logs` | Audit logging, structured output |
| **sonic-health** | `@universui/health` | Health checks, Prometheus metrics |
| **sonic-update** | `@universui/update` | Auto-updater (future) |

---

## 📦 Available Stacks

| Stack | Size | Target | Use Case |
| :--- | :--- | :--- | :--- |
| **full** | 120MB | macOS, Windows, Linux | Complete desktop development |
| **cloud** | 45MB | Linux (amd64, arm64) | Headless AI cloud service |
| **embedded** | 8MB | Linux (armv7l, arm64) | Raspberry Pi, IoT devices |
| **retro** | 35MB | macOS, Windows, Linux | Retro gaming console |
| **cli** | 2MB | All platforms | Terminal scripting |
| **ci** | 15MB | Linux (amd64) | CI/CD pipelines |

---

## 🔒 SonicScrewdriver Security

SonicScrewdriver provides enterprise-grade security for UniversalSurfaceXD:

| Feature | Implementation |
| :--- | :--- |
| **Secret Storage** | AES-256-GCM encryption, machine-specific keys |
| **API Gateway** | Rate limiting, request validation, proxy |
| **Container Runtime** | Isolated MCP server execution |
| **Audit Logging** | All operations logged with timestamps |
| **Health Checks** | Prometheus metrics, watchdog monitoring |

---

## 📦 Distribution

### Build Production Binaries

```bash
# macOS
npm run build:mac

# Windows
npm run build:win

# Linux
npm run build:linux

# All platforms
npm run build:mac && npm run build:win && npm run build:linux
```

---

## 📄 License

MIT — OkAgentDigital / UniversalSurfaceXD

---

*"Build once, deploy everywhere."*
