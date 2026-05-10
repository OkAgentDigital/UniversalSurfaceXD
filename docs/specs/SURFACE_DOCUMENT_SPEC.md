# Surface Document Specification

> **Version:** 1.0.0  
> **Status:** Draft  
> **Part of:** UniversalSurfaceXD v2.0.0 "Surface Convergence"  
> **Source:** Ported from USXD beta archive (Era 1) interchange schemas

---

## 1. Overview

The Surface Document format is a portable layout tree for describing grid-based UIs. It was originally designed for the USXD beta UX designer composer and is being revived for USXD v2.0.0 as the foundation for themeable, interchangeable surface layouts.

A surface document describes:
- A **viewport** (grid dimensions)
- A **layout tree** (grid or stack containers)
- **Component instances** (catalog references with props)
- **Metadata** (title, description, profile ID)

---

## 2. Grid Canon

All surfaces are rendered on a canonical grid:

| Parameter | Value | Notes |
|-----------|-------|-------|
| Viewport | 80 columns × 30 rows | Classic terminal heritage |
| Cell width | 16px | Aligned with teletext 2×3 pixel blocks |
| Cell height | 24px | 3 × 8px spacing units |
| Aspect ratio | 4:3 | Classic display ratio |
| Total width | 1280px | 80 × 16px |
| Total height | 720px | 30 × 24px |

### Teletext Bridge

The grid canon bridges to teletext rendering (uCode1 compatibility):

```
Teletext block: 2px × 3px
Grid cell:      16px × 24px = 8 teletext blocks wide × 8 teletext blocks tall
Viewport:       80 cols × 30 rows = 640 teletext blocks × 240 teletext blocks
```

---

## 3. JSON Schema

### 3.1 Surface Document

```json
{
  "$schema": "https://universalsurfacexd.app/schemas/surface-document/v1.json",
  "version": "1",
  "meta": {
    "title": "Surface title",
    "description": "Surface description",
    "profileId": "namespace.profile",
    "author": "Author name",
    "created": "ISO 8601 date",
    "updated": "ISO 8601 date",
    "tags": ["tag1", "tag2"]
  },
  "root": {
    "kind": "grid",
    "templateColumns": "repeat(3, 1fr)",
    "gap": "0.75rem",
    "padding": "1rem",
    "minHeight": "100%",
    "cells": [
      {
        "catalogId": "component.id",
        "props": { }
      }
    ]
  }
}
```

### 3.2 Root Kinds

| Kind | Properties | Description |
|------|-----------|-------------|
| `grid` | templateColumns, gap, padding, minHeight, cells[] | CSS grid layout |
| `stack` | direction (vertical/horizontal), gap, instances[] | Flexbox layout |

### 3.3 Grid Kind

```json
{
  "kind": "grid",
  "templateColumns": "repeat(3, 1fr)",
  "gap": "0.75rem",
  "padding": "1rem",
  "minHeight": "100%",
  "cells": [
    { "catalogId": "shell.panel", "props": { "title": "Panel 1" } },
    { "catalogId": "shell.panel", "props": { "title": "Panel 2" } }
  ]
}
```

### 3.4 Stack Kind

```json
{
  "kind": "stack",
  "direction": "vertical",
  "gap": "0.75rem",
  "instances": [
    { "catalogId": "shell.panel", "props": { "kicker": "Section", "title": "Content" } }
  ]
}
```

### 3.5 Instance Reference

Each cell or instance references a component from the catalog:

```json
{
  "catalogId": "shell.panel",
  "props": {
    "kicker": "Section label",
    "title": "Section title",
    "body": "Description text",
    "bullets": ["Item 1", "Item 2"]
  }
}
```

---

## 4. YAML Format

Surfaces can also be defined in YAML for human readability:

