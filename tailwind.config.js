/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        gray: {
          750: 'rgb(31, 35, 45)',
          650: 'rgb(45, 50, 60)',
        },
      },
    },
  },
  plugins: [],
};