/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      fontSize: {
        // headline hierarchy – fluid with clamp for responsiveness
        'h1': ['clamp(1.875rem, 5vw + 1rem, 2.25rem)', { lineHeight: '2.5rem' }],
        'h2': ['clamp(1.75rem, 4vw + 1rem, 2rem)', { lineHeight: '2.25rem' }],
        'h3': ['clamp(1.5rem, 3.5vw + 1rem, 1.75rem)', { lineHeight: '2rem' }],
        'h4': ['clamp(1.25rem, 3vw + 1rem, 1.5rem)', { lineHeight: '1.75rem' }],
        'h5': ['clamp(1.125rem, 2.5vw + 1rem, 1.25rem)', { lineHeight: '1.5rem' }],
        // utility sizes
        'card': ['clamp(1rem, 2vw + 0.75rem, 1rem)', { lineHeight: '1.5rem' }],
        'body': ['clamp(1rem, 2vw + 0.75rem, 1rem)', { lineHeight: '1.5rem' }],
        'small': ['clamp(0.875rem, 1.5vw + 0.75rem, 0.875rem)', { lineHeight: '1.25rem' }],
      },
      spacing: {
        // keep consistent card padding etc if needed
      },
    },
  },
  plugins: [],
};