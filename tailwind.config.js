/** @type {import('tailwindcss').Config} */
export default {
  content: [
      "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        blueshade:"#0C3E78",
         backgroundImage: {
      'event-gradient': 'linear-gradient(135deg, #0C3E78, #6A0DAD)',
    },
      }
    },
  },
  plugins: [],
}

