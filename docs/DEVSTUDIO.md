# DevStudio Framework

> **The Universal Development Framework** — Build, deploy, and run Universui anywhere.

---

## 📋 Overview

DevStudio is the overarching framework that unifies **Universui** (the desktop app), **SonicScrewdriver** (the API gateway & security layer), and **Sub-Sonic-Stack** (the modular build system) into a cohesive ecosystem.

```
┌─────────────────────────────────────────────────────────────┐
│                    DevStudio Framework                       │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                   Universui                         │   │
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
| **Desktop** | Universui | Electron + React + Monaco + SQLite |
| **Security** | SonicScrewdriver | AES-256 secrets, proxy, containers, audit |
| **Build** | Sub-Sonic-Stack | Modular stack definitions, component registry |

### Component Map

```
DevStudio/
├── universui/                    # Desktop application
│   ├── src/
│   │   ├── main/                 # Electron main process
│   │   │   ├── main.ts           # App entry point
│   │   │   ├── stackManager.ts   # Stack management
│   │   │   ├── sonicScrewdriver.ts # Security gateway
│   │   │   ├── mcpService.ts     # MCP server manager
│   │   │   ├── extensionService.ts # Extension API
│   │   │   ├── aiService.ts      # AI integration
│   │   │   ├── database.ts       # SQLite database
│   │   │   └── ipcHandlers.ts    # IPC communication
│   │   ├── preload/              # Preload scripts
│   │   ├── renderer/             # React UI
│   │   └── shared/               # Shared types
│   ├── stacks/                   # Stack definitions
│   ├── scripts/                  # Build scripts
│   └── docs/                     # Documentation
├── sonic-screwdriver/            # API gateway (submodule)
└── packages/                     # npm packages
    ├── core/
    ├── extension-api/
    ├── mcp-client/
    └── stack-registry/
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
git clone https://github.com/OkAgentDigital/Universui.git
cd Universui

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

### Stack Commands

```bash
# Using npm scripts
npm run stack:list              # List stacks
npm run stack:install full      # Install full stack
npm run stack:build full        # Build full stack
npm run stack:run full          # Run full stack
npm run stack:remove full       # Remove full stack
npm run stack:validate          # Validate a stack
npm run stack:create            # Create new stack

# Using the build script
bash scripts/build-stack.sh stacks/full.yaml ./dist
bash scripts/build-stack.sh stacks/cloud.yaml
bash scripts/build-stack.sh stacks/embedded.yaml ./dist/embedded

# Build all stacks at once
npm run build:stack:all
```

---

## 🔒 SonicScrewdriver Security

SonicScrewdriver provides enterprise-grade security for Universui:

| Feature | Implementation |
| :--- | :--- |
| **Secret Storage** | AES-256-GCM encryption, machine-specific keys |
| **API Gateway** | Rate limiting, request validation, proxy |
| **Container Runtime** | Isolated MCP server execution |
| **Audit Logging** | All operations logged with timestamps |
| **Health Checks** | Prometheus metrics, watchdog monitoring |

### Configuration

```typescript
import { SonicScrewdriver } from './src/main/sonicScrewdriver';

const sonic = new SonicScrewdriver({
  vaultPath: '~/.local/share/universui/vault/',
  encryption: 'aes-256-gcm',
  auditLog: true,
  rateLimits: {
    deepseek: '60 req/min',
    github: '5000 req/hr'
  }
});

// Store a secret
await sonic.storeSecret('github-token', 'ghp_xxxx');

// Retrieve a secret
const token = await sonic.getSecret('github-token');
```

---

## 🤖 MCP Server Management

Universui manages MCP (Model Context Protocol) servers for AI integration:

```bash
# MCP servers are configured per stack
# Full stack includes: GitHub + DeepSeek
# Cloud stack includes: GitHub + DeepSeek (auto-scaling)
# CI stack includes: GitHub only
```

### Available MCP Servers

