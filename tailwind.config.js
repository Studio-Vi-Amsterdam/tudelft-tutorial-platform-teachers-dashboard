/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme')
export const content = [
  './src/**/*.{js,jsx,ts,tsx}',
];
export const theme = {
  screens: {
    'xs': '475px',
    ...defaultTheme.screens,
  },
  extend: {},
};
export const plugins = [];

