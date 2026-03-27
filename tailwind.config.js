/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // ตรวจสอบว่า path นี้ครอบคลุมไฟล์ App.jsx ของมึง
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}