/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        'primary-light': 'var(--color-primary-light)',
        'primary-dark': 'var(--color-primary-dark)',
        secondary: 'var(--color-secondary)',
        'secondary-light': 'var(--color-secondary-light)',
        'secondary-dark': 'var(--color-secondary-dark)',
        accent: 'var(--color-accent)',
        'accent-light': 'var(--color-accent-light)',
        'accent-dark': 'var(--color-accent-dark)',
        bg: 'var(--color-bg)',
        'bg-surface': 'var(--color-bg-surface)',
        'bg-muted': 'var(--color-bg-muted)',
        text: 'var(--color-text)',
        'text-muted': 'var(--color-text-muted)',
        'text-disabled': 'var(--color-text-disabled)',
        success: 'var(--color-success)',
        warning: 'var(--color-warning)',
        error: 'var(--color-error)',
        info: 'var(--color-info)',
        border: 'var(--color-border)',
        'border-focus': 'var(--color-border-focus)',
      },
      fontFamily: {
        sans: ['Spoqa Han Sans Neo', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
