/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
          950: '#050505',
          900: '#0a0a0a',
          850: '#0f0f0f',
          800: '#141414',
          750: '#181818',
          700: '#202020',
          600: '#2a2a2a',
          500: '#3f3f46',
        },
        border: {
          subtle: 'rgba(255, 255, 255, 0.07)',
          DEFAULT: 'rgba(255, 255, 255, 0.12)',
          highlight: 'rgba(255, 255, 255, 0.22)',
        },
        monochrome: {
          white: '#ffffff',
          silver: '#e4e4e7',
          gray: '#a1a1aa',
          muted: '#71717a',
          dimmed: '#52525b',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'orbit-spin': 'spin 20s linear infinite',
      }
    },
  },
  plugins: [],
}
