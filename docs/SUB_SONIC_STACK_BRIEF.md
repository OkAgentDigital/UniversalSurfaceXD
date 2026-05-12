# Sub-Sonic-Stack: Modular UniversalSurfaceXD Distribution System

> **Part of DevStudio Framework** — Build UniversalSurfaceXD for any platform, any size, any use case.

---

## 📋 Overview

Sub-Sonic-Stack is a **modular build and distribution system** for UniversalSurfaceXD that allows you to deploy the platform on everything from a Raspberry Pi (8MB) to a full desktop workstation (120MB) to a cloud server (45MB).

### Core Concept

Instead of one monolithic binary, UniversalSurfaceXD is composed of **stackable components** that can be assembled into **purpose-built stacks** for different use cases.

```
┌─────────────────────────────────────────────────────────────┐
│                    DevStudio Framework                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  Core    │  │  Vault   │  │   Run    │  │  Agent   │   │
│  │ (always) │  │(secrets) │  │(MCP/ctr) │  │  (AI)    │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
│                                                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  Chasis  │  │  Logs    │  │  Health  │  │  Update  │   │
│  │  (UI)    │  │(audit)   │  │(metrics) │  │(auto)    │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
                              │
         ┌────────────────────┼────────────────────┐
         ▼                    ▼                    ▼
┌───────────────┐    ┌───────────────┐    ┌───────────────┐
│  Full Stack   │    │  Cloud Stack  │    │ Embedded Stack│
│  (120MB)      │    │  (45MB)       │    │  (8MB)        │
└───────────────┘    └───────────────┘    └───────────────┘
```

---

## 🧩 Components

| Component | Package | Description | Size |
| :--- | :--- | :--- | :--- |
| **core** | `@universui/core` | Electron main + preload + IPC | 15MB |
| **workbench-ui** | `@universui/workbench` | Activity Bar, Side Bar, Title Bar | 25MB |
| **sonic-vault** | `@universui/sonic-vault` | AES-256-GCM encrypted secrets | 5MB |
| **sonic-run** | `@universui/sonic-run` | MCP Manager + container runtime | 20MB |
| **sonic-agent** | `@universui/sonic-agent` | DeepSeek + GitHub MCP agents | 30MB |
| **sonic-chasis** | `@universui/chasis` | Skin/lens engine, themes, overlays | 15MB |
| **sonic-logs** | `@universui/logs` | Audit logging, structured output | 5MB |
| **sonic-health** | `@universui/health` | Health checks, Prometheus metrics | 5MB |
| **sonic-update** | `@universui/update` | Auto-updater (future) | 5MB |

---

## 📦 Available Stacks

### 1. Full Desktop (`stacks/full.yaml`)
**Size:** 120MB | **Target:** macOS, Windows, Linux (x64, arm64)

The complete UniversalSurfaceXD experience with all features:
- Full Workbench UI with Activity Bar, Side Bar, Custom Title Bar
- SonicScrewdriver security (vault, proxy, containers, audit)
- MCP servers (GitHub, DeepSeek)
- Extension API with panels/icons/commands
- Self-optimization via Autoloop
- **USX surface rendering** — Load and preview `.surface.json` and `.surface.yaml` layouts

### 2. Cloud Server (`stacks/cloud.yaml`)
**Size:** 45MB | **Target:** Linux (amd64, arm64)

Headless UniversalSurfaceXD for cloud deployment:
- No GUI components
- Auto-scaling MCP containers
- Cloud KMS integration
- Prometheus metrics endpoint
- JSON structured logging to CloudWatch
- **USX headless processing** — Render surfaces to terminal output via uCode1 grid renderer

### 3. Embedded / IoT (`stacks/embedded.yaml`)
**Size:** 8MB | **Target:** Linux (armv7l, arm64)

Minimal UniversalSurfaceXD for Raspberry Pi Zero and IoT:
- Core only + minimal runtime
- No GUI, no vault, no agents
- Watchdog health monitoring
- Read-only root filesystem
- UPX compressed binary

### 4. Retro Gaming (`stacks/retro.yaml`)
**Size:** 35MB | **Target:** macOS, Windows, Linux (x64, arm64)

UniversalSurfaceXD configured for retro gaming with CHASIS:
- CRT shaders and scanline overlays
- RetroArch, DOSBox, FS-UAE, PPSSP containers
- Game library browser
- Performance-optimized skin engine
- **USX surface layouts** — Retro-themed surface profiles for game launchers

### 5. CLI / Terminal (`stacks/cli.yaml`)
**Size:** 2MB | **Target:** macOS, Windows, Linux (x64, arm64, armv7l)

Minimal CLI-only UniversalSurfaceXD for scripting:
- Single binary, statically linked
- No GUI, no persistence
- Perfect for CI/CD scripts and automation
- **USX terminal rendering** — Render surfaces as ASCII art via uCode1 grid renderer

### 6. CI/CD Pipeline (`stacks/ci.yaml`)
**Size:** 15MB | **Target:** Linux (amd64)

UniversalSurfaceXD for GitHub Actions:
- GitHub MCP agent for PR automation
- Environment variable secrets
- Ephemeral (no persistence)
- Docker container runtime

---

## 🛠️ Usage

### CLI Commands

```bash
# List available and installed stacks
npm run stack list

# Install a stack (downloads components)
npm run stack install full

# Build a stack into a distributable binary
npm run stack build full ./dist

# Run an installed stack
npm run stack run full

# Remove a stack
npm run stack remove full

# Validate a stack definition
npm run stack validate stacks/ci.yaml

# Create a new stack interactively
npm run stack create
```

---

## 🏗️ Architecture

### Stack Definition (YAML)

Each stack is defined by a YAML file that specifies:
- **Components** to include (with versions and config)
- **Excluded components** (to reduce size)
- **Build configuration** (target OS/arch, signing, compression)
- **Runtime configuration** (memory, GUI, persistence)
- **Size targets** (max and actual)

### Build Process

1. **Validate** — Check component compatibility and existence
2. **Install** — Download components via npm
3. **Build** — Run component build scripts
4. **Assemble** — Combine into final binary
5. **Measure** — Verify size against target

### USX Integration

Stacks that include the **chasis** component also support USX surface rendering. The USX pipeline (uCode1 Python core) processes surface documents through:

1. **USX Parser** — Parses JSON/YAML surface documents into grid layouts
2. **Grid Renderer** — Renders grids to terminal/ASCII output
3. **Liquid Engine** — Processes Liquid template variables for dynamic content

This allows stacks to render surface layouts even in headless or terminal-only modes.

---

## 🎯 Use Cases

| Use Case | Recommended Stack | Size |
| :--- | :--- | :--- |
| Daily development | Full | 120MB |
| Cloud AI service | Cloud | 45MB |
| Raspberry Pi sensor hub | Embedded | 8MB |
| Retro gaming console | Retro | 35MB |
| CI/CD automation | CI | 15MB |
| Terminal scripts | CLI | 2MB |
| Custom build | Custom | Variable |

---

## 📄 License

MIT — OkAgentDigital / UniversalSurfaceXD

---

*"Build once, deploy everywhere."*
