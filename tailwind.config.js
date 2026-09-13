/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#ffffff",
          100: "#f2f2f2",
          200: "#e0e0e0",
          400: "#9a9a9a",
          500: "#4d4d4d",
          600: "#111111",
          900: "#000000",
        },
      },
    },
  },
  plugins: [],
};
