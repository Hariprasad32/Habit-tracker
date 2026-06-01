/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#5B6CFF",
        "primary-dark": "#4a59d4",
        "bg-main": "#F3F6FF",
        "border-main": "#D6DCFF",
        "text-main": "#1C2340",
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
