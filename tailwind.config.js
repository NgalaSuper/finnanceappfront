/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      'sm': '640px',
      // => @media (min-width: 640px) { ... }

      'md': '768px',
      // => @media (min-width: 768px) { ... }

      'lg': '1024px',
      // => @media (min-width: 1024px) { ... }

      'xl': '1280px',
      // => @media (min-width: 1280px) { ... }

      '2xl': '1536px',
      // => @media (min-width: 1536px) { ... }
    },
    extend: {
      colors:{
        borderColor: '#E7EAED',
        backgroundButtonCancel:'#F6F5F9',
        borderButtonCancel:'#D9D9D9',
        textColorCancel:'#636979',
        backgroundColor:'#FCFCFD',
        backgroundColorAll:'#F3F6F9',
        backgroundButton:'#9dcaff',
        borderColorBackground:'#A6A6A6',
        fontColor:'#2B2B2B',
        hoverColor:'#9dcaff',
        hoverButtonColor:'#2e85c5',
        borderColor2:'#003732',
        textColorButton:'#1a1a1a',
        editButtonColor:'#9CA3AF'

      }
    },
    fontFamily: {
      manrope: ['Arial', 'sans-serif']
    }
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}

