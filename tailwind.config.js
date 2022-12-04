/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'themeColor': '#362ffa',
        'themeLightColor': '#DCDFFF',
        'themeDarkColor': '#2821eb',
      },
      fontFamily: {
        'dm_Sans': ['DM Sans']
      },
      boxShadow: {
        'theme': '0 2px 55px rgb(168 182 218 / 32%)'
      }
    },
  },
  plugins: [],
}
