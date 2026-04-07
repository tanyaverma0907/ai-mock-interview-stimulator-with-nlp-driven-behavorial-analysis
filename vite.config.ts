import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
})

// /** @type {import('tailwindcss').Config} */
// export default {
//   content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
//   theme: {
//     extend: {
//       fontFamily: {
//         sans: ['Syne', 'system-ui', 'sans-serif'],
//         mono: ['JetBrains Mono', 'monospace'],
//       },
//       animation: {
//         'fade-in':   'fadeIn 0.4s ease forwards',
//         'slide-up':  'slideUp 0.5s ease forwards',
//       },
//       keyframes: {
//         fadeIn:  { from: { opacity: '0', transform: 'translateY(8px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
//         slideUp: { from: { opacity: '0', transform: 'translateY(20px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
//       },
//     },
//   },
//   plugins: [],
// }