| Server | Purpose | Container |
| :--- | :--- | :--- |
| **GitHub** | Repository management, PRs, issues | `ghcr.io/universui/mcp-github` |
| **DeepSeek** | AI code generation, chat | `ghcr.io/universui/mcp-deepseek` |

---

## 🔌 Extension API

Build extensions for Universui:

```typescript
// extension-example.ts
import { ExtensionAPI } from '@universui/extension-api';

export function activate(context: ExtensionAPI) {
  // Register a panel
  const panel = context.panels.create('My Panel', 'my-panel');
  
  // Register a command
  context.commands.register('my-extension.hello', () => {
    console.log('Hello from my extension!');
  });
  
  // Register an icon in the activity bar
  context.icons.register('my-icon', {
    iconPath: './icon.svg',
    onClick: () => panel.show()
  });
}
```

---

## 🧠 Autoloop Self-Optimization

Universui includes Autoloop for automatic SQLite query optimization:

```bash
# The optimization program
programs/optimize-sqlite-queries.md

# Run Autoloop
git clone https://github.com/githubnext/autoloop tools/autoloop
./tools/autoloop/autoloop run programs/optimize-sqlite-queries.md

# Monitor progress
tail -f programs/optimize-sqlite-queries.md/progress.md
```

Expected outcome: 2-10x faster SQLite queries, automatically discovered and merged.

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

### Docker Images

```bash
# Build Universui image
docker build -t ghcr.io/universui/universui:latest .

# Build MCP server images
docker build -t ghcr.io/universui/mcp-github:latest -f Dockerfile.mcp-github .
docker build -t ghcr.io/universui/mcp-deepseek:latest -f Dockerfile.mcp-deepseek .

# Push to registry
docker push ghcr.io/universui/universui:latest
docker push ghcr.io/universui/mcp-github:latest
```

### npm Packages

```bash
# Publish core packages
npm config set registry https://npm.pkg.github.com/
npm config set //npm.pkg.github.com/:_authToken $GITHUB_TOKEN
npm publish packages/core
npm publish packages/extension-api
npm publish packages/mcp-client
npm publish packages/stack-registry
```

### Linux Repositories

```bash
# Create APT repository
mkdir -p dist/apt && cp dist/*.deb dist/apt/
dpkg-scanpackages dist/apt /dev/null | gzip -9c > dist/apt/Packages.gz

# Deploy to GitHub Pages
git checkout gh-pages
cp -r dist/apt/* .
git add . && git commit -m "Update APT repo"
git push origin gh-pages
```

---

## 🧪 Development

### VS Code Workspace

Open `DevStudio.code-workspace` in VS Code for:
- Pre-configured tasks (build stacks, validate, run)
- Debug configurations for Stack Manager
- Recommended extensions
- YAML schema validation for stack files

### Available Tasks

| Task | Command | Description |
| :--- | :--- | :--- |
| Build Full Stack | `npm run build:stack:full` | Build full desktop stack |
| Build Cloud Stack | `npm run build:stack:cloud` | Build cloud server stack |
| Build Embedded | `npm run build:stack:embedded` | Build embedded stack |
| Build All Stacks | `npm run build:stack:all` | Build all stack definitions |
| Validate Stacks | `npm run stack:validate` | Validate all YAML definitions |
| List Stacks | `npm run stack:list` | Show installed/available stacks |

### Debugging

```bash
# Debug Stack Manager
npx ts-node src/main/stackManager.ts list

# Debug with Node inspector
node --inspect -r ts-node/register src/main/stackManager.ts list
```

---

## 📚 Documentation Index

| Document | Description |
| :--- | :--- |
| `docs/SUB_SONIC_STACK_BRIEF.md` | Stack system architecture and usage |
| `docs/DEVSTUDIO.md` | This document - framework overview |
| `dev/ROADMAP.md` | Development roadmap |
| `programs/optimize-sqlite-queries.md` | Autoloop optimization program |

---

## 📄 License

MIT — DevStudio / Universui

---

*"Build once, deploy everywhere."*
