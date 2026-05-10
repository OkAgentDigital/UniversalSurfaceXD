# OBF Light — Theme Bundle Specification

> **Version:** 1.0.0  
> **Status:** Draft  
> **Part of:** UniversalSurfaceXD v2.0.0 "Surface Convergence"  
> **Source:** Adapted from OBF Style Guide (Era 3) — simplified for app theme distribution

---

## 1. Overview

OBF Light (Object Bundle Format Light) is a simplified theme bundle format for UniversalSurfaceXD. It adapts the original OBF concept from the Sonic Family ecosystem into a lightweight format suitable for distributing themes, design tokens, and surface documents across USXD and Marksmith.

An OBF Light bundle is a `.usxd-theme` file — a ZIP archive containing theme metadata, design tokens, CSS variables, and optional surface documents.

---

## 2. Bundle Format

### 2.1 File Extension

| Format | Extension | MIME Type |
|--------|-----------|-----------|
| OBF Light | `.usxd-theme` | `application/vnd.usxd.theme+zip` |

### 2.2 Internal Structure

```
my-theme.usxd-theme
├── manifest.json              # Bundle metadata (required)
├── tokens/
│   ├── color.json             # Color palette (required)
│   ├── typography.json        # Type scale (optional)
│   ├── spacing.json           # Spacing scale (optional)
│   └── radius.json            # Border radius (optional)
├── theme.css                  # CSS custom properties (required)
├── surfaces/                  # Surface documents (optional)
│   ├── default.surface.json
│   └── examples/
└── preview.png                # Theme preview image (optional)
```

---

## 3. Manifest Schema

```json
{
  "$schema": "https://universalsurfacexd.app/schemas/obf-light/v1.json",
  "manifestVersion": "1",
  "themeId": "com.example.my-theme",
  "name": "My Theme",
  "version": "1.0.0",
  "description": "A description of the theme",
  "author": "Author Name",
  "license": "MIT",
  "compatibleWith": {
    "usxd": ">=1.4.0",
    "marksmith": ">=0.1.0"
  },
  "tags": ["retro", "classic-modern", "dark"],
  "preview": "preview.png",
  "surfaces": ["surfaces/default.surface.json"],
  "tokens": {
    "color": "tokens/color.json",
    "typography": "tokens/typography.json",
    "spacing": "tokens/spacing.json",
    "radius": "tokens/radius.json"
  }
}
```

### Manifest Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `manifestVersion` | string | ✅ | Schema version (`"1"`) |
| `themeId` | string | ✅ | Unique ID (`com.author.name`) |
| `name` | string | ✅ | Human-readable name |
| `version` | string | ✅ | Semver version |
| `description` | string | ✅ | Short description |
| `author` | string | ✅ | Creator name |
| `license` | string | ✅ | SPDX license identifier |
| `compatibleWith` | object | ✅ | Version compatibility ranges |
| `tags` | string[] | | Search/filter tags |
| `preview` | string | | Path to preview image |
| `surfaces` | string[] | | Paths to surface documents |
| `tokens` | object | ✅ | Paths to token files |

---

## 4. Token Files

Token files follow the same format as the [Design Tokens Specification](./DESIGN_TOKENS_SPEC.md).

### 4.1 Required: color.json

```json
{
  "$schema": "https://universalsurfacexd.app/schemas/tokens/v1.json",
  "name": "Color",
  "version": "1.0.0",
  "tokens": {
    "primary": "#3A7BD5",
    "primaryVariant": "#2F6FE0",
    "secondary": "#C97A2B",
    "background": "#F5F5F5",
    "surface": "#FFFFFF",
    "error": "#F44336",
    "onPrimary": "#FFFFFF",
    "onBackground": "#212121",
    "onSurface": "#212121"
  }
}
```

### 4.2 Optional: typography.json

```json
{
  "$schema": "https://universalsurfacexd.app/schemas/tokens/v1.json",
  "name": "Typography",
  "version": "1.0.0",
  "tokens": {
    "fontFamilyUi": ["Chicago", "Courier New", "monospace"],
    "fontFamilyBody": ["Geneva", "Inter", "system-ui", "sans-serif"],
    "fontFamilyMono": ["Monaco", "JetBrains Mono", "monospace"],
    "bodySize": "14px",
    "bodyWeight": 400,
    "bodyLineHeight": "20px"
  }
}
```

### 4.3 Optional: spacing.json

```json
{
  "$schema": "https://universalsurfacexd.app/schemas/tokens/v1.json",
  "name": "Spacing",
  "version": "1.0.0",
  "tokens": {
    "xsmall": "8px",
    "small": "16px",
    "medium": "24px",
    "large": "32px",
    "xlarge": "40px"
  }
}
```

### 4.4 Optional: radius.json

