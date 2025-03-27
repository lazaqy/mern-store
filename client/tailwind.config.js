/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "primary-200": "#4287f5",
        "primary-100": "#42b0f5",
        "secondary-200": "#00b050",
        "secondary-100": "#0b1a78",
      },
    },
  },
  plugins: [],
};
