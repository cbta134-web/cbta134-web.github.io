/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"] ,
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#1e40af",
        "bg-soft": "#f1f5f9",
        "bg-dark": "#0f172a"
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"]
      }
    }
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("@tailwindcss/typography"),
    require("@tailwindcss/container-queries")
  ]
};
