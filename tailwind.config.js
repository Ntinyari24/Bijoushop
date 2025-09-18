/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'jungle': {
          50: '#f0f9f4',
          100: '#dcf4e4',
          200: '#bce8cd',
          300: '#8dd5aa',
          400: '#57ba7f',
          500: '#339e5e',
          600: '#26804a',
          700: '#20653c',
          800: '#1d5132',
          900: '#19432a',
        },
        'earth': {
          50: '#faf8f3',
          100: '#f4f0e6',
          200: '#e8dcc6',
          300: '#d9c49f',
          400: '#c8a876',
          500: '#b8925a',
          600: '#a67c4e',
          700: '#8a6543',
          800: '#70533b',
          900: '#5c4532',
        }
      }
    },
  },
  plugins: [],
};
