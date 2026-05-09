# Sub-Sonic-Stack: Modular Universui Distribution System

> **Part of DevStudio Framework** — Build Universui for any platform, any size, any use case.

---

## 📋 Overview

Sub-Sonic-Stack is a **modular build and distribution system** for Universui that allows you to deploy the platform on everything from a Raspberry Pi (8MB) to a full desktop workstation (120MB) to a cloud server (45MB).

### Core Concept

Instead of one monolithic binary, Universui is composed of **stackable components** that can be assembled into **purpose-built stacks** for different use cases.

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
        ┌─────────────────────┼─────────────────────┐
        ▼                     ▼                     ▼
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

The complete Universui experience with all features:
- Full Workbench UI with Activity Bar, Side Bar, Custom Title Bar
- SonicScrewdriver security (vault, proxy, containers, audit)
- MCP servers (GitHub, DeepSeek)
- Extension API with panels/icons/commands
- Self-optimization via Autoloop

```bash
universui stack install full
universui stack build full ./dist
universui --stack full start
```

### 2. Cloud Server (`stacks/cloud.yaml`)
**Size:** 45MB | **Target:** Linux (amd64, arm64)

Headless Universui for cloud deployment:
- No GUI components
- Auto-scaling MCP containers
- Cloud KMS integration
- Prometheus metrics endpoint
- JSON structured logging to CloudWatch

```bash
universui stack install cloud
universui stack build cloud ./dist
universui --stack cloud start --service
```

### 3. Embedded / IoT (`stacks/embedded.yaml`)
**Size:** 8MB | **Target:** Linux (armv7l, arm64)

Minimal Universui for Raspberry Pi Zero and IoT:
- Core only + minimal runtime
- No GUI, no vault, no agents
- Watchdog health monitoring
- Read-only root filesystem
- UPX compressed binary

```bash
universui stack install embedded
universui stack build embedded ./dist
universui --stack embedded start
```

### 4. Retro Gaming (`stacks/retro.yaml`)
**Size:** 35MB | **Target:** macOS, Windows, Linux (x64, arm64)

Universui configured for retro gaming with CHASIS:
- CRT shaders and scanline overlays
- RetroArch, DOSBox, FS-UAE, PPSSP containers
- Game library browser
- Performance-optimized skin engine

```bash
universui stack install retro
universui stack build retro ./dist
universui --stack retro start --fullscreen
```

### 5. CLI / Terminal (`stacks/cli.yaml`)
**Size:** 2MB | **Target:** macOS, Windows, Linux (x64, arm64, armv7l)

Minimal CLI-only Universui for scripting:
- Single binary, statically linked
- No GUI, no persistence
- Perfect for CI/CD scripts and automation

```bash
universui stack install cli
universui stack build cli ./dist
universui --stack cli --help
```

### 6. CI/CD Pipeline (`stacks/ci.yaml`)
**Size:** 15MB | **Target:** Linux (amd64)

Universui for GitHub Actions:
- GitHub MCP agent for PR automation
- Environment variable secrets
- Ephemeral (no persistence)
- Docker container runtime

```bash
universui stack install ci
universui stack build ci ./dist
universui --stack ci start
```

---

## 🛠️ Usage

### CLI Commands

```bash
# List available and installed stacks
universui stack list

# Install a stack (downloads components)
universui stack install full

# Build a stack into a distributable binary
universui stack build full ./dist

# Run an installed stack
universui stack run full

# Run with --stack flag
universui --stack full start
universui --stack cloud start --service
universui --stack embedded start

# Remove a stack
universui stack remove full

# Validate a stack definition
universui stack validate stacks/ci.yaml

# Create a new stack interactively
universui stack create
```

### Programmatic API

```typescript
import { StackManager } from './src/main/stackManager';

const manager = new StackManager();

// Load a stack definition
const stack = await manager.loadStackDefinition('stacks/full.yaml');

// Validate it
const validation = await manager.validateStack(stack);

// Install components
await manager.installStack(stack);

// Build binary
const result = await manager.buildStack(stack, './dist');

// Run it
await manager.runStack('full');
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

### Component Registry

Components are published as npm packages to:
- **Public npm** (for open-source components)
- **GitHub Packages** (for proprietary components)

The Stack Manager checks both registries when validating and installing.

### Build Process

1. **Validate** — Check component compatibility and existence
2. **Install** — Download components via npm
3. **Build** — Run component build scripts
4. **Assemble** — Combine into final binary
5. **Measure** — Verify size against target

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

## 🔧 Custom Stack Creation

Create your own stack definition:

```bash
universui stack create
```

Or write a YAML file manually:

```yaml
name: my-custom-stack
version: 1.0.0
description: My custom Universui build
author: Me

components:
  - name: core
    source: "@universui/core"
    version: ^1.3.0
    required: true

  - name: sonic-run
    source: "@universui/sonic-run"
    version: ^1.0.0
    config:
      container_runtime: docker
      mcp_servers:
        - github

excluded_components:
  - workbench-ui
  - sonic-chasis
  - sonic-agent

build:
  output: my-universui
  target_os: [linux]
  target_arch: [amd64]
  static_linking: true

runtime:
  min_memory_mb: 128
  recommended_memory_mb: 512
  no_gui: true

max_size_mb: 25
```

---

## 📈 Roadmap

| Version | Feature | Status |
| :--- | :--- | :--- |
| v1.3.0 | Stack definitions + Manager | ✅ Complete |
| v1.4.0 | Component registry API | 🔜 Next |
| v1.5.0 | ARM64 embedded builds | 🔜 Next |
| v1.6.0 | Docker-based stack building | 📋 Planned |
| v2.0.0 | GUI stack configurator | 📋 Planned |

---

## 📄 License

MIT — DevStudio / Universui

---

*"Build once, deploy everywhere."*
