/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        medical: {
          primary: '#2563eb',
          secondary: '#3b82f6',
          light: '#dbeafe',
          dark: '#1e40af',
        }
      }
    },
  },
  plugins: [],
}
