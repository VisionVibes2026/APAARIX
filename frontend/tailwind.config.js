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
        brand: {
          sidebar: '#001529',
          primary: '#1677ff',
          'primary-hover': '#4096ff',
          teal: '#13a8a8',
          success: '#52c41a',
          warning: '#faad14',
          danger: '#ff4d4f',
          info: '#1677ff',
          bg: '#f0f2f5',
          card: '#ffffff',
          text: '#1f1f1f',
          'text-secondary': '#8c8c8c',
          border: '#e8e8e8',
        },
        dark: {
          bg: '#000000',
          card: '#141414',
          container: '#1f1f1f',
          border: '#303030',
          text: '#e6e6e6',
          'text-secondary': '#a0a0a0',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        kpi: ['Outfit', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

