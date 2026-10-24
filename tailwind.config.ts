import type { Config } from 'tailwindcss';

// Palitra: och yashil + iliq krem. Ranglar CSS o‘zgaruvchilari orqali beriladi
// (src/app/globals.css) — dark rejimda ular avtomatik almashadi.
const token = (name: string) => `rgb(var(--${name}) / <alpha-value>)`;

const config: Config = {
  darkMode: 'class',
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: token('ink'),
        brand: token('brand'),
        'brand-dark': token('brand-dark'),
        'brand-soft': token('brand-soft'),
        surface: token('surface'),
        tint: token('tint'),
        card: token('card'),
        butter: token('butter'),
        line: token('line'),
        muted: token('muted'),
        amber: token('amber'),
        danger: token('danger'),
      },
      borderRadius: { xl: '15px' },
      boxShadow: { soft: '0 8px 24px rgb(27 58 45 / 0.08)' },
      fontFamily: { sans: ['var(--font-inter)', 'system-ui', 'sans-serif'] },
    },
  },
  plugins: [],
};

export default config;
