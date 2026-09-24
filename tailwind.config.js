/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#0A2E5C',
          50: '#EEF3F9',
          100: '#D6E2F0',
          200: '#A9C0DD',
          300: '#7699C6',
          400: '#3F6BA6',
          500: '#1B4A83',
          600: '#0A2E5C',
          700: '#08264C',
          800: '#061C39',
          900: '#041226',
        },
        gold: {
          DEFAULT: '#F5B400',
          50: '#FFF8E5',
          100: '#FDEDBF',
          200: '#FBDD84',
          300: '#F8C93F',
          400: '#F5B400',
          500: '#D39B00',
          600: '#A87B00',
        },
        canvas: '#F4F6F9',
        line: '#E3E8EF',
        danger: '#C0392B',
        success: '#1E8E5A',
      },
      fontFamily: {
        sans: [
          '"IBM Plex Sans"',
          'system-ui',
          '-apple-system',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
      },
      boxShadow: {
        card: '0 1px 2px rgba(16,24,40,0.04)',
        pop: '0 12px 32px -12px rgba(8,38,76,0.28)',
      },
    },
  },
  plugins: [],
}
