/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        Inter: ["Inter", "sans-serif"],
      },
      colors: {
        "primary": "#FA1700",
        "primary-light": "#F5F5F5",
        "primary-mid": "#8C8C8C",
      },
    },
  },
  plugins: [
    require('tailwind-scrollbar-hide'),
  ],
}
