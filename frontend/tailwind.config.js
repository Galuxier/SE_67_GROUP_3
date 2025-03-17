/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
        background: 'var(--color-background)',
        bar: 'var(--color-bar-background)',
        card: 'var(--color-card-background)', // เพิ่มสีสำหรับ Card
        text: 'var(--color-text)',
        border: 'var(--color-border)',
        textmain: 'var(--color-text-main)',
      },
    },
  },
  variants: {
    extend: {
      backgroundColor: ['dark'],
      textColor: ['dark'],
      borderColor: ['dark'],
    },
  },
  plugins: [],
  darkMode: 'class',
}
  
