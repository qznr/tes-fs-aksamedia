/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#DE78DE',
        secondary: '#78DEDE',
        'dark-bg': '#16162c',
        'complement': '#78DE78',
        'inbetween': '#78ABDE',
      },
    },
  },
  plugins: [],
}

