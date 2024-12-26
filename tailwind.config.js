/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Neue Haas Grotesk Display Pro", "sans-serif"],
        serif: ["Old Standard TT", "serif"],
        pixel: ["Pixelify Sans", "sans-serif"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        white: "#EBEBEB",
        black: "#171717",
        "neon-pink": "#f712e8",
        "lime-green": "#39e717",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
