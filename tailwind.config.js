/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/renderer/**/*.{js,jsx,ts,tsx,html}',
    './node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}',
    './node_modules/flowbite/**/*.js'
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'usxd-primary': 'rgb(var(--usx-color-highlight) / <alpha-value>)',
        'usxd-secondary': 'rgb(var(--usx-color-text-muted) / <alpha-value>)',
        'usxd-background': 'rgb(var(--usx-color-background) / <alpha-value>)',
        'usxd-surface': 'rgb(var(--usx-color-surface) / <alpha-value>)',
        'usxd-text': 'rgb(var(--usx-color-text) / <alpha-value>)',
        'usxd-border': 'rgb(var(--usx-color-border) / <alpha-value>)',
        'usxd-highlight': 'rgb(var(--usx-color-highlight) / <alpha-value>)',
        'usxd-highlight-text': 'rgb(var(--usx-color-highlight-text) / <alpha-value>)',
      },
      fontFamily: {
        'usxd-body': ['var(--usx-font-family-body)'],
        'usxd-heading': ['var(--usx-font-family-desktop)'],
        'usxd-mono': ['var(--usx-font-family-mono)'],
        'usxd-ui': ['var(--usx-font-family-ui)'],
      },
      borderRadius: {
        'usxd': 'var(--usx-radius-md)',
        'usxd-lg': 'var(--usx-radius-lg)',
        'usxd-xl': 'var(--usx-radius-xl)',
      },
      spacing: {
        'usxd': 'var(--usx-spacing-4)',
        'usxd-2': 'var(--usx-spacing-6)',
        'usxd-3': 'var(--usx-spacing-8)',
      },
      // Legacy USX color mapping (kept for backward compat)
      usx: {
        background: 'rgb(var(--usx-color-background))',
        surface: 'rgb(var(--usx-color-surface))',
        text: 'rgb(var(--usx-color-text))',
        muted: 'rgb(var(--usx-color-text-muted))',
        primary: 'rgb(var(--usx-color-highlight))',
        secondary: 'rgb(var(--usx-color-text-muted))',
        border: 'rgb(var(--usx-color-border))',
      },
    },
  },
  plugins: [
    require('flowbite/plugin'),
  ],
};