```json
{
  "$schema": "https://universalsurfacexd.app/schemas/tokens/v1.json",
  "name": "Radius",
  "version": "1.0.0",
  "tokens": {
    "small": "4px",
    "medium": "8px",
    "large": "12px",
    "full": "9999px"
  }
}
```

---

## 5. Theme CSS

The `theme.css` file maps tokens to CSS custom properties:

```css
/* Classic Modern Theme */
:root {
  /* Colors */
  --color-primary: #3A7BD5;
  --color-primary-variant: #2F6FE0;
  --color-secondary: #C97A2B;
  --color-background: #E8E8E8;
  --color-surface: #F2F2F2;
  --color-error: #F44336;
  --color-on-primary: #FFFFFF;
  --color-on-background: #111111;
  --color-on-surface: #111111;
  --color-border: #222222;

  /* Typography */
  --font-family-ui: "Chicago", "Courier New", monospace;
  --font-family-body: "Geneva", "Inter", system-ui, sans-serif;
  --font-family-mono: "Monaco", "JetBrains Mono", monospace;

  /* Spacing */
  --spacing-xsmall: 8px;
  --spacing-small: 16px;
  --spacing-medium: 24px;
  --spacing-large: 32px;
  --spacing-xlarge: 40px;

  /* Radius */
  --radius-small: 4px;
  --radius-medium: 8px;
  --radius-large: 12px;

  /* Shadows */
  --shadow-small: 0 2px 4px rgba(0,0,0,0.1);
  --shadow-medium: 0 4px 8px rgba(0,0,0,0.12);
  --shadow-large: 0 8px 16px rgba(0,0,0,0.14);

  /* Grid */
  --grid-gutter: 24px;
  --grid-margin: 16px;
}
```

---

## 6. Example Bundles

### 6.1 Classic Modern

The flagship retro theme, ported from the beta archive:

```
classic-modern.usxd-theme
├── manifest.json
├── tokens/
│   ├── color.json          # Classic Modern palette
│   ├── typography.json     # Chicago, Geneva, Monaco
│   ├── spacing.json        # 8px base scale
│   └── radius.json         # Minimal radius
├── theme.css               # Platinum gradients, System 7 chrome
├── surfaces/
│   ├── default.surface.json
│   └── examples/
│       └── desktop.surface.yaml
└── preview.png
```

### 6.2 Chunky

The existing Chunky theme from USXD v1.4.0:

```
chunky.usxd-theme
├── manifest.json
├── tokens/
│   ├── color.json          # Chunky palette
│   └── typography.json     # Bold, chunky fonts
├── theme.css               # Chunky styling
└── preview.png
```

### 6.3 Dark Mode

A dark variant:

```
dark.usxd-theme
├── manifest.json
├── tokens/
│   ├── color.json          # Dark palette
│   └── typography.json
├── theme.css               # Dark theme CSS
└── preview.png
```

---

## 7. Import/Export API

### 7.1 Import Theme

```typescript
import { importTheme } from '../themeRegistry';

async function installTheme(filePath: string) {
  const theme = await importTheme(filePath);
  // theme.manifest  — parsed manifest.json
  // theme.tokens    — parsed token files
  // theme.css       — CSS string
  // theme.surfaces  — parsed surface documents
  registerTheme(theme);
}
```

### 7.2 Export Theme

```typescript
import { exportTheme } from '../themeRegistry';

async function packageTheme(themeId: string, outputPath: string) {
  const bundle = await exportTheme(themeId);
  // Creates .usxd-theme ZIP archive at outputPath
  await bundle.save(outputPath);
}
```

### 7.3 Bundle Validation

```typescript
import { validateBundle } from '../themeRegistry';

const result = await validateBundle('path/to/theme.usxd-theme');
// result.valid      — boolean
// result.errors     — string[]
// result.warnings   — string[]
```

---

## 8. Validation Rules

1. **manifest.json** must exist at bundle root
2. **manifestVersion** must be `"1"`
3. **themeId** must match `^[a-z0-9]+(\.[a-z0-9]+)+$`
4. **version** must be valid semver
5. **tokens.color** file must exist and be valid JSON
6. **theme.css** file must exist
7. All referenced files in manifest must exist in bundle
8. Token values must match expected types (strings for colors, numbers for weights, etc.)

---

## 9. Compatibility

| App | Minimum Version | Notes |
|-----|----------------|-------|
| UniversalSurfaceXD | v2.0.0-alpha | Full theme support |
| Marksmith | v0.1.0 | Theme import only |
| PublishLane | v1.1.0 | Theme bundle publishing |

---

*Part of UniversalSurfaceXD v2.0.0 "Surface Convergence". See [SURFACE_DOCUMENT_SPEC.md](./SURFACE_DOCUMENT_SPEC.md) and [DESIGN_TOKENS_SPEC.md](./DESIGN_TOKENS_SPEC.md) for related specifications.*
