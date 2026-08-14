/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#FAFAF8',
        'bg-card': '#FFFFFF',
        'text-primary': '#1A1A1A',
        'text-secondary': '#6B7280',
        accent: '#4F46E5',
        'accent-light': '#EEF2FF',
        'accent-hover': '#4338CA',
        success: '#16A34A',
        'success-light': '#DCFCE7',
        warning: '#D97706',
        border: '#E5E7EB',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Consolas', 'monospace'],
      },
      maxWidth: {
        content: '720px',
      },
      width: {
        sidebar: '260px',
      },
    },
  },
  plugins: [],
};
