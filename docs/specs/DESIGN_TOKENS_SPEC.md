# Design Tokens Specification

> **Version:** 1.0.0  
> **Status:** Draft  
> **Part of:** UniversalSurfaceXD v2.0.0 "Surface Convergence"  
> **Source:** Ported from USXD beta archive (Era 1) spine/tokens/ + classic-modern-inspiration.yaml

---

## 1. Overview

Design tokens are the atomic values that define the visual language of UniversalSurfaceXD. They provide a single source of truth for colors, typography, spacing, and radii across all surfaces and themes.

Tokens are defined as JSON files and consumed as CSS custom properties at runtime.

---

## 2. Token Categories

| Category | File | Description |
|----------|------|-------------|
| Color | `color.json` | Color palette (light + dark) |
| Typography | `typography.json` | Font families, sizes, weights, line heights |
| Spacing | `spacing.json` | 8px-based spacing scale |
| Radius | `radius.json` | Border radius values |

---

## 3. Color Tokens

### 3.1 Classic Modern Palette (from beta archive)

```json
{
  "cm": {
    "bg": "#E8E8E8",
    "surface": "#F2F2F2",
    "border": "#222222",
    "text": "#111111",
    "accent": "#3A7BD5",
    "accentAlt": "#C97A2B"
  },
  "apple": {
    "platinum": "#D4D4D4",
    "platinumLight": "#E8E8E8",
    "platinumDark": "#B8B8B8",
    "aluminum": "#C0C0C0",
    "graphite": "#808080"
  },
  "sys7": {
    "teal": "#008080",
    "maroon": "#800000",
    "navy": "#000080",
    "olive": "#808000",
    "purple": "#800080"
  },
  "gradient": {
    "platinumStops": ["#F0F0F0", "#E0E0E0", "#D0D0D0"],
    "titleBarStops": ["#D4D4D4", "#B8B8B8"],
    "selectedStops": ["#3A86FF", "#2F6FE0"]
  }
}
```

### 3.2 Semantic Color Tokens

```json
{
  "light": {
    "primary": "#3A7BD5",
    "primaryVariant": "#2F6FE0",
    "secondary": "#C97A2B",
    "secondaryVariant": "#A8651F",
    "background": "#F5F5F5",
    "surface": "#FFFFFF",
    "error": "#F44336",
    "onPrimary": "#FFFFFF",
    "onSecondary": "#FFFFFF",
    "onBackground": "#212121",
    "onSurface": "#212121",
    "onError": "#FFFFFF",
    "border": "#E0E0E0",
    "divider": "#EEEEEE",
    "disabled": "#9E9E9E",
    "disabledText": "#BDBDBD"
  },
  "dark": {
    "primary": "#90CAF9",
    "primaryVariant": "#64B5F6",
    "secondary": "#FFB74D",
    "secondaryVariant": "#FFA726",
    "background": "#121212",
    "surface": "#1E1E1E",
    "error": "#EF5350",
    "onPrimary": "#000000",
    "onSecondary": "#000000",
    "onBackground": "#E0E0E0",
    "onSurface": "#E0E0E0",
    "onError": "#000000",
    "border": "#333333",
    "divider": "#2C2C2C",
    "disabled": "#616161",
    "disabledText": "#424242"
  }
}
```

### 3.3 CSS Custom Properties

```css
:root,
[data-theme="light"] {
  --color-primary: #3A7BD5;
  --color-primary-variant: #2F6FE0;
  --color-secondary: #C97A2B;
  --color-secondary-variant: #A8651F;
  --color-background: #F5F5F5;
  --color-surface: #FFFFFF;
  --color-error: #F44336;
  --color-on-primary: #FFFFFF;
  --color-on-secondary: #FFFFFF;
  --color-on-background: #212121;
  --color-on-surface: #212121;
  --color-on-error: #FFFFFF;
  --color-border: #E0E0E0;
  --color-divider: #EEEEEE;
  --color-disabled: #9E9E9E;
  --color-disabled-text: #BDBDBD;
}

[data-theme="dark"] {
  --color-primary: #90CAF9;
  --color-primary-variant: #64B5F6;
  --color-secondary: #FFB74D;
  --color-secondary-variant: #FFA726;
  --color-background: #121212;
  --color-surface: #1E1E1E;
  --color-error: #EF5350;
  --color-on-primary: #000000;
  --color-on-secondary: #000000;
  --color-on-background: #E0E0E0;
  --color-on-surface: #E0E0E0;
  --color-on-error: #000000;
  --color-border: #333333;
  --color-divider: #2C2C2C;
  --color-disabled: #616161;
  --color-disabled-text: #424242;
}
```

