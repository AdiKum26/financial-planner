/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#060606',
        surface: '#0f0f0f',
        surface2: '#171717',
        surface3: '#1f1f1f',
        border: '#272727',
        borderGold: '#3a2e10',
        gold: '#c9a435',
        goldLight: '#e8c96f',
        goldDim: '#6a5418',
        goldGlow: 'rgba(201,164,53,0.12)',
        text: '#f0f0f0',
        textSub: '#aaaaaa',
        textMuted: '#555555',
        red: '#e05555',
        green: '#4caf72',
      },
      fontFamily: {
        serif: ['"DM Serif Display"', 'serif'],
        sans: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        xs: '2px',
        sm: '3px',
        DEFAULT: '4px',
      },
      keyframes: {
        spin: {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(6px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
      },
      animation: {
        spin: 'spin 1.2s linear infinite',
        fadeUp: 'fadeUp 0.4s ease-out',
        fadeIn: 'fadeIn 0.3s ease-out',
      },
    },
  },
  plugins: [],
};
