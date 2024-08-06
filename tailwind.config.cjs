module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
      },
      keyframes: {
        zigzagSpin: {
          '0%': { transform: 'translateY(0) translateX(0) rotate(0deg)', opacity: '1' },
          '25%': { transform: 'translateY(200px) translateX(100px) rotate(90deg)', opacity: '0.9' },
          '50%': { transform: 'translateY(400px) translateX(-100px) rotate(180deg)', opacity: '0.8' },
          '75%': { transform: 'translateY(600px) translateX(100px) rotate(270deg)', opacity: '0.7' },
          '100%': { transform: 'translateY(800px) translateX(-100px) rotate(360deg)', opacity: '0' },
        },
      },
      animation: {
        zigzagSpin: 'zigzagSpin 10s linear infinite',
      },
      textShadow: {
        lg: '0 0 15px rgba(200, 200, 200, 1)',
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      const newUtilities = {
        '.text-shadow-lg': {
          textShadow: '0 0 15px rgba(200, 200, 200, 1)',
        },
      };
      addUtilities(newUtilities, ['responsive', 'hover']);
    },
  ],
}