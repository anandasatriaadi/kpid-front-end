/** @type {import('tailwindcss').Config} */
module.exports = {
  important: true,
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        montserrat: ["Inter", "sans-serif"],
      },
      boxShadow: {
        custom: "0 10px 20px 0 rgba(140, 144, 164, 0.08)",
      },
    },
  },
  plugins: [require("prettier-plugin-tailwindcss")],
};
