/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        void: '#000000',
        char: '#0A0A0A',
        signal: '#FF1E1E',
        glow: '#FF3B3B',
        blood: '#8B0000',
        ash: '#A1A1A1',
      },
      fontFamily: {
        display: ['Orbitron', 'Rajdhani', 'sans-serif'],
        tech: ['Rajdhani', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        red: '0 0 24px rgba(255,30,30,0.45), inset 0 0 12px rgba(255,30,30,0.15)',
      },
    },
  },
  plugins: [],
}
