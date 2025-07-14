
const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  content: ['./src/**/*.{html,njk,md}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['YourCustomFont', 'Noto Sans TC', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        'brand-blue': '#1E3A8A',
        'brand-gold': '#D4AF37',
      }
    },
  },
  plugins: [],
};
