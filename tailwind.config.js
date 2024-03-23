/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme');
module.exports = {
  content: ['./src/**/*.{tsx,html,js}'],
  theme: {
    extend: {},
  },
  plugins: [require('@tailwindcss/forms')],
};