---

## 4. Typography Tokens

### 4.1 Font Families

```json
{
  "families": {
    "ui": ["Chicago", "Courier New", "monospace"],
    "body": ["Geneva", "Inter", "system-ui", "sans-serif"],
    "mono": ["Monaco", "JetBrains Mono", "monospace"],
    "serif": ["New York", "Georgia", "serif"]
  }
}
```

### 4.2 Type Scale (Material 3-inspired)

```json
{
  "scale": {
    "displayLarge": { "size": "57px", "weight": 400, "lineHeight": "64px", "letterSpacing": "-0.25px" },
    "displayMedium": { "size": "45px", "weight": 400, "lineHeight": "52px", "letterSpacing": "0px" },
    "displaySmall": { "size": "36px", "weight": 400, "lineHeight": "44px", "letterSpacing": "0px" },
    "headlineLarge": { "size": "32px", "weight": 400, "lineHeight": "40px", "letterSpacing": "0px" },
    "headlineMedium": { "size": "28px", "weight": 400, "lineHeight": "36px", "letterSpacing": "0px" },
    "headlineSmall": { "size": "24px", "weight": 400, "lineHeight": "32px", "letterSpacing": "0px" },
    "titleLarge": { "size": "22px", "weight": 500, "lineHeight": "28px", "letterSpacing": "0px" },
    "titleMedium": { "size": "16px", "weight": 500, "lineHeight": "24px", "letterSpacing": "0.15px" },
    "titleSmall": { "size": "14px", "weight": 500, "lineHeight": "20px", "letterSpacing": "0.1px" },
    "bodyLarge": { "size": "16px", "weight": 400, "lineHeight": "24px", "letterSpacing": "0.5px" },
    "bodyMedium": { "size": "14px", "weight": 400, "lineHeight": "20px", "letterSpacing": "0.25px" },
    "bodySmall": { "size": "12px", "weight": 400, "lineHeight": "16px", "letterSpacing": "0.4px" },
    "labelLarge": { "size": "14px", "weight": 500, "lineHeight": "20px", "letterSpacing": "0.1px" },
    "labelMedium": { "size": "12px", "weight": 500, "lineHeight": "16px", "letterSpacing": "0.5px" },
    "labelSmall": { "size": "11px", "weight": 500, "lineHeight": "16px", "letterSpacing": "0.5px" }
  }
}
```

### 4.3 CSS Custom Properties

```css
:root {
  --font-family-ui: "Chicago", "Courier New", monospace;
  --font-family-body: "Geneva", "Inter", system-ui, sans-serif;
  --font-family-mono: "Monaco", "JetBrains Mono", monospace;
  --font-family-serif: "New York", "Georgia", serif;

  --font-display-large: 400 57px/64px var(--font-family-body);
  --font-display-medium: 400 45px/52px var(--font-family-body);
  --font-display-small: 400 36px/44px var(--font-family-body);
  --font-headline-large: 400 32px/40px var(--font-family-body);
  --font-headline-medium: 400 28px/36px var(--font-family-body);
  --font-headline-small: 400 24px/32px var(--font-family-body);
  --font-title-large: 500 22px/28px var(--font-family-body);
  --font-title-medium: 500 16px/24px var(--font-family-body);
  --font-title-small: 500 14px/20px var(--font-family-body);
  --font-body-large: 400 16px/24px var(--font-family-body);
  --font-body-medium: 400 14px/20px var(--font-family-body);
  --font-body-small: 400 12px/16px var(--font-family-body);
  --font-label-large: 500 14px/20px var(--font-family-body);
  --font-label-medium: 500 12px/16px var(--font-family-body);
  --font-label-small: 500 11px/16px var(--font-family-body);
}
```

---

## 5. Spacing Tokens

### 5.1 Spacing Scale (8px base)

```json
{
  "none": "0px",
  "xxsmall": "4px",
  "xsmall": "8px",
  "small": "16px",
  "medium": "24px",
  "large": "32px",
  "xlarge": "40px",
  "xxlarge": "48px",
  "huge": "56px",
  "xhuge": "64px"
}
```

### 5.2 CSS Custom Properties

```css
:root {
  --spacing-none: 0px;
  --spacing-xxsmall: 4px;
  --spacing-xsmall: 8px;
  --spacing-small: 16px;
  --spacing-medium: 24px;
  --spacing-large: 32px;
  --spacing-xlarge: 40px;
  --spacing-xxlarge: 48px;
  --spacing-huge: 56px;
  --spacing-xhuge: 64px;
}
```