```yaml
# surfaces/classic-modern-desktop.surface.yaml
version: "1"
meta:
  title: "Classic Modern — desktop"
  description: "Classic Modern desktop wireframe"
  profileId: udos.classic-modern
  author: "USXD Beta"
  tags: [classic-modern, desktop, wireframe]
root:
  kind: stack
  direction: vertical
  gap: 0.75rem
  instances:
    - catalogId: shell.panel
      props:
        kicker: "Menu bar"
        title: "Apple · File · Edit · View · Special"
    - catalogId: shell.panel
      props:
        kicker: "Content"
        title: "Welcome to Classic Modern"
        body: "A retro-inspired desktop experience"
```

---

## 5. UX Bundle Schema

For importing/exporting Storybook metadata + design tokens between repos:

```json
{
  "$schema": "https://universalsurfacexd.app/schemas/ux-bundle/v1.json",
  "version": "1",
  "meta": {
    "exported": "ISO 8601 date",
    "source": "repo path",
    "description": "Bundle description"
  },
  "stories": [
    { "title": "Component name", "of": "module path" }
  ],
  "tokens": {
    "color": {},
    "typography": {},
    "spacing": {}
  }
}
```

---

## 6. Surface Profiles

Each surface is identified by a unique profile ID following the `namespace.profile` convention:

| Profile | Purpose | Source |
|---------|---------|--------|
| `udos.classic-modern` | Classic Modern desktop wireframe | Beta archive |
| `sonic.console` | Sonic Screwdriver operator console | Beta archive |
| `udos.thinui` | uDOS ThinUI workspace | Beta archive |
| `udos.host` | uDOS host command centre | Beta archive |
| `uhome.thin` | uHOME thin kiosk handoff | Beta archive |
| `usxd.default` | Default USXD workspace layout | New |

---

## 7. File Extensions

| Format | Extension | MIME Type |
|--------|-----------|-----------|
| JSON | `.surface.json` | `application/vnd.usxd.surface+json` |
| YAML | `.surface.yaml` | `application/vnd.usxd.surface+yaml` |
| Bundle | `.uxbundle.json` | `application/vnd.usxd.bundle+json` |

---

## 8. Validation Rules

1. **version** must be `"1"`
2. **root.kind** must be `"grid"` or `"stack"`
3. **meta.profileId** must match `^[a-z0-9]+\.[a-z0-9][a-z0-9.-]*$`
4. Grid cells must have a **catalogId** string
5. Stack instances must have a **catalogId** string
6. All **props** values must be strings, numbers, booleans, or arrays of strings
7. **gap** must be a valid CSS length or `"none"`
8. **templateColumns** must be a valid CSS grid-template-columns value

---

## 9. Example: Full Surface Document

```json
{
  "version": "1",
  "meta": {
    "title": "Sonic Screwdriver Console",
    "description": "Operator console for Sonic Screwdriver",
    "profileId": "sonic.console",
    "author": "Sonic Family",
    "created": "2026-05-10T00:00:00Z",
    "tags": ["sonic", "console", "operator"]
  },
  "root": {
    "kind": "grid",
    "templateColumns": "repeat(2, 1fr)",
    "gap": "1rem",
    "padding": "1rem",
    "cells": [
      {
        "catalogId": "shell.panel",
        "props": {
          "kicker": "Status",
          "title": "System Health",
          "body": "All systems operational",
          "bullets": ["CPU: 23%", "Memory: 1.2GB/8GB", "Uptime: 14d 6h"]
        }
      },
      {
        "catalogId": "shell.panel",
        "props": {
          "kicker": "Actions",
          "title": "Quick Commands",
          "body": "Select an action to execute",
          "bullets": ["Restart Service", "Run Diagnostics", "View Logs"]
        }
      }
    ]
  }
}
```

---

*Part of UniversalSurfaceXD v2.0.0 "Surface Convergence". See [DESIGN_TOKENS_SPEC.md](./DESIGN_TOKENS_SPEC.md) and [OBF_LIGHT_SPEC.md](./OBF_LIGHT_SPEC.md) for related specifications.*
