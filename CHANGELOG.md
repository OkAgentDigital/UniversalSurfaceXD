# Changelog

## v1.6.0 — Material3 Design System (2026-05-21)

### 🎨 Material3 Design System

Applied the full Material3 design system with Material Symbols Rounded icons across the entire USXD app.

### What's New
- **Material3 Design Tokens** — Comprehensive M3 token system (color, shape, typography, elevation, motion, spacing)
- **Material Symbols Rounded** — Replaced Codicons with 700+ Material Symbols icon mappings
- **M3 Shape System** — Consistent border-radius tokens (xs, sm, md, lg, xl, full, dialog, button, nav, card)
- **M3 Elevation** — Shadow levels 0-5 with proper M3 shadow values
- **M3 Motion** — Duration and easing tokens for smooth animations
- **M3 Typography** — Full type scale (display, headline, title, body, label) with weight/line-height
- **Flowbite Theme Bridge** — Updated to reference M3 shape tokens
- **Backward Compatible** — All existing USX CSS variables mapped to M3 tokens

### Changed
- `Icon.tsx` — Complete rewrite from Codicons to Material Symbols Rounded with 700+ mappings
- `m3-tokens.css` — New comprehensive M3 design token file
- `universui.css` — Added M3 backward compatibility layer
- `chat.css` — M3 tokens for colors, spacing, typography, motion
- `overlay/*.css` — All overlay styles updated to M3 tokens
- `ui-components.css` — M3 shape tokens for buttons, inputs, cards
- `FlowbiteTheme.tsx` — M3 shape token references
- `index.html` — Material Symbols Rounded CDN stylesheet
- `Button.tsx` — M3 shape tokens, Material Symbols icons
- `AppearancePanel.tsx` — Material Symbols icons

### Technical
- Zero TypeScript compilation errors
- Icon component accepts both string and numeric sizes
- Added `title` prop support to Icon component
- Removed duplicate icon map entries (300+ lines cleaned up)

## v1.5.0 — Mono Color Scheme & ChatGPT Chat (2026-05-15)

### What's New
- **Mono Color Scheme** — Unified mono palette across all components
- **ChatGPT-style Chat Panel** — Redesigned OK Chat with centered composer, message bubbles, typing indicator
- **Consistent Icon Sizing** — Standardized 24px icons across activity bar, title bar, status bar
- **Font Pack Integration** — USX Font Pack with 10+ retro and modern fonts
- **App Rename** — Renamed to "Surface" for product name

### Changed
- Flowbite React migration with mono theme
- USX Story Form with variable handles, JSON storage, overlay system
- 60px activity bar, 56px title bar, 28px status bar
- Centered search layout

## v1.4.0 — UniversalSurfaceXD (2026-05-10)

### 🎉 Initial Release as UniversalSurfaceXD

Repackaged from Universui v1.3.0+ into a standalone publishable Electron app.

### What's New
- **Rebranded** to UniversalSurfaceXD (USXD)
- **MIT License** for open distribution
- **Updated launchers**: USXD.command and USXD.sh
- **GitHub Releases** publishing pipeline
- **electron-builder** configured for macOS, Windows, Linux

### Features (inherited from Universui)
- 3-Column Layout with custom title bar
- DeepSeek AI Integration (Chat, Explain, GitHub modes)
- GitHub MCP Server Bridge
- SonicScrewdriver Security (AES-256-GCM secrets, API gateway, audit)
- Sub-Sonic-Stack modular build system (6 stacks)
- Extension API with panels, icons, commands
- Task Board with Kanban and Table views
- Monaco-based code editor
- Integrated terminal (xterm.js)
- Git integration
- Full-text search
- Autoloop SQLite optimization
