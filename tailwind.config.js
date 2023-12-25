/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  darkMode: 'class',
  theme: {
    extend: {
      boxShadow: {
        'card': '0 2px 6px 0 rgba(67, 89, 113, 0.12)',
        'card-profile': '0 0.25rem 1rem rgb(161 172 184 / 45%)',
      },
      colors: {
        // all themes
        'font-link': '#696CFF',
        'font-link-hover': '#787BFF',

        // light theme
        'body-page': '#F9FAFB',
        'content': '#FFFFFF',
        'navigation-responsive': '#435971',

        'font-header': '#566A7F',
        'font-description': '#697A8D',
        'font-description-hover': 'rgb(243 244 246 / 0.7)',
        // dark theme
        'body-page-dark': '#18191A',
        'content-dark': '#242526',
        'border-dark': '#3a3b3c',

        'font-header-dark': '#E4E6EB',
        'font-description-dark': '#B0B3B8',
        'font-header-dark-active': '#8385FF',
      },
    },
  },
  plugins: [require('@tailwindcss/line-clamp')],
}
