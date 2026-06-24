/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Core surface tones
        paper: '#FAFCFF',      // primary background — white with the faintest blue cast
        canvas: '#F3F8FD',     // secondary section background
        ink: '#0B0E14',        // near-black text, never pure #000
        muted: '#5B677A',      // secondary text
        line: '#E3ECF5',       // hairline borders
        // Sky-blue accent system
        sky: {
          50: '#EFF8FF',
          100: '#DCEFFF',
          200: '#B4E0FF',
          300: '#7CC9FF',
          400: '#3FB0FF',
          500: '#1E9AF5',
          600: '#0B7FDB',
          700: '#0A66B3',
          800: '#0D5089',
          900: '#0F3F6B',
        },
        // Cinematic dark sections
        cine: {
          DEFAULT: '#06090F',
          soft: '#0C1119',
          line: '#1B2330',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
        arabic: ['var(--font-arabic)', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        '10xl': ['9rem', { lineHeight: '0.95', letterSpacing: '-0.03em' }],
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      boxShadow: {
        card: '0 2px 20px -4px rgba(15, 63, 107, 0.08), 0 1px 2px rgba(15, 63, 107, 0.04)',
        'card-hover': '0 16px 40px -8px rgba(15, 63, 107, 0.16), 0 2px 8px rgba(15, 63, 107, 0.06)',
        glow: '0 0 0 1px rgba(63, 176, 255, 0.15), 0 8px 40px -4px rgba(63, 176, 255, 0.35)',
        'glow-lg': '0 0 0 1px rgba(63, 176, 255, 0.2), 0 20px 60px -10px rgba(63, 176, 255, 0.4)',
        nav: '0 8px 32px -8px rgba(15, 63, 107, 0.18)',
        'dark-card': '0 2px 20px -4px rgba(0,0,0,0.45), 0 1px 2px rgba(0,0,0,0.3)',
        'dark-card-hover': '0 16px 40px -8px rgba(0,0,0,0.55), 0 0 0 1px rgba(56,189,248,0.12)',
        'dark-nav': '0 8px 32px -8px rgba(0,0,0,0.5)',
      },
      backgroundImage: {
        'sky-radial': 'radial-gradient(circle at 50% 0%, rgba(63,176,255,0.16), transparent 60%)',
        'sky-grad': 'linear-gradient(135deg, #3FB0FF 0%, #0B7FDB 100%)',
        'nav-glass': 'linear-gradient(135deg, rgba(239,248,255,0.85) 0%, rgba(220,239,255,0.7) 100%)',
      },
      animation: {
        marquee: 'marquee 38s linear infinite',
        'fade-up': 'fadeUp 0.7s cubic-bezier(0.16,1,0.3,1) forwards',
        'pulse-glow': 'pulseGlow 3.5s ease-in-out infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.5' },
          '50%': { opacity: '1' },
        },
      },
      transitionTimingFunction: {
        premium: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [],
};
