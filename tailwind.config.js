/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#f5f0e8',
        'cream-dark': '#ede6d6',
        paper: '#faf7f0',
        ink: '#1a1612',
        'ink-mid': '#3d352a',
        'ink-light': '#7a6e5f',
        gold: '#b8860b',
        'gold-light': '#d4a520',
        rust: '#8b3a1a',
      },
      fontFamily: {
        playfair: ['"Playfair Display"', 'serif'],
        fell: ['"IM Fell English"', 'serif'],
        dm: ['"DM Sans"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
