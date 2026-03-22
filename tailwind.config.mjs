/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,ts}'],
  corePlugins: {
    preflight: false,
  },
  theme: {
    extend: {
      colors: {
        primary: '#059669',
        'primary-dark': '#047857',
        dark: '#1e293b',
        muted: '#475569',
      },
    },
  },
};
