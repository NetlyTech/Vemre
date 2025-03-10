/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        font1 : ['Edu VIC WA NT Beginner', 'sans-serif'],
        'jost': ['Jost', 'sans-serif'],
        'poppins': ['Poppins', 'sans-serif'],
        'chakra': ['Chakra Petch', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

