/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "aliceblue": "#010910",
        "whitesmoke": "#eff5fb",
        "blackish": "#060c12",
        "darkgreyish": "#16181c",
        "lightgreyish": "#272b31",
        "deepblue": "#070b0f",
        "lightdeepblue": "#121820",
        "marineblue": "#3770cd"
      },
    }
  },
  plugins: [],
}