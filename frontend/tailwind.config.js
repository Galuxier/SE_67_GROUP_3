/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // ✅ ให้ Tailwind ตรวจสอบไฟล์ JSX ทั้งหมด
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

