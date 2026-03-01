/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./**/*.php",//detecta todos los archivos 
    "./**/*.html",
    "./**/*.js",
    "./public/**/*.html",
    "./src/**/*.{js,html}"
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

