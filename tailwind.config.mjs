/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        lapiz: {
          bg: '#FFFFFF',
          ink: '#161925',
          accent: '#406E8E',
          soft: '#BFD7EA',
        },
      },
      fontFamily: {
        sans: ['Manrope', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(22,25,37,0.04), 0 1px 3px rgba(22,25,37,0.06)',
        'card-hover': '0 4px 8px rgba(22,25,37,0.06), 0 8px 24px rgba(22,25,37,0.08)',
      },
    },
  },
  plugins: [],
};
