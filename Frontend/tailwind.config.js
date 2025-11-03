/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Montserrat', 'ui-sans-serif', 'system-ui'],
      },
      colors: {
        'dark-bg': '#1E1E1E',
      },
      fontSize:{
        'title-xl': '2.75rem',
      }

    },
  },
  plugins: [],
};
