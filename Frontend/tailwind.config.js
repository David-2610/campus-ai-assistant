/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          light: '#FFF9F5', // Soft Warmth Background
          peach: '#FCD3AA', // Soft Orange
          orange: '#E85D04', // Primary Warm Orange
          maroon: '#6A040F', // Primary Soft Maroon
          dark: '#370617' // Deep Dark Maroon for text/active stats
        }
      }
    },
  },
  plugins: [],
}
