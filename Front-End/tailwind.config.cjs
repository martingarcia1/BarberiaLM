/** @type {import('tailwindcss').Config} */
module.exports = {

  content: ["./index.html", "./src/**/*.{html,js,jsx}"],
  theme: {
    extend: {
      screens: {
        'max-pe': { max: '2500px' },

        'max-xd': { max: '1400px' },
        'max-a': { max: '1150px' }, // Para pantallas menores a 1024px
        'max-e': { max: '1100px' }, // Para pantallas menores a 1024px
        '700-md': { max: '940px', min: '827px' }, // Rango de 700px a 767px //COLOR NEGRO
        'movil-m': { max: '826px', min: '670px' }, //COLOR NARANJA
        'movil-s': { max: '669px', min: '562px' }, // Define un breakpoint a partir de 700px //COLOR ROJO
        'movil-sm': { max: '561px' },
        'movil-smm': { max: '560px', min: '375px'},


        

      },
      backgroundSize: {
        '200%': '200%',
      },
      keyframes: {
        bounce: {
          '0%, 100%': {
            transform: 'translateY(-20px)',
            textShadow: '0 1px 0 #66a86b, 0 2px 0 #66a86b, 0 3px 0 #66a86b, 0 4px 0 #66a86b, 0 5px 0 #66a86b, 0 6px 0 #66a86b, 0 50px 25px rgba(0, 0, 0, 2)',
          },
        },
        shine: {
          '0%': { backgroundPosition: '200% center' },
          '100%': { backgroundPosition: '0% center' },

          '100%': { 'background-position': '200% center' },
        },
        rotate: {
          '50%': {
            transform: 'translateX(-50%) rotate(180deg)',
          },
          '100%': {
            transform: 'translateX(-50%) rotate(360deg)',
          },
        },
      },
      animation: {
        rotate1: 'rotate 6s linear infinite',
        rotate2: 'rotate 10s linear -5s infinite',
        bounce: 'bounce 0.6s ease-in-out infinite alternate',
        shine: 'shine 10s linear infinite',
      },
      fontFamily: {
        'julius': ['"Julius Sans One"', 'sans-serif'],
      },
      
    },
  },
  plugins: [],
}