### 5.3 Semantic Spacing

```css
:root {
  --spacing-inset-xs: var(--spacing-xxsmall);
  --spacing-inset-sm: var(--spacing-xsmall);
  --spacing-inset-md: var(--spacing-small);
  --spacing-inset-lg: var(--spacing-medium);

  --spacing-stack-xs: var(--spacing-xxsmall);
  --spacing-stack-sm: var(--spacing-xsmall);
  --spacing-stack-md: var(--spacing-small);
  --spacing-stack-lg: var(--spacing-medium);

  --spacing-inline-xs: var(--spacing-xxsmall);
  --spacing-inline-sm: var(--spacing-xsmall);
  --spacing-inline-md: var(--spacing-small);
  --spacing-inline-lg: var(--spacing-medium);
}
```

---

## 6. Radius Tokens

### 6.1 Border Radius Scale

```json
{
  "none": "0px",
  "xsmall": "2px",
  "small": "4px",
  "medium": "8px",
  "large": "12px",
  "xlarge": "16px",
  "full": "9999px"
}
```

### 6.2 CSS Custom Properties

```css
:root {
  --radius-none: 0px;
  --radius-xsmall: 2px;
  --radius-small: 4px;
  --radius-medium: 8px;
  --radius-large: 12px;
  --radius-xlarge: 16px;
  --radius-full: 9999px;
}
```

---

## 7. Grid System

### 7.1 Responsive Breakpoints

```json
{
  "breakpoints": {
    "xs": { "min": 0, "max": 599, "columns": 4 },
    "sm": { "min": 600, "max": 959, "columns": 8 },
    "md": { "min": 960, "max": 1279, "columns": 12 },
    "lg": { "min": 1280, "max": 1919, "columns": 12 },
    "xl": { "min": 1920, "max": null, "columns": 12 }
  },
  "gutter": "24px",
  "margin": "16px"
}
```

### 7.2 CSS Custom Properties

```css
:root {
  --grid-columns-xs: 4;
  --grid-columns-sm: 8;
  --grid-columns-md: 12;
  --grid-columns-lg: 12;
  --grid-columns-xl: 12;
  --grid-gutter: var(--spacing-medium);
  --grid-margin: var(--spacing-small);
}
```

---

## 8. Shadow Tokens

```json
{
  "none": "none",
  "xsmall": "0 1px 2px rgba(0,0,0,0.08)",
  "small": "0 2px 4px rgba(0,0,0,0.1)",
  "medium": "0 4px 8px rgba(0,0,0,0.12)",
  "large": "0 8px 16px rgba(0,0,0,0.14)",
  "xlarge": "0 16px 24px rgba(0,0,0,0.16)"
}
```

```css
:root {
  --shadow-none: none;
  --shadow-xsmall: 0 1px 2px rgba(0,0,0,0.08);
  --shadow-small: 0 2px 4px rgba(0,0,0,0.1);
  --shadow-medium: 0 4px 8px rgba(0,0,0,0.12);
  --shadow-large: 0 8px 16px rgba(0,0,0,0.14);
  --shadow-xlarge: 0 16px 24px rgba(0,0,0,0.16);
}
```

---

## 9. Token File Format

Each token file follows this structure:

```json
{
  "$schema": "https://universalsurfacexd.app/schemas/tokens/v1.json",
  "name": "Token category name",
  "version": "1.0.0",
  "description": "Description of the token category",
  "tokens": {
    "tokenName": "tokenValue"
  }
}
```

---

## 10. Theme Development Guide

### Creating a New Theme

1. Create a new directory under `src/renderer/styles/themes/`
2. Define a `tokens/` directory with the 4 token JSON files
3. Create a CSS file that maps tokens to CSS custom properties
4. Register the theme in the theme registry

### Theme Structure

```
themes/my-theme/
├── tokens/
│   ├── color.json
│   ├── typography.json
│   ├── spacing.json
│   └── radius.json
├── theme.css
└── preview.png
```

### Theme Registration

```typescript
import { registerTheme } from '../themeRegistry';

registerTheme({
  id: 'my-theme',
  name: 'My Theme',
  version: '1.0.0',
  tokens: {
    color: colorTokens,
    typography: typographyTokens,
    spacing: spacingTokens,
    radius: radiusTokens
  }
});
```

---

*Part of UniversalSurfaceXD v2.0.0 "Surface Convergence". See [SURFACE_DOCUMENT_SPEC.md](./SURFACE_DOCUMENT_SPEC.md) and [OBF_LIGHT_SPEC.md](./OBF_LIGHT_SPEC.md) for related specifications.*
