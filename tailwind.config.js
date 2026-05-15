/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/renderer/**/*.{ts,tsx,html}',
    './node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Map USX CSS variables to Tailwind colors
        usx: {
          background: 'rgb(var(--usx-color-background))',
          surface: 'rgb(var(--usx-color-surface))',
          text: 'rgb(var(--usx-color-text))',
          muted: 'rgb(var(--usx-color-text-muted))',
          primary: 'rgb(var(--usx-color-primary))',
          secondary: 'rgb(var(--usx-color-secondary))',
          border: 'rgb(var(--usx-color-border))',
        },
      },
      fontFamily: {
        heading: 'var(--usx-font-family-heading)',
        body: 'var(--usx-font-family-body)',
        mono: 'var(--usx-font-family-mono)',
        ui: 'var(--usx-font-family-ui)',
      },
    },
  },
  plugins: [
    require('flowbite/plugin'),
  ],
};
