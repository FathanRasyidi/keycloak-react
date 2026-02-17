/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "blackampwhitewhite": "rgba(255, 255, 255, 1)",
        "graygray-200": "rgba(226, 232, 240, 1)",
        "graygray-400": "rgba(160, 174, 192, 1)",
        "graygray-500": "rgba(113, 128, 150, 1)",
        "graygray-700": "rgba(45, 55, 72, 1)",
        "tealteal-300": "rgba(79, 209, 197, 1)",
      },
      fontFamily: {
        sans: ["Poppins", "sans-serif"],
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
      },
    },
  },
  plugins: [],
}
