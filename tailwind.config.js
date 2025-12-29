/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#3b82f6",
        dark: "#0f172a",
        darker: "#020617",
        card: "#1e293b",
        success: "#22c55e",
        danger: "#ef4444",
        warning: "#f59e0b",
      },
    },
  },
  plugins: [],
}